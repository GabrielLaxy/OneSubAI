import React, { useEffect, useState } from 'react';
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

	const onReponse = (res: "liked" | "disliked" ) => {
		if (res === "liked") {
			console.log("Movie liked");
		} else if (res === "disliked") {
			console.log("Movie disliked");
		}
	}

	useAnimatedReaction(
		() => activeIndex.value,
		(value, prevValue) => {
			if (Math.floor(value) !== index) {
				runOnJS(setIndex)(Math.floor(value));
			}
		}
	);

	useEffect(() => console.log('Active Index:', activeIndex.value), [activeIndex.value]);

	const onLike = () => {
		console.log('Liked');
	};

	const onDislike = () => {
		console.log('Disliked');
	};

	const onNeverSeen = () => {
		console.log('Never Seen');
	};

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />
			<View style={styles.topContainer}>
				{movies.map((movie, index) => (
					<RecPoster
						key={movie.id}
						movieInfo={movie}
						numOfCards={movies.length}
						index={index}
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
