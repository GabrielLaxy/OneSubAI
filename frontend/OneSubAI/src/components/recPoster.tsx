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
	onResponse: (res: 'liked' | 'disliked') => void;
};

export default function RecPoster({
	movieInfo,
	numOfCards,
	index,
	activeIndex,
	onResponse,
}: RecPosterProps) {
	const translationX = useSharedValue(0);

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
				translateY: interpolate(
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
			activeIndex.value = interpolate(
				Math.abs(translationX.value),
				[0, 500],
				[index, index + 0.8]
			);
		})
		.onEnd(event => {
			if (Math.abs(event.velocityX) > 100) {
				translationX.value = withSpring(Math.sign(event.velocityX) * 500, {
					velocity: event.velocityX,
				});
				activeIndex.value = withSpring(index + 1);
				runOnJS(onResponse)(event.velocityX > 0 ? 'liked' : 'disliked');
			} else {
				translationX.value = withSpring(0);
			}
		});

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
}
