import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton, TouchableRipple } from 'react-native-paper';
import {
	useAnimatedReaction,
	useSharedValue,
	runOnJS,
} from 'react-native-reanimated';
import RecPoster from '../components/recPoster';
import { useMovies } from '../contexts/moviesContext';
import styles from '../styles/recScreenStyle';

export default function RecScreen() {
	const { movies } = useMovies();
	const activeIndex = useSharedValue(0);
	const [index, setIndex] = useState(0);

	// Crie refs para cada card
	const posterRefs = useRef<
		(null | { like: () => void; dislike: () => void; skip: () => void })[]
	>([]);

	const onReponse = (res: 'liked' | 'disliked' | 'skipped') => {
		if (res === 'liked') {
			console.log('Movie liked');
		} else if (res === 'disliked') {
			console.log('Movie disliked');
		} else if (res === 'skipped') {
			console.log('Movie skipped');
		}
	};

	useAnimatedReaction(
		() => activeIndex.value,
		(value, prevValue) => {
			if (Math.floor(value) !== index) {
				runOnJS(setIndex)(Math.floor(value));
			}
		}
	);

	useEffect(
		() => console.log('Active Index:', activeIndex.value),
		[activeIndex.value]
	);

	const onLike = () => {
		posterRefs.current[index]?.like();
	};

	const onDislike = () => {
		posterRefs.current[index]?.dislike();
	};

	const onNeverSeen = () => {
		posterRefs.current[index]?.skip();
	};

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />
			<View style={styles.topContainer}>
				{movies.map((movie, idx) => (
					<RecPoster
						key={movie.id}
						ref={el => (posterRefs.current[idx] = el as { like: () => void; dislike: () => void; skip: () => void } | null)}
						movieInfo={movie}
						numOfCards={movies.length}
						index={idx}
						activeIndex={activeIndex}
						onResponse={onReponse}
					/>
				))}
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
