import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	Animated,
	Easing,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useUserContext } from '../contexts/userContext';
import styles from '../styles/homeStyle';
import theme from '../theme';

type FilterType = 'anos' | 'meses' | 'dias';
type Plano = {
	id: number;
	dataAssinada: string;
	preço: number;
	name: string;
	vencimento: 'Mensal' | 'Anual';
};

export default function Home() {
	const [filter, setFilter] = useState<FilterType>('anos');
	const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
	const { user } = useUserContext();
	const planos = user?.planos || [];

	// Cálculos de gastos
	const calcularGastoMes = (
		ano: number,
		mes: number,
		planos: Plano[]
	): number => {
		return planos.reduce((total, plano) => {
			const [dia, mesStr, anoStr] = plano.dataAssinada.split('/').map(Number);
			const dataAssinada = new Date(anoStr, mesStr - 1, dia);
			const fimDoMes = new Date(ano, mes + 1, 0);

			if (plano.vencimento === 'Mensal' && dataAssinada <= fimDoMes) {
				return total + plano.preço;
			}
			if (
				plano.vencimento === 'Anual' &&
				mes === dataAssinada.getMonth() &&
				ano >= dataAssinada.getFullYear()
			) {
				return total + plano.preço;
			}
			return Number(total.toFixed(1));
		}, 0);
	};

	const calcularGastosUltimos5Meses = (planos: Plano[]): number[] => {
		const hoje = new Date();
		return Array.from({ length: 5 }, (_, i) => {
			const data = new Date(hoje.getFullYear(), hoje.getMonth() - (4 - i), 1);
			return calcularGastoMes(data.getFullYear(), data.getMonth(), planos);
		});
	};

	const calcularGastoAno = (ano: number, planos: Plano[]): number => {
		const anoAtual = new Date().getFullYear();
		const mesAtual = new Date().getMonth();
		const limiteMes = ano === anoAtual ? mesAtual : 11;

		let total = 0;
		for (let mes = 0; mes <= limiteMes; mes++) {
			total += calcularGastoMes(ano, mes, planos);
		}
		return Number(total.toFixed(1));
	};

	const calcularGastosUltimos5Anos = (planos: Plano[]): number[] => {
		const anoAtual = new Date().getFullYear();
		return Array.from({ length: 5 }, (_, i) =>
			calcularGastoAno(anoAtual - (4 - i), planos)
		);
	};

	const calcularGastosUltimosDias = (
		planos: Plano[],
		quantidadeDias: number = 5
	): number[] => {
		if (!planos?.length) return Array(quantidadeDias).fill(0);

		const hoje = new Date();
		return Array.from({ length: quantidadeDias }, (_, i) => {
			const data = new Date(hoje);
			data.setDate(hoje.getDate() - (quantidadeDias - 1 - i));
			data.setHours(0, 0, 0, 0);

			return planos.reduce((acc, plano) => {
				const [diaStr, mesStr, anoStr] = plano.dataAssinada.split('/');
				const dataPlano = new Date(
					parseInt(anoStr, 10),
					parseInt(mesStr, 10) - 1,
					parseInt(diaStr, 10)
				);
				dataPlano.setHours(0, 0, 0, 0);

				return dataPlano.getTime() === data.getTime() ? acc + plano.preço : acc;
			}, 0);
		});
	};

	// Navegação
	const navigation = useNavigation();

	// Dados e labels
	const gastosUltimos5Meses = calcularGastosUltimos5Meses(planos);
	const gastosUltimos5Anos = calcularGastosUltimos5Anos(planos);
	const gastosUltimos5Dias = calcularGastosUltimosDias(planos, 5);

	const data: Record<FilterType, number[]> = {
		anos: gastosUltimos5Anos,
		meses: gastosUltimos5Meses,
		dias: gastosUltimos5Dias,
	};

	const getLastFiveDaysLabels = () => {
		const today = new Date();
		return Array.from({ length: 5 }, (_, i) => {
			const day = new Date(today);
			day.setDate(today.getDate() - (4 - i));
			return day.getDate().toString();
		});
	};

	const getLastFiveMonthsLabels = (): string[] => {
		const monthLabels = [
			'Jan',
			'Fev',
			'Mar',
			'Abr',
			'Mai',
			'Jun',
			'Jul',
			'Ago',
			'Set',
			'Out',
			'Nov',
			'Dez',
		];
		const today = new Date();
		return Array.from({ length: 5 }, (_, i) => {
			const monthDate = new Date(today);
			monthDate.setMonth(today.getMonth() - (4 - i));
			return monthLabels[monthDate.getMonth()];
		});
	};

	const getLastFiveYearsLabels = () => {
		const today = new Date();
		return Array.from({ length: 5 }, (_, i) =>
			(today.getFullYear() - (4 - i)).toString()
		);
	};

	const labelsByFilter: Record<FilterType, string[]> = {
		anos: getLastFiveYearsLabels(),
		meses: getLastFiveMonthsLabels(),
		dias: getLastFiveDaysLabels(),
	};

	// Configurações do gráfico
	const currentData = data[filter];
	const labels = labelsByFilter[filter];
	const maxGasto = Math.max(...currentData);
	const maxValue = Math.ceil(maxGasto / 10) * 10 || 100;
	const maxBarHeight = 150;
	const passos = 5;
	const step = maxValue / passos;
	const scale = Array.from({ length: passos + 1 }, (_, i) =>
		Math.round(i * step)
	);

	// Animações
	const animatedValues = useRef(
		currentData.map(
			value => new Animated.Value((value / maxValue) * maxBarHeight)
		)
	).current;
	const selectedBarAnimatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		setSelectedBarIndex(null);
		currentData.forEach((value, i) => {
			Animated.timing(animatedValues[i], {
				toValue: (value / maxValue) * maxBarHeight,
				duration: 600,
				easing: Easing.out(Easing.exp),
				useNativeDriver: false,
			}).start();
		});
	}, [filter, maxValue]);

	useEffect(() => {
		if (selectedBarIndex !== null) {
			selectedBarAnimatedValue.setValue(0);
			Animated.timing(selectedBarAnimatedValue, {
				toValue: (currentData[selectedBarIndex] / maxValue) * maxBarHeight,
				duration: 300,
				easing: Easing.out(Easing.exp),
				useNativeDriver: false,
			}).start();
		} else {
			selectedBarAnimatedValue.setValue(0);
		}
	}, [selectedBarIndex, currentData]);

	// Funções auxiliares
	const diasRestantes = (dataFutura: Date | null): string => {
		if (!dataFutura) return 'Data inválida';
		const diffDias = Math.ceil(
			(dataFutura.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
		);
		return diffDias <= 0 ? 'Expirado' : `Restam ${diffDias} dias`;
	};

	const getPercentageChange = (currentIndex: number) => {
		if (currentIndex === 0 || currentData[currentIndex - 1] === 0) return null;
		const change =
			((currentData[currentIndex] - currentData[currentIndex - 1]) /
				currentData[currentIndex - 1]) *
			100;
		return Math.round(change).toString();
	};

	const formatarPreco = (valor: number): string =>
		`R$ ${valor.toFixed(2).replace('.', ',')}`;

	const getStreamingInfoById = (id: number) => {
		const firstChar = id.toString()[0];
		const providers = {
			'1': {
				image: require('../../assets/providers-logo/netflix-logo-hd.png'),
				name: 'Netflix',
			},
			'2': {
				image: require('../../assets/providers-logo/prime-video-logo-hd.png'),
				name: 'Prime Video',
			},
			'3': {
				image: require('../../assets/providers-logo/max-logo-hd.png'),
				name: 'Max',
			},
			'4': {
				image: require('../../assets/providers-logo/disney-plus-logo-hd.png'),
				name: 'Disney Plus',
			},
			'5': {
				image: require('../../assets/providers-logo/globoplay-logo-hd.png'),
				name: 'Globo Play',
			},
			default: {
				image: require('../../assets/providers-logo/globoplay-logo-hd.png'),
				name: 'Globo Play',
			},
		};
		return providers[firstChar as keyof typeof providers] || providers.default;
	};

	const parseDataBR = (dataStr: string): Date | null => {
		const [dia, mes, ano] = dataStr.split('/');
		return dia && mes && ano
			? new Date(`${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`)
			: null;
	};

	const calcularProximoVencimento = (
		dataAssinada: string,
		vencimento: 'Mensal' | 'Anual'
	): Date | null => {
		const dataInicio = parseDataBR(dataAssinada);
		if (!dataInicio) return null;

		const hoje = new Date();
		let proximoVencimento = new Date(dataInicio);

		while (proximoVencimento <= hoje) {
			vencimento === 'Mensal'
				? proximoVencimento.setMonth(proximoVencimento.getMonth() + 1)
				: proximoVencimento.setFullYear(proximoVencimento.getFullYear() + 1);
		}

		return proximoVencimento;
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
			<StatusBar animated={true} style="light" />
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<View style={styles.fakeHeader}>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							marginBottom: 60,
						}}
					>
						<Text
							style={{
								color: 'white',
								fontSize: 14,
								fontFamily: 'Poppins-SemiBold',
							}}
						>
							Gastos ativos
						</Text>
						<Text
							style={{
								color: 'white',
								fontSize: 36,
								fontFamily: 'Poppins-SemiBold',
								marginTop: 4,
							}}
						>
							{formatarPreco(
								calcularGastoMes(
									new Date().getFullYear(),
									new Date().getMonth(),
									planos
								)
							)}
						</Text>
					</View>
				</View>

				<View style={styles.secondLayer}>
					<View style={styles.dashboard}>
						<View style={styles.dashboardTexts}>
							<Text style={styles.dashboardParagraph}>Painel</Text>
							<Text style={styles.dashboardTitle}>Gastos</Text>
						</View>

						<View style={styles.dashboardLabels}>
							<View style={styles.graphic}>
								{(['anos', 'meses', 'dias'] as FilterType[]).map(item => (
									<TouchableOpacity
										key={item}
										onPress={() => setFilter(item)}
										style={[
											styles.labelBase,
											{
												backgroundColor:
													filter === item
														? theme.colors.primary
														: theme.colors.accent,
											},
										]}
									>
										<Text
											style={[
												styles.labelText,
												{
													color:
														filter === item
															? theme.colors.accent
															: theme.colors.labels,
												},
											]}
										>
											{item}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<TouchableWithoutFeedback onPress={() => setSelectedBarIndex(null)}>
							<View
								style={{
									flexDirection: 'row',
									paddingHorizontal: 20,
									paddingTop: 10,
								}}
							>
								<View style={styles.scaleContainer}>
									{scale.map(value => (
										<Text
											key={value}
											style={[
												styles.scaleText,
												{ bottom: (value / maxValue) * maxBarHeight - 6 },
											]}
										>
											R$ {value}
										</Text>
									))}
								</View>

								<View style={styles.graphContainer}>
									<View style={styles.barArea}>
										{selectedBarIndex === null &&
											currentData.map((_, index) => (
												<Animated.View
													key={`dash-none-${index}`}
													style={[
														styles.dashLineBase,
														{
															bottom: animatedValues[index],
															borderColor: theme.colors.dashboardBorder,
														},
													]}
												/>
											))}

										{selectedBarIndex !== null && (
											<Animated.View
												style={[
													styles.dashLineBase,
													{
														bottom: animatedValues[selectedBarIndex],
														borderColor: theme.colors.primary,
													},
												]}
											>
												<Animated.View
													style={[
														styles.dashDot,
														{ backgroundColor: theme.colors.primary },
													]}
												/>
												<Text
													style={[
														styles.dashValue,
														{ color: theme.colors.primary },
													]}
												>
													R${' '}
													{currentData[selectedBarIndex]
														.toFixed(1)
														.replace('.', ',')}
												</Text>
											</Animated.View>
										)}

										{selectedBarIndex !== null &&
											currentData.map((_, index) => {
												if (index === selectedBarIndex) return null;
												return (
													<Animated.View
														key={`dash-${index}`}
														style={[
															styles.dashLineBase,
															{
																bottom: animatedValues[index],
																borderColor: theme.colors.dashboardBorder,
															},
														]}
													/>
												);
											})}

										{currentData.map((value, index) => {
											const barWidth = 30;
											const isSelected = selectedBarIndex === index;
											const percentageChange = getPercentageChange(index);
											const selectedBarHeight =
												(value / maxValue) * maxBarHeight;

											return (
												<View
													key={index}
													style={[
														styles.barContainer,
														{ position: 'relative' },
													]}
												>
													<TouchableOpacity
														activeOpacity={0.8}
														onPress={() => setSelectedBarIndex(index)}
														style={styles.barTouchArea}
													>
														<Animated.View
															style={{
																width: barWidth,
																borderRadius: 8,
																backgroundColor:
																	selectedBarIndex === null || isSelected
																		? theme.colors.primary
																		: theme.colors.dashboardBorder,
																height: animatedValues[index],
															}}
														/>
													</TouchableOpacity>

													{isSelected && percentageChange && (
														<View
															style={{
																position: 'absolute',
																bottom: selectedBarHeight + 10,
																left: 0,
																right: 0,
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	backgroundColor: 'black',
																	width: 40,
																	justifyContent: 'center',
																	paddingHorizontal: 6,
																	paddingVertical: 2,
																	borderRadius: 4,
																}}
															>
																<Text
																	style={{
																		color: 'white',
																		fontWeight: 'bold',
																		fontSize: 9,
																		textAlign: 'center',
																	}}
																>
																	{(percentageChange > '0' ? '+' : '') +
																		percentageChange +
																		'%'}
																</Text>
															</View>
														</View>
													)}

													<Text style={styles.labelTextBelow}>
														{labels[index]}
													</Text>
												</View>
											);
										})}
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>

					<View style={styles.subscribes}>
						<View style={styles.subscribesTexts}>
							<Text style={styles.subscribesTitle}>Suas assinaturas &gt;</Text>
							<Text style={styles.subscribesParagraph}>
								Você tem {user.planos.length} assinaturas
							</Text>
						</View>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						>
							<View style={styles.subs}>
								{user?.planos?.map((plano: Plano) => {
									const streamingInfo = getStreamingInfoById(plano.id);
									return (
										<View key={plano.id} style={styles.subscribeSquare}>
											<Image
												source={streamingInfo.image}
												style={styles.streamingImage}
											/>
											<Text style={styles.streamingTitle}>
												{streamingInfo.name}
											</Text>
											<Text style={styles.subscribeExpirationAlert}>
												{diasRestantes(
													calcularProximoVencimento(
														plano.dataAssinada,
														plano.vencimento
													)
												)}
											</Text>
											<Text style={styles.subscribePreco}>
												{Number(plano.preço).toFixed(2).replace('.', ',')}
											</Text>
										</View>
									);
								})}
							</View>
						</ScrollView>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
