import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
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

type FilterType = 'year' | 'months' | 'days';

export default function Home() {
	const [filter, setFilter] = useState<FilterType>('year');
	const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

	const { user } = useUserContext();
	const planos = user?.planos || [];

	type Plano = {
		id: number;
		dataAssinada: string;
		preço: number;
		name: string;
		vencimento: 'Mensal' | 'Anual';
	};

	function calcularGastoMes(ano: number, mes: number, planos: Plano[]): number {
		return planos.reduce((total, plano) => {
			const [dia, mesStr, anoStr] = plano.dataAssinada.split('/').map(Number);
			const dataAssinada = new Date(anoStr, mesStr - 1, dia);
			const fimDoMes = new Date(ano, mes + 1, 0);

			if (plano.vencimento === 'Mensal') {
				if (dataAssinada <= fimDoMes) {
					return total + plano.preço;
				}
			} else if (plano.vencimento === 'Anual') {
				if (
					mes === dataAssinada.getMonth() &&
					ano >= dataAssinada.getFullYear()
				) {
					return total + plano.preço;
				}
			}

			return Number(total.toFixed(1));
		}, 0);
	}

	function calcularGastosUltimos5Meses(planos: Plano[]): number[] {
		const hoje = new Date();
		const gastos: number[] = [];

		for (let i = 4; i >= 0; i--) {
			const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
			const ano = data.getFullYear();
			const mes = data.getMonth(); // 0-based
			gastos.push(calcularGastoMes(ano, mes, planos));
		}

		return gastos.map(g => Number(g.toFixed(1)));
	}

	const gastosUltimos5Meses = calcularGastosUltimos5Meses(planos);

	function calcularGastoAno(ano: number, planos: Plano[]): number {
		const anoAtual = new Date().getFullYear();
		const mesAtual = new Date().getMonth(); // zero-based: janeiro=0, junho=5

		let total = 0;
		const limiteMes = ano === anoAtual ? mesAtual : 11; // se for ano atual, vai só até o mês atual, senão vai até dezembro (11)

		for (let mes = 0; mes <= limiteMes; mes++) {
			total += calcularGastoMes(ano, mes, planos);
		}
		return Number(total.toFixed(1));
	}

	function calcularGastosUltimos5Anos(planos: Plano[]): number[] {
		const anoAtual = new Date().getFullYear();
		return Array.from({ length: 5 }, (_, i) => {
			const ano = anoAtual - (4 - i);
			return Number(calcularGastoAno(ano, planos).toFixed(1));
		});
	}

	const gastosUltimos5Anos = calcularGastosUltimos5Anos(planos);

	function calcularGastosUltimosDias(
		planos: Plano[],
		quantidadeDias: number = 5
	): number[] {
		if (!planos || planos.length === 0) return Array(quantidadeDias).fill(0);

		const hoje = new Date();

		// Cria um array com os últimos `quantidadeDias` datas
		const dias = Array.from({ length: quantidadeDias }, (_, i) => {
			const data = new Date(hoje);
			data.setDate(hoje.getDate() - (quantidadeDias - 1 - i));
			data.setHours(0, 0, 0, 0); // zera a hora
			return data;
		});

		return dias.map(dia => {
			const total = planos.reduce((acc, plano) => {
				const [diaStr, mesStr, anoStr] = plano.dataAssinada.split('/');
				const dataPlano = new Date(
					parseInt(anoStr, 10),
					parseInt(mesStr, 10) - 1,
					parseInt(diaStr, 10)
				);
				dataPlano.setHours(0, 0, 0, 0); // zera a hora

				if (dataPlano.getTime() === dia.getTime()) {
					return acc + plano.preço;
				}
				return acc;
			}, 0);

			return Number(total.toFixed(1));
		});
	}

	const gastosUltimos5Dias = calcularGastosUltimosDias(planos, 5);

	const data: Record<FilterType, number[]> = {
		year: gastosUltimos5Anos,
		months: gastosUltimos5Meses,
		days: gastosUltimos5Dias,
	};

	const labelsByFilter: Record<FilterType, string[]> = {
		year: getLastFiveYearsLabels(),
		months: getLastFiveMonthsLabels(),
		days: getLastFiveDaysLabels(),
	};

	function getLastFiveDaysLabels() {
		const labels = [];
		const today = new Date();
		for (let i = 4; i >= 0; i--) {
			const day = new Date(today);
			day.setDate(today.getDate() - i);
			labels.push(day.getDate().toString());
		}
		return labels;
	}

	function getLastFiveMonthsLabels(): string[] {
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
		const labels: string[] = [];
		const today = new Date();

		for (let i = 4; i >= 0; i--) {
			const monthDate = new Date(today);
			monthDate.setMonth(today.getMonth() - i);
			const mes = monthDate.getMonth(); // 0 a 11
			labels.push(monthLabels[mes]);
		}

		return labels;
	}

	function getLastFiveYearsLabels() {
		const labels = [];
		const today = new Date();

		for (let i = 4; i >= 0; i--) {
			const yearDate = new Date(today);
			yearDate.setFullYear(today.getFullYear() - i);
			labels.push(yearDate.getFullYear().toString());
		}

		return labels;
	}

	function gerarLegendaY(maximo: number, passos: number = 5): string[] {
		const intervalo = maximo / passos;
		const legenda = [];
		for (let i = passos; i >= 0; i--) {
			const valor = intervalo * i;
			legenda.push(valor.toFixed(1).replace('.', ','));
		}
		return legenda;
	}

	const currentData = data[filter];
	const labels = labelsByFilter[filter];

	const maxGasto = Math.max(...currentData);

	const maxValue = Math.ceil(maxGasto / 10) * 10 || 100; // arredonda pra cima múltiplo de 10, default 100

	// Gera escala dinâmica
	const passos = 5;
	const step = maxValue / passos;
	const scale = Array.from({ length: passos + 1 }, (_, i) =>
		Math.round(i * step)
	); // ex: [0, 20, 40, 60, 80, 100]

	const maxBarHeight = 150;

	// Atualiza animatedValues para usar maxValue correto
	const animatedValues = useRef(
		currentData.map(
			value => new Animated.Value((value / maxValue) * maxBarHeight)
		)
	).current;

	// Valor animado para barra selecionada
	const selectedBarAnimatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		setSelectedBarIndex(null); // Limpa imediatamente ao trocar o filtro

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
			// Começa do zero
			selectedBarAnimatedValue.setValue(0);
			// Anima a barra selecionada de 0 até seu valor real rápido
			Animated.timing(selectedBarAnimatedValue, {
				toValue: (currentData[selectedBarIndex] / maxValue) * maxBarHeight,
				duration: 300,
				easing: Easing.out(Easing.exp),
				useNativeDriver: false,
			}).start();
		} else {
			// Nenhuma selecionada, zera o valor animado para não mostrar
			selectedBarAnimatedValue.setValue(0);
		}
	}, [selectedBarIndex, currentData]);

	function diasRestantes(dataFutura: Date | null): string {
		if (!dataFutura) return 'Data inválida';

		const hoje = new Date();
		const diffMs = dataFutura.getTime() - hoje.getTime();
		const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

		if (diffDias <= 0) return 'Expirado';

		return `Restam ${diffDias} dias`;
	}

	function getPercentageChange(currentIndex: number) {
		if (currentIndex === 0) return null; // sem anterior, não tem variação

		const currentValue = currentData[currentIndex];
		const previousValue = currentData[currentIndex - 1];

		if (previousValue === 0) return null; // evita divisão por zero

		const change = ((currentValue - previousValue) / previousValue) * 100;
		return Math.round(change).toString(); // arredonda para inteiro e converte pra string
	}

	useEffect(() => {
		currentData.forEach((value, i) => {
			Animated.timing(animatedValues[i], {
				toValue: (value / maxValue) * maxBarHeight,
				duration: 600,
				easing: Easing.out(Easing.exp),
				useNativeDriver: false,
			}).start();
		});
		setSelectedBarIndex(null);
	}, [filter]);

	function formatarPreco(valor: number): string {
		return `R$ ${valor.toFixed(2).replace('.', ',')}`;
	}

	function getStreamingInfoById(id: number) {
		const firstChar = id.toString()[0];
		switch (firstChar) {
			case '1':
				return {
					image: require('../../assets/providers-logo/netflix-logo-hd.png'),
					name: 'Netflix',
				};
			case '2':
				return {
					image: require('../../assets/providers-logo/prime-video-logo-hd.png'),
					name: 'Prime Video',
				};
			case '3':
				return {
					image: require('../../assets/providers-logo/max-logo-hd.png'),
					name: 'Max',
				};
			default:
				return {
					image: require('../../assets/providers-logo/max-logo-hd.png'), // padrão
					name: 'Outro',
				};
		}
	}

	function parseDataBR(dataStr: string): Date | null {
		const [dia, mes, ano] = dataStr.split('/');
		if (!dia || !mes || !ano) return null;
		// Criando data no formato ISO (YYYY-MM-DD) que o JS entende bem:
		return new Date(`${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
	}

	function calcularProximoVencimento(
		dataAssinada: string,
		vencimento: 'Mensal' | 'Anual'
	): Date | null {
		const dataInicio = parseDataBR(dataAssinada);
		if (!dataInicio) return null;

		const hoje = new Date();

		let proximoVencimento = new Date(dataInicio);

		while (proximoVencimento <= hoje) {
			if (vencimento === 'Mensal') {
				proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
			} else if (vencimento === 'Anual') {
				proximoVencimento.setFullYear(proximoVencimento.getFullYear() + 1);
			} else {
				return null;
			}
		}

		return proximoVencimento;
	}

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
							<Text style={styles.dashboardParagraph}>Dashboard</Text>
							<Text style={styles.dashboardTitle}>Expenses</Text>
						</View>

						<View style={styles.dashboardLabels}>
							<View style={styles.graphic}>
								{(['year', 'months', 'days'] as FilterType[]).map(item => (
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
								{/* Escala lateral */}
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

								{/* Gráfico */}
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
													R$ {currentData[selectedBarIndex]}
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

										{/* Barras e labels */}
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
																height: animatedValues[index], // Sempre usa o valor animado correto do dado atual
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
					{/* dashboard */}
					<View style={styles.subscribes}>
						<View style={styles.subscribesTexts}>
							<Text style={styles.subscribesTitle}>Your Subscribes &gt;</Text>
							<Text style={styles.subscribesParagraph}>
								You have {user.planos.length} subscriptions
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
