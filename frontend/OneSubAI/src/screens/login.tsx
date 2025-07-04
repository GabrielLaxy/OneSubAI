import {
	ScrollView,
	Text,
	View,
	Image,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import styles from '../styles/loginStyle';
import theme from '../theme';
import { loginRequest } from '../services/httpsRequests';
import { useUserContext } from '../contexts/userContext';
import LottieView from 'lottie-react-native';

const text_logo = require('../../assets/text_logo.png');
const flat_image = require('../../assets/login.png');

export default function Login({ navigation }: any) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loginError, setLoginError] = useState('');
	const { setUser } = useUserContext(); // adicione este hook
	const [showAnimation, setShowAnimation] = useState(false);

	const hasPasswordErrors = () => password.length > 0 && password.length < 4;
	const hasEmailErrors = () => email.length > 0 && !email.includes('@');

	const handleLogin = async () => {
		setLoginError('');
		if (!email || !password) {
			setLoginError('Preencha todos os campos.');
			return;
		}
		if (hasEmailErrors() || hasPasswordErrors()) {
			setLoginError('Verifique os campos digitados.');
			return;
		}
		setLoading(true);
		const response = await loginRequest(email, password);
		setLoading(false);
		if (response && response.success) {
			setUser(response.user); // << Atualiza o contexto do usuário aqui
			setShowAnimation(true);
			setTimeout(() => {
				navigation.navigate('TabRoutes');
			}, 3000);
		} else {
			setLoginError('Email ou senha incorretos.');
		}
	};

	if (showAnimation) {
		return (
			<View style={{ flex: 1, backgroundColor: 'black' }}>
				<StatusBar hidden />
				<LottieView
					source={require('../../assets/animacao.json')}
					autoPlay
					loop={false}
					style={{ flex: 1 }}
					resizeMode="cover"
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />

			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.flexOne}>
					<View style={styles.fakeHeader}>
						<View style={styles.headerContent}>
							<Image source={text_logo} style={styles.logo} />
							<View>
								<Image style={styles.flatImage} source={flat_image} />
							</View>
						</View>
					</View>

					<View style={styles.formContainer}>
						<View style={styles.formHeader}>
							<Text style={styles.title}>Entrar na conta</Text>
							<Text style={styles.subtitle}>
								Entre já para gerenciar suas assinaturas
							</Text>
						</View>
						<View style={{ gap: 10 }}>
							<TextInput
								theme={theme}
								mode="outlined"
								label="Email"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
							/>
							{hasEmailErrors() && (
								<HelperText type="error" visible={true}>
									Email inválido!
								</HelperText>
							)}

							<TextInput
								theme={theme}
								mode="outlined"
								label="Senha"
								secureTextEntry={!showPassword}
								right={
									<TextInput.Icon
										icon={showPassword ? 'eye-off' : 'eye'}
										onPress={() => setShowPassword(!showPassword)}
									/>
								}
								value={password}
								onChangeText={setPassword}
							/>
							<HelperText type="error" visible={hasPasswordErrors()}>
								Senha inválida!
							</HelperText>
							{loginError ? (
								<Text style={{ color: 'red', marginBottom: 8 }}>
									{loginError}
								</Text>
							) : null}
						</View>
						<View>
							<Button
								style={styles.button}
								labelStyle={styles.buttonText}
								mode="contained"
								onPress={handleLogin}
								loading={loading}
								disabled={loading}
							>
								Entrar
							</Button>
						</View>
						<View style={styles.footer}>
							<Text style={styles.footerText}>Ainda não tem uma conta? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Register')}>
								<Text style={styles.footerTextButton}>Cadastre-se</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
