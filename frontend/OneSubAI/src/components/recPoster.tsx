import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
	runOnJS,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import { PanGesture } from 'react-native-gesture-handler';

import styles from '../styles/recPosterStyle';

const screenWidth = Dimensions.get('screen').width;
const cardWidth = screenWidth * 0.87;

type RecPosterProps = {
	movieInfo: {
		id: number;
		poster_url: string;
		title_pt_br: string;
		genres: number[];
	};
	numOfCards: number;
	index: number;
	activeIndex: SharedValue<number>;
	onResponse: (res: 1 | -1 | 0) => void;
};

const RecPoster = forwardRef(function RecPoster(
	{ movieInfo, numOfCards, index, activeIndex, onResponse }: RecPosterProps,
	ref
) {
	const translationX = useSharedValue(0);
	const translationY = useSharedValue(0);

	const genreMap: Record<number, string> = {
		1: 'Animação',
		2: 'Aventura',
		3: 'Família',
		4: 'Comédia',
		5: 'Ação',
		6: 'Ficção científica',
		7: 'Drama',
		8: 'Fantasia',
		9: 'Romance',
		10: 'Terror',
		11: 'Thriller',
		12: 'Crime',
		13: 'Faroeste',
		14: 'Mistério',
		15: 'Música',
		16: 'História',
		17: 'Guerra',
		18: 'Cinema TV',
		19: 'Documentário',
	};

	function convertGenreIdsToNames(ids: number[]): string[] {
		return ids.map(id => genreMap[id] || 'Desconhecido');
	}

	const animatedCard = useAnimatedStyle(() => ({
		opacity: interpolate(
			activeIndex.value,
			[index - 1, index, index + 1],
			[1 - 1 / 5, 1, 1]
		),
		transform: [
			{
				scale: interpolate(
					activeIndex.value,
					[index - 1, index, index + 1],
					[0.95, 1, 1]
				),
			},
			{
				translateY:
					translationY.value +
					interpolate(
						activeIndex.value,
						[index - 1, index, index + 1],
						[-25, 0, 0]
					),
			},
			{
				translateX: translationX.value,
			},
			{
				rotateZ: `${interpolate(
					translationX.value,
					[-screenWidth / 2, 0, screenWidth / 2],
					[-15, 0, 15]
				)}deg`,
			},
		],
	}));

	const gesture = Gesture.Pan()
		.onChange(event => {
			translationX.value = event.translationX;
			translationY.value = event.translationY;
			activeIndex.value = interpolate(
				Math.max(Math.abs(translationX.value), Math.abs(translationY.value)),
				[0, 500],
				[index, index + 0.8]
			);
		})
		.onEnd(event => {
			const isHorizontal =
				Math.abs(event.velocityX) > Math.abs(event.velocityY);
			const velocityThreshold = 100;
			const distanceThreshold = 100;

			if (
				(isHorizontal && Math.abs(event.velocityX) > velocityThreshold) ||
				(!isHorizontal && event.velocityY > velocityThreshold)
			) {
				if (!isHorizontal && event.velocityY > velocityThreshold) {
					// Swipe para baixo
					translationY.value = withSpring(Math.sign(event.velocityY) * 900, {
						velocity: event.velocityY,
					});
				} else {
					// Swipe para os lados
					translationX.value = withSpring(Math.sign(event.velocityX) * 500, {
						velocity: event.velocityX,
					});
				}
				activeIndex.value = withSpring(index + 1);
				runOnJS(onResponse)(isHorizontal ? (event.velocityX > 0 ? 1 : -1) : 0);
			} else {
				translationX.value = withSpring(0);
				translationY.value = withSpring(0);
			}
		});

	useImperativeHandle(ref, () => ({
		like: () => {
			translationX.value = withSpring(500, { velocity: 800 });
			activeIndex.value = withSpring(index + 1);
			runOnJS(onResponse)(1);
		},
		dislike: () => {
			translationX.value = withSpring(-500, { velocity: 800 });
			activeIndex.value = withSpring(index + 1);
			runOnJS(onResponse)(-1);
		},
		skip: () => {
			translationY.value = withSpring(900, { velocity: 800 });
			activeIndex.value = withSpring(index + 1);
			runOnJS(onResponse)(0);
		},
	}));

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View
				style={[
					styles.posterContainer,
					animatedCard,
					{
						zIndex: numOfCards - index,
						transform: [],
					},
				]}
			>
				<Image
					style={[styles.posterImage, StyleSheet.absoluteFillObject]}
					source={{
						uri: movieInfo.poster_url,
					}}
				/>
				<LinearGradient
					colors={[
						'rgba(255, 255, 255, 0)',
						'rgba(0, 0, 0, 0.35)',
						'rgba(0, 0, 0, 1)',
					]}
					style={StyleSheet.absoluteFill}
				/>
				<Text
					style={[
						styles.title,
						{
							fontSize:
								movieInfo.title_pt_br.trim().split(/\s+/).length === 1
									? 48
									: Math.max(
											24,
											48 -
												5 *
													(movieInfo.title_pt_br.trim().split(/\s+/).length - 1)
									  ),
						},
					]}
				>
					{movieInfo.title_pt_br}
				</Text>
				<Text style={styles.genres}>
					{convertGenreIdsToNames(movieInfo.genres).slice(0, 2).join(' • ')}
				</Text>
			</Animated.View>
		</GestureDetector>
	);
});

export default RecPoster;
