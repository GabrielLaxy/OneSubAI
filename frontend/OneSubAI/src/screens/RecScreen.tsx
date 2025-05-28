import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton, TouchableRipple } from 'react-native-paper';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
	useDerivedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import RecPoster from '../components/recPoster';
import styles from '../styles/recScreenStyle';
import theme from '../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

const cardsData = [
	{
		poster: 'https://image.tmdb.org/t/p/w500/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg',
		title: 'Batman: O Cavaleiro das Trevas',
		genres: ['Ação', 'Crime', 'Ficção Científica'],
	},
	{
		poster: 'https://image.tmdb.org/t/p/w500/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg',
		title: 'Interestelar',
		genres: ['Ficção Científica', 'Drama'],
	},
	// ...adicione mais cards...
];

export default function RecScreen() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const rotate = useSharedValue(0);

	const { width, height } = Dimensions.get('window');

	const nextCard = () => {
		setCurrentIndex(prev => Math.min(prev + 1, cardsData.length - 1));
		translateX.value = 0;
		translateY.value = 0;
		rotate.value = 0;
	};

	const onLike = () => {
		translateX.value = withSpring(width * 2, { damping: 10 }, () => {
			runOnJS(nextCard)();
		});
		translateY.value = withSpring(0, { damping: 10 });
		rotate.value = withSpring(10, { damping: 10 });
	};

	const onDislike = () => {
		translateX.value = withSpring(-width * 2, { damping: 10 }, () => {
			runOnJS(nextCard)();
		});
		translateY.value = withSpring(0, { damping: 10 });
		rotate.value = withSpring(-10, { damping: 10 });
	};

	const onNeverSeen = () => {
		translateX.value = withSpring(0, { damping: 10 });
		translateY.value = withSpring(height * 2, { damping: 10 }, () => {
			runOnJS(nextCard)();
		});
		rotate.value = withSpring(0, { damping: 10 });
	};

	const panGesture = Gesture.Pan()
		.onUpdate(event => {
			translateX.value = event.translationX;
			translateY.value = event.translationY;
			rotate.value = event.translationX * 0.1;
		})
		.onEnd(event => {
			const likeThreshold = 120;
			const dislikeThreshold = -120;
			const neverSeenThreshold = 120;
			const offScreenX = width * 2;
			const offScreenY = height * 2;

			if (event.translationX > likeThreshold) {
				translateX.value = withSpring(offScreenX, { damping: 10 }, () => {
					runOnJS(nextCard)();
				});
				translateY.value = withSpring(0, { damping: 10 });
				rotate.value = withSpring(10, { damping: 10 });
			} else if (event.translationX < dislikeThreshold) {
				translateX.value = withSpring(-offScreenX, { damping: 10 }, () => {
					runOnJS(nextCard)();
				});
				translateY.value = withSpring(0, { damping: 10 });
				rotate.value = withSpring(-10, { damping: 10 });
			} else if (event.translationY > neverSeenThreshold) {
				translateX.value = withSpring(0, { damping: 10 });
				translateY.value = withSpring(offScreenY, { damping: 10 }, () => {
					runOnJS(nextCard)();
				});
				rotate.value = withSpring(0, { damping: 10 });
			} else {
				translateX.value = withSpring(0, { damping: 10 });
				translateY.value = withSpring(0, { damping: 10 });
				rotate.value = withSpring(0, { damping: 10 });
			}
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ rotate: `${rotate.value}deg` },
		],
	}));

	const backCardScale = useDerivedValue(() => {
		// Quando o card da frente está no centro, escala 0.92; quando está quase fora, escala 1
		const progress = Math.min(
			Math.abs(translateX.value) / (width * 0.6) +
				Math.abs(translateY.value) / (height * 0.6),
			1
		);
		return 0.92 + 0.08 * progress;
	});

	const backCardAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: backCardScale.value }],
		opacity: 0.7,
	}));

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />
			<View style={styles.topContainer}>
				{cardsData
					.slice(currentIndex, currentIndex + 2)
					.reverse()
					.map((card, idx) => {
						const isTop = idx === 1 || cardsData.length - currentIndex === 1;
						if (isTop) {
							return (
								<GestureDetector key={card.title} gesture={panGesture}>
									<AnimatedView style={[styles.posterContainer, animatedStyle]}>
										<RecPoster
											posterUrl={card.poster}
											title={card.title}
											genres={card.genres}
										/>
									</AnimatedView>
								</GestureDetector>
							);
						} else {
							return (
								<AnimatedView
									key={card.title}
									style={{
										alignItems: 'center',
										justifyContent: 'center',
										position: 'absolute',
										width: '100%',
										height: '100%',
									}}
								>
									<RecPoster
										posterUrl={card.poster}
										title={card.title}
										genres={card.genres}
									/>
								</AnimatedView>
							);
						}
					})}
			</View>
			<View style={styles.bottomContainer}>
				<View style={styles.buttonContainer}>
					<IconButton
						icon="thumb-down"
						iconColor="white"
						mode="outlined"
						size={35}
						rippleColor={'#FF5B5B'}
						onPress={onDislike}
					/>
					<View style={styles.rippleContainer}>
						<TouchableRipple
							borderless={false}
							rippleColor={'white'}
							onPress={onNeverSeen}
							style={[styles.ripple, { borderRadius: 20, overflow: 'hidden' }]}
						>
							<Text style={styles.buttonText}>NUNCA ASSISTI</Text>
						</TouchableRipple>
					</View>
					<IconButton
						icon="thumb-up"
						iconColor="white"
						mode="outlined"
						size={35}
						rippleColor={'#63FF80'}
						onPress={onLike}
					/>
				</View>
			</View>
		</View>
	);
}
