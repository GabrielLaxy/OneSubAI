import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
	Animated,
	Easing,
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
		<View style={{ flex: 1, backgroundColor: theme.colors.accent }}>
			<StatusBar animated={true} style="light" />
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<View style={styles.fakeHeader} />

				<View style={styles.secondLayer}>
					<View style={styles.dashboard}>
						<View style={styles.dashboardTexts}>
							<Text style={styles.dashboardParagraph}>Dashboard</Text>
							<Text style={styles.dashboardTitle}>Expensives</Text>
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
											return (
												<View key={index} style={styles.barContainer}>
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
																	selectedBarIndex === null ||
																	selectedBarIndex === index
																		? theme.colors.primary
																		: theme.colors.dashboardBorder,
																height: animatedValues[index],
															}}
														/>
													</TouchableOpacity>

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
				</View>
			</ScrollView>
		</View>
	);
}
