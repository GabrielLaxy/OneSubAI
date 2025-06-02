import React, { forwardRef, useImperativeHandle } from 'react';
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
	movieInfo: { id: number; poster: string; title: string; genres: string[] };
	numOfCards: number;
	index: number;
	activeIndex: SharedValue<number>;
	onResponse: (res: 'liked' | 'disliked' | 'skipped') => void;
};

const RecPoster = forwardRef(function RecPoster(
	{ movieInfo, numOfCards, index, activeIndex, onResponse }: RecPosterProps,
	ref
) {
	const translationX = useSharedValue(0);
	const translationY = useSharedValue(0);

	const animatedCard = useAnimatedStyle(() => ({
		opacity: interpolate(
			activeIndex.value,
			[index - 1, index, index + 1],
			[1 - 1 / 5, 1, 1] //5 numero de cards que estao na tela
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
				runOnJS(onResponse)(
					isHorizontal
						? event.velocityX > 0
							? 'liked'
							: 'disliked'
						: 'skipped' // Você pode criar um novo tipo, ex: 'skipped'
				);
			} else {
				translationX.value = withSpring(0);
				translationY.value = withSpring(0);
			}
		});

	useImperativeHandle(ref, () => ({
		like: () => {
			translationX.value = withSpring(500, { velocity: 800 });
			activeIndex.value = withSpring(index + 1);
			runOnJS(onResponse)('liked');
		},
		dislike: () => {
			translationX.value = withSpring(-500, { velocity: 800 });
			activeIndex.value = withSpring(index + 1);
			runOnJS(onResponse)('disliked');
		},
		skip: () => {
			translationY.value = withSpring(900, { velocity: 800 });
			activeIndex.value = withSpring(index + 1);
			runOnJS(onResponse)('skipped');
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
						uri: movieInfo.poster,
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
								movieInfo.title.trim().split(/\s+/).length === 1
									? 48
									: Math.max(
											24,
											48 - 5 * (movieInfo.title.trim().split(/\s+/).length - 1)
									  ),
						},
					]}
				>
					{movieInfo.title}
				</Text>
				<Text style={styles.genres}>
					{movieInfo.genres.slice(0, 2).join(' • ')}
				</Text>
			</Animated.View>
		</GestureDetector>
	);
});

export default RecPoster;
