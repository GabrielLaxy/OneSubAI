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
import styles from '../styles/homeStyle';
import theme from '../theme';

type FilterType = 'all' | 'year' | 'months' | 'days';

export default function Home() {
	const [filter, setFilter] = useState<FilterType>('all');
	const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

	const data: Record<FilterType, number[]> = {
		all: [50, 80, 40, 95, 70],
		year: [70, 40, 90, 30, 60],
		months: [20, 60, 80, 55, 40],
		days: [10, 40, 70, 50, 90],
	};

	const labelsByFilter: Record<FilterType, string[]> = {
		all: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
		year: ['2020', '2021', '2022', '2023', '2024'],
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
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

	const maxBarHeight = 150;
	const maxValue = 100;
	const step = Math.ceil(maxValue / 5);
	const scale = Array.from({ length: 6 }, (_, i) => i * step); // [0, 20, ..., 100]

	const currentData = data[filter];
	const labels = labelsByFilter[filter];

	const animatedValues = useRef(
		currentData.map(
			value => new Animated.Value((value / maxValue) * maxBarHeight)
		)
	).current;

	// Valor animado extra para a barra selecionada que anima do zero até o valor
	const selectedBarAnimatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Atualiza todas as barras quando o filtro muda (normalmente)
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

	const subs = [
		{
			id: 1,
			image: require('../../assets/providers-logo/netflix-logo-hd.png'),
			streaming: 'Netflix',
			dataExpiracao: new Date('2025-06-06'),
			preco: 'R$ 54,90',
		},
		{
			id: 2,
			image: require('../../assets/providers-logo/prime-video-logo-hd.png'),
			streaming: 'Prime Video',
			dataExpiracao: new Date('2025-06-30'),
			preco: 'R$ 36,90',
		},
		{
			id: 3,
			image: require('../../assets/providers-logo/max-logo-hd.png'),
			streaming: 'Max',
			dataExpiracao: new Date('2025-06-30'),
			preco: 'R$ 36,90',
		},
	];

	function diasRestantes(dataExpiracao: string | Date): string {
		const hoje = new Date();
		const expiracao = new Date(dataExpiracao);

		// Zera as horas para comparar apenas datas (sem horas/minutos/segundos)
		hoje.setHours(0, 0, 0, 0);
		expiracao.setHours(0, 0, 0, 0);

		const diffEmMs = expiracao.getTime() - hoje.getTime();
		const diffEmDias = Math.ceil(diffEmMs / (1000 * 60 * 60 * 24));

		if (diffEmDias > 0) {
			return `${diffEmDias} dias restantes`;
		} else if (diffEmDias === 0) {
			return `Expira hoje`;
		} else {
			return `Expirado há ${Math.abs(diffEmDias)} dias`;
		}
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
							R$ 135,00
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
								{(['all', 'year', 'months', 'days'] as FilterType[]).map(
									item => (
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
									)
								)}
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
																height: isSelected
																	? selectedBarAnimatedValue
																	: animatedValues[index],
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
								You have {subs.length} subscriptions
							</Text>
						</View>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						>
							<View style={styles.subs}>
								{subs.map(sub => (
									<View key={sub.id} style={styles.subscribeSquare}>
										<Image
											source={sub.image}
											style={styles.streamingImage}
										></Image>
										<Text style={styles.streamingTitle}>{sub.streaming}</Text>
										<Text style={styles.subscribeExpirationAlert}>
											{diasRestantes(sub.dataExpiracao)}
										</Text>
										<Text style={styles.subscribePreco}>{sub.preco}</Text>
									</View>
								))}
							</View>
						</ScrollView>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
