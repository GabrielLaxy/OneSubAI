import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

import { useMovies } from '../contexts/moviesContext';
import { useUserContext } from '../contexts/userContext';
import { getInitialMovies } from '../services/httpsRequests';

import theme from '../theme';

export default function PlansScreen({ navigation }: any) {
	const { setMovies } = useMovies();
	const { userId } = useUserContext();
	const [loading, setLoading] = useState(false);

	async function handleMovies() {
		const data = await getInitialMovies(userId);
		if (data && data.filmes) {
			setMovies(data.filmes);
		}
		navigation.navigate('RecScreen');
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.subtitle}>
					Encontre seu próximo filme {'\n'}
					<Text style={styles.bold}>preferido</Text>
					<Text style={styles.subtitle}> usando </Text>
					<Text style={styles.bold}>Inteligência{'\n'}Artificial</Text>
				</Text>
				<Card style={styles.card}>
					<Card.Content style={styles.cardContent}>
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<View style={styles.cardHeader}>
								<Image
									source={require('../../assets/logo-roxo.png')}
									style={styles.planIcon}
								/>
								<Text style={styles.planTitle}>Standard</Text>
							</View>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginBottom: 4,
							}}
						>
							<View style={styles.dot} />
							<Text style={styles.benefit}>
								Comece a descobrir filmes com o seu estilo
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginBottom: 4,
							}}
						>
							<View style={styles.dot} />
							<Text style={styles.benefit}>
								Recomendações simples baseadas no que você curte
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginBottom: 4,
							}}
						>
							<View style={styles.dot} />
							<Text style={styles.benefit}>
								Explore sugestões e encontre algo novo para assistir.
							</Text>
						</View>
					</Card.Content>
					<Button
						mode="contained"
						style={styles.button}
						labelStyle={styles.buttonLabel}
						onPress={handleMovies}
						loading={loading}
						disabled={loading}
					>
						Iniciar
					</Button>
				</Card>
				<Card style={styles.card}>
					<Card.Content style={styles.cardContent}>
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<View style={styles.cardHeader}>
								<Image
									source={require('../../assets/logo-pro.png')}
									style={styles.planIcon2}
								/>
								<Text style={styles.planTitle}>Pro</Text>
							</View>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginBottom: 4,
							}}
						>
							<View style={styles.dot} />
							<Text style={styles.benefit}>
								Recomendações inteligentes feitas sob medida pra você
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginBottom: 4,
							}}
						>
							<View style={styles.dot} />
							<Text style={styles.benefit}>
								Algoritmo avançado que entende seu gosto como ninguém
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginBottom: 4,
							}}
						>
							<View style={styles.dot} />
							<Text style={styles.benefit}>
								Descubra títulos certeiros com personalização total
							</Text>
						</View>
					</Card.Content>
					<Button
						mode="contained"
						style={styles.button}
						labelStyle={styles.buttonLabel}
						onPress={() => {}}
						disabled
					>
						Escolher este plano
					</Button>
					<View style={styles.commingSoon}>
						<AntDesign
							name="lock1"
							size={160}
							color="white"
							style={styles.commingSoonIcon}
						/>
						<Text style={styles.commingSoonText}>Em breve</Text>
					</View>
				</Card>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#7B2CBF',
	},
	content: {
		padding: 16,
		paddingBottom: 100,
	},
	logoText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		marginVertical: 8,
	},
	subtitle: {
		color: 'white',
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
		fontSize: 14,
		marginBottom: 20,
	},
	bold: {
		fontFamily: 'Poppins-Bold',
	},
	card: {
		padding: 10,
		borderRadius: 16,
		marginBottom: 24,
		overflow: 'hidden',
		backgroundColor: theme.colors.accent,
	},
	cardContent: {
		paddingVertical: 16,
		paddingHorizontal: 20,
		backgroundColor: theme.colors.accent,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 17,
		gap: 15,
	},
	planIcon: {
		width: 26,
		height: 42,
	},
	planIcon2: {
		width: 39,
		height: 45.8,
	},
	planTitle: {
		fontSize: 27,
		fontFamily: 'Poppins-Bold',
	},
	benefit: {
		fontFamily: 'Poppins-Regular',
		fontSize: 14,
		color: '#535353',
		marginVertical: 2,
	},
	disabledBenefit: {
		fontSize: 14,
		color: 'gray',
		marginVertical: 2,
	},
	button: {
		backgroundColor: theme.colors.primary,
		fontFamily: 'Poppins-Medium',
		borderRadius: 50,
		marginHorizontal: 16,
		marginBottom: 16,
	},
	buttonLabel: {
		color: 'white',
		fontFamily: 'Poppins-Medium',
	},
	bottomNav: {
		position: 'absolute',
		bottom: 16,
		left: 32,
		right: 32,
		backgroundColor: 'white',
		borderRadius: 32,
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 12,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 5,
	},
	dot: {
		width: 7,
		height: 7,
		borderRadius: 5,
		backgroundColor: theme.colors.primary,
		marginTop: 8,
		marginRight: 8,
	},
	commingSoon: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.86)',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 16,
		zIndex: 2,
	},
	commingSoonIcon: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateX: -80 }, { translateY: -80 }],
		opacity: 0.25,
	},
	commingSoonText: {
		color: 'white',
		fontSize: 32,
		fontFamily: 'Poppins-Bold',
		textAlign: 'center',
		letterSpacing: 1,
		zIndex: 2,
	},
});
