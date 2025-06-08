import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton, TouchableRipple } from 'react-native-paper';
import {
	postMovieResponse,
	getPartialRecommendation,
	getRandomMovie,
	getFinalRecommendation,
	getMovieDescriptionById,
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
	const [receivedMovieIds, setReceivedMovieIds] = useState<number[]>([]);
	const [finalMovie, setFinalMovie] = useState<any>(null);
	const { userId } = useUserContext();
	const { width, height } = Dimensions.get('window');

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
							if (res === 1 || res === -1) {
								setValidRatingsCount(prev => {
									const newCount = prev + 1;
									setReceivedMovieIds(prevIds => [...prevIds, movieId]);
									if (newCount >= 2) {
										getPartialRecommendation(userId)
											.then(partial => {
												if (partial && partial.recomendados) {
													setMovies(prevMovies => [
														...prevMovies,
														partial.recomendados,
													]);
													setReceivedMovieIds(prevIds => [
														...prevIds,
														...(Array.isArray(partial.recomendados)
															? partial.recomendados.map((m: any) => m.id)
															: [partial.recomendados.id]),
													]);
												}
											})
											.catch(error =>
												console.error(
													'Erro no getPartialRecommendation:',
													error
												)
											);
									}
									return newCount;
								});
							}
							if (res === 0) {
								getRandomMovie(userId)
									.then(randomMovie => {
										if (randomMovie && randomMovie.filme) {
											setMovies(prevMovies => [
												...prevMovies,
												randomMovie.filme,
											]);
											// Não adiciona o ID ao receivedMovieIds aqui!
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

	const onLike = () => {
		posterRefs.current[index]?.like();
	};

	const onDislike = () => {
		posterRefs.current[index]?.dislike();
	};

	const onNeverSeen = () => {
		posterRefs.current[index]?.skip();
	};

	useEffect(() => {
		if (receivedMovieIds.length === 14) {
			const getAnotherMovie = async () => {
				const result = await getFinalRecommendation(userId);
				if (result && result.recomendados && result.recomendados.length > 0) {
					const movie = result.recomendados[0];
					// Busca a descrição do filme pelo id
					const descResult = await getMovieDescriptionById(movie.id);
					const descricao =
						descResult && descResult.descricao ? descResult.descricao : '';
					// Adiciona a descrição ao objeto movie
					const movieWithDesc = { ...movie, descricao };
					setFinalMovie(movieWithDesc);
				}
			};
			getAnotherMovie();
		} 
	}, [receivedMovieIds, userId]);

	useEffect(() => {
		console.log('receivedMovieIds atualizados:', receivedMovieIds);
	}, [receivedMovieIds]);

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
