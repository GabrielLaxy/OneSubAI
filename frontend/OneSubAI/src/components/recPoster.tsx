import { View, Image, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/recPosterStyle'; 

type RecPosterProps = {
	posterUrl: string;
	title: string;
	genres: string[];
};

export default function RecPoster({
	posterUrl,
	title,
	genres,
}: RecPosterProps) {
	return (
		<View style={styles.posterContainer}>
			<ImageBackground source={{ uri: posterUrl }} style={styles.posterImage}>
				<View style={styles.imageContainer}>
					<LinearGradient
						colors={[
							'rgba(255, 255, 255, 0)',
							'rgba(0, 0, 0, 0.35)',
							'rgba(0, 0, 0, 1)',
						]}
						style={styles.backgroundGradient}
					>
						<Text
							style={[
								styles.title,
								{
									fontSize:
										title.trim().split(/\s+/).length === 1
											? 48
											: Math.max(
													24,
													48 - 5 * (title.trim().split(/\s+/).length - 1)
											  ),
								},
							]}
						>
							{title}
						</Text>
						<Text style={styles.genres}>{genres.slice(0, 2).join(' • ')}</Text>
					</LinearGradient>
				</View>
			</ImageBackground>
		</View>
	);
}
