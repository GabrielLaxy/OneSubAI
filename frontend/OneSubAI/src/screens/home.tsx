import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Animated,
	Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from '../styles/homeStyle';
import theme from '../theme';

type FilterType = 'all' | 'year' | 'months' | 'weeks' | 'days';

export default function Home() {
	const [filter, setFilter] = useState<FilterType>('all');

	const data: Record<FilterType, number[]> = {
		all: [50, 80, 40, 95, 70],
		year: [70, 40, 90, 30, 60],
		months: [20, 60, 80, 55, 40],
		weeks: [30, 50, 60, 80, 20],
		days: [10, 40, 70, 50, 90],
	};

	const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
	const maxBarHeight = 150;

	const currentData = data[filter];

	const animatedValues = useRef(
		currentData.map(value => new Animated.Value((value / 100) * maxBarHeight))
	).current;

	useEffect(() => {
		currentData.forEach((value, i) => {
			Animated.timing(animatedValues[i], {
				toValue: (value / 100) * maxBarHeight,
				duration: 600,
				easing: Easing.out(Easing.exp),
				useNativeDriver: false,
			}).start();
		});
	}, [filter]);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<StatusBar animated={true} style="light" />
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<View style={styles.fakeHeader} />

				<View style={styles.secondLayer}>
					<View style={styles.dashboard}>
						<Text style={styles.dashboardParagraph}>Dashboard</Text>
						<Text style={styles.dashboardTitle}>Expensives</Text>
						{/* Labels */}
						<View style={styles.graphic}>
							{['all', 'year', 'months', 'weeks', 'days'].map(item => (
								<TouchableOpacity
									key={item}
									onPress={() => setFilter(item as FilterType)}
									style={[
										styles.labelBase,
										{
											backgroundColor:
												filter === item
													? theme.colors.primary
													: theme.colors.background,
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
												textTransform: 'capitalize',
											},
										]}
									>
										{item}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						{/* Gráfico */}
						<View style={[styles.graphic, { height: maxBarHeight }]}>
							{currentData.map((_, index) => (
								<View key={index} style={styles.graphicBars}>
									<Animated.View
										style={[
											styles.bars,
											{
												height: animatedValues[index],
											},
										]}
									/>
									<Text style={styles.months}>{labels[index]}</Text>
								</View>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
