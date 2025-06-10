import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Switch, TouchableRipple, Divider, Button } from 'react-native-paper';
import theme from '../theme';

export default function Config({ navigation }: any) {
	const [notificacoes, setNotificacoes] = useState(false);

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />
			<View style={styles.header}>
				<Image
					source={{ uri: 'https://i.imgur.com/DbANp4g.jpeg' }} // imagem de exemplo
					style={styles.profileImage}
				/>
				<Text style={styles.name}>Humberto Souza</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Conta</Text>
				<TouchableRipple
					onPress={() => console.log('Pressed')}
					rippleColor="rgba(0, 0, 0, 0.1)"
				>
					<View style={styles.option}>
						<Ionicons name="create-outline" size={22} />
						<Text style={styles.optionText}>Editar Nome</Text>
					</View>
				</TouchableRipple>
				<Divider />
				<TouchableRipple
					onPress={() => console.log('Pressed')}
					rippleColor="rgba(0, 0, 0, .2)"
				>
					<View style={styles.option}>
						<Ionicons name="lock-closed-outline" size={22} />
						<Text style={styles.optionText}>Alterar Senha</Text>
					</View>
				</TouchableRipple>
				<Divider />
				<TouchableRipple
					onPress={() => console.log('Pressed')}
					rippleColor="rgba(0, 0, 0, .2)"
				>
					<View style={styles.option}>
						<FontAwesome name="credit-card" size={22} />
						<Text style={styles.optionText}>Minhas Assinaturas</Text>
					</View>
				</TouchableRipple>
				<Divider />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Preferências</Text>
				<View style={styles.option}>
					<Ionicons name="notifications-outline" size={22} />
					<Text style={styles.optionText}>Notificações</Text>
					<Switch
						theme={theme}
						style={{ marginLeft: 'auto' }}
						value={notificacoes}
						onValueChange={setNotificacoes}
					/>
				</View>
			</View>
			<View style={{ marginTop: 20, paddingHorizontal: 20 }}>
				<Button
					icon="exit-to-app"
					mode="contained"
					onPress={() => navigation.navigate('Login')}
				>
					Sair
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: theme.colors.background },
	header: {
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		paddingVertical: 20,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	logo: {
		fontSize: 18,
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 10,
	},
	profileImage: {
		width: 90,
		height: 90,
		borderRadius: 45,
		borderWidth: 2,
		borderColor: '#fff',
	},
	name: {
		color: '#fff',
		fontFamily: 'Poppins-SemiBold',
		fontSize: 18,
		marginTop: 10,
		fontWeight: '600',
	},
	section: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: 'Poppins-Bold',
		marginBottom: 10,
		color: '#333',
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 50,
		justifyContent: 'flex-start',
		paddingVertical: 12,
		borderBottomColor: theme.colors.placeholder,
	},
	optionText: {
		fontFamily: 'Poppins-Regular',
		fontSize: 16,
		marginLeft: 10,
	},
	logoutButton: {
		marginTop: 'auto',
		backgroundColor: theme.colors.primary,
		margin: 20,
		borderRadius: 20,
		paddingVertical: 12,
		alignItems: 'center',
	},
	logoutText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
