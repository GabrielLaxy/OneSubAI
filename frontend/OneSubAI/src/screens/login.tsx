import { ScrollView, StatusBar, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/loginStyle';
import theme from '../theme';

const text_logo = require('../../assets/text_logo.png');
const flat_image = require('../../assets/flat-design1.png');

export default function Login({ navigation }: any) {
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
			<StatusBar animated={true} />

			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<View style={{ flex: 1 }}>
					{/* Cabeçalho Roxo */}
					<View style={styles.fakeHeader}>
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: 60,
							}}
						>
							<Image source={text_logo} style={styles.logo}></Image>
							<View>
								<Image source={flat_image}></Image>
							</View>
						</View>
					</View>

					{/* Camada branca com bordas arredondadas */}
					<View
						style={{
							flex: 1,
							backgroundColor: 'white',
							borderTopLeftRadius: 30,
							borderTopRightRadius: 30,
							padding: 24,
						}}
					>
						<View>
							<Text>Entrar na conta</Text>
							<Text>Entre já para gerenciar suas assinaturas</Text>
						</View>
						<View>
							<TextInput
								placeholder="Email"
								placeholderTextColor={theme.colors.placeholder}
								style={{
									height: 48,
									borderWidth: 1,
									borderColor: theme.colors.primary,
									borderRadius: 8,
									paddingHorizontal: 12,
									marginBottom: 16,
									color: '#000',
								}}
								// value={email}
								// onChangeText={}
								keyboardType="email-address"
								autoCapitalize="none"
							/>

							{/* Senha */}
							<TextInput
								placeholder="Senha"
								placeholderTextColor={theme.colors.placeholder}
								secureTextEntry
								style={{
									height: 48,
									borderWidth: 1,
									borderColor: theme.colors.primary,
									borderRadius: 8,
									paddingHorizontal: 12,
									marginBottom: 24,
									color: '#000',
								}}
								// value={senha}
								// onChangeText={setSenha}
							/>
						</View>
						<View>
							<TouchableOpacity
								onPress={() => navigation.navigate('TabRoutes')}
								style={{
									backgroundColor: theme.colors.primary,
									paddingVertical: 14,
									borderRadius: 8,
									alignItems: 'center',
								}}
							>
								<Text
									style={{
										color: 'white',
										fontSize: 16,
										fontFamily: 'Poppins-SemiBold',
									}}
								>
									Entrar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}


{/* <Button title="Tela de cadastro" onPress={() => navigation.navigate('Register')} />
				<Button title="Home" onPress={() => navigation.navigate('TabRoutes')} /> */}