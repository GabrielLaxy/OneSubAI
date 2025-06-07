import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton, TouchableRipple } from 'react-native-paper';
import {
	postMovieResponse,
	getPartialRecommendation,
	getRandomMovie,
} from '../services/httpsRequests';
import {
	useAnimatedReaction,
	useSharedValue,
	runOnJS,
} from 'react-native-reanimated';
import RecPoster from '../components/recPoster';
import { useMovies } from '../contexts/moviesContext';
import { useUserContext } from '../contexts/userContext';
import styles from '../styles/recScreenStyle';

export default function RecScreen() {
	const { movies, setMovies } = useMovies();
	const activeIndex = useSharedValue(0);
	const [index, setIndex] = useState(0);
	const [validRatingsCount, setValidRatingsCount] = useState(0);
	const { userId } = useUserContext();

	const posterRefs = useRef<
		(null | { like: () => void; dislike: () => void; skip: () => void })[]
	>([]);

	const onReponse = (res: 1 | -1 | 0) => {
		if (res === 1 || res === -1 || res === 0) {
			const movieId = movies[index]?.id;
			if (movieId !== undefined) {
				postMovieResponse(userId, movieId, res)
					.then(async response => {
						if (response) {
							console.log('Resposta enviada com sucesso:', response);
							if (res === 1 || res === -1) {
								setValidRatingsCount(prev => {
									const newCount = prev + 1;
									if (newCount >= 2) {
										getPartialRecommendation(userId)
											.then(partial => {
												if (partial && partial.recomendados) {
													setMovies(prevMovies => [
														...prevMovies,
														partial.recomendados,
													]);
													console.log(
														'Partial recommendation:',
														partial.recomendados
													);
												}
											})
											.catch(error =>
												console.error(
													'Erro no getPartialRecommendation:',
													error
												)
											);
										return 0;
									}
									return newCount;
								});
							}
							if (res === 0) {
								console.log('Usuário deu skip no filme', movieId);
								getRandomMovie(userId)
									.then(randomMovie => {
										if (randomMovie && randomMovie.filme) {
											setMovies(prevMovies => [
												...prevMovies,
												randomMovie.filme,
											]);
										}
									})
									.catch(error =>
										console.error('Erro no getRandomMovie:', error)
									);
							}
						} else {
							console.error('Erro ao enviar resposta');
						}
					})
					.catch(error => console.error('Erro no postMovieResponse:', error));
			} else {
				console.error('movieId is undefined for index', index);
			}
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

	// useEffect(
	// 	() => console.log('Active Index:', activeIndex.value),
	// 	[activeIndex.value]
	// );

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
						ref={el =>
							(posterRefs.current[idx] = el as {
								like: () => void;
								dislike: () => void;
								skip: () => void;
							} | null)
						}
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
