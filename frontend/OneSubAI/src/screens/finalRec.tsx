import {
	View,
	Text,
	Image,
	FlatList,
	Dimensions,
	ImageSourcePropType,
} from 'react-native';
import {
	GestureHandlerRootView,
	ScrollView,
} from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { useFinalMovie } from '../contexts/finalMovieContext';

import styles from '../styles/finalRecStyle';
import theme from '../theme';

const screenHeight = Dimensions.get('window').height;

export default function FinalRec() {
	const { finalMovie } = useFinalMovie();
	const bottomSheetRef = useRef(null);
	const snapPoints = useMemo(() => ['30%', '50%'], []);

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

	const providerLogos: Record<number, ImageSourcePropType> = {
		1: require('../../assets/providers-logo/netflix-logo-hd.png'),
		2: require('../../assets/providers-logo/prime-video-logo-hd.png'),
		3: require('../../assets/providers-logo/max-logo-hd.png'),
		4: require('../../assets/providers-logo/disney-plus-logo-hd.png'),
		5: require('../../assets/providers-logo/globoplay-logo-hd.png'),
	};

	function convertGenreIdsToNames(genreIds: number[] = []): string[] {
		return genreIds.map(id => genreMap[id]).filter(Boolean);
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.container}>
				<Image
					source={{
						uri: finalMovie?.poster_url,
					}}
					style={styles.posterImage}
				/>

				<BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
					<BottomSheetView style={styles.bottomSheetContainer}>
						<View style={styles.widthContainer}>
							<View style={styles.infoContainer}>
								<Text style={styles.title}>{finalMovie?.title_pt_br}</Text>

								<Text style={styles.genres}>
									{convertGenreIdsToNames(finalMovie?.genres)
										.slice(0, 2)
										.join(' • ')}
								</Text>
								<Text style={styles.providersTitle}>Disponível em: </Text>
								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<FlatList
										data={finalMovie?.providers || []}
										keyExtractor={item => item.toString()}
										horizontal
										renderItem={({ item }) => (
											<Image
												source={providerLogos[item]}
												style={{ width: 40, height: 40, marginRight: 8 }}
												resizeMode="contain"
											/>
										)}
										showsHorizontalScrollIndicator={false}
									/>
								</View>
								<View style={styles.overviewContainer}>
									<ScrollView showsVerticalScrollIndicator={true}>
										<View style={{ padding: 16 }}>
											<Text style={styles.overview}>
												{finalMovie?.overview}
											</Text>
										</View>
									</ScrollView>
								</View>
							</View>
						</View>
					</BottomSheetView>
				</BottomSheet>
			</View>
		</GestureHandlerRootView>
	);
}
