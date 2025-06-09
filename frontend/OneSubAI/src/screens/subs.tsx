import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
	Image,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	View,
} from 'react-native';
import styles from '../styles/subsStyle';
import theme from '../theme';

const subs = [
	{
		id: 1,
		image: require('../../assets/Netflix-Logo.png'),
		streaming: 'Netflix',
		dataExpiracao: new Date('2025-06-06'),
		price: 'R$ 44,90',
		plan: 'Plano padrão mensal',
	},
	{
		id: 2,
		image: require('../../assets/PrimeVideo-Logo.png'),
		streaming: 'Prime Video',
		dataExpiracao: new Date('2025-06-30'),
		price: 'R$ 166,80',
		plan: 'Plano prime anual',
	},
];

export default function Subs() {
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.accent }}>
			<StatusBar animated={true} />
			<ScrollView>
				<View style={styles.secondLayer}>
					<Text style={styles.descriptionPage}>Gerencie suas assinaturas</Text>
					<View style={styles.searchContainer}>
						<FontAwesomeIcon
							icon={faSearch}
							size={20}
							color={theme.colors.labels}
							style={styles.icon}
						/>
						<TextInput
							placeholder="Pesquisar..."
							style={styles.input}
							placeholderTextColor={theme.colors.labels}
						/>
					</View>
				</View>

				<View style={styles.fakeHeader}>
					<View style={styles.managerSubsTitle}>
						<Text style={styles.subsTitle}>Minhas assinaturas</Text>
						<FontAwesomeIcon
							icon={faPlus}
							size={20}
							color={theme.colors.text}
							style={styles.icon}
						/>
					</View>
					<ScrollView>
						<View>
							{subs.map(sub => (
								<View key={sub.id} style={styles.plansContainer}>
									<View style={styles.streamingImageContainer}>
										<Image
											source={sub.image}
											style={styles.streamingImage}
										></Image>
									</View>
									<View style={styles.streamingPlans}>
										<Text style={styles.streaming}>{sub.streaming}</Text>
										<Text style={styles.plan}>{sub.plan}</Text>
									</View>
									<View style={styles.priceContainer}>
										<Text style={styles.price}>{sub.price}</Text>
									</View>
								</View>
							))}
						</View>
					</ScrollView>
				</View>
			</ScrollView>
		</View>
	);
}
