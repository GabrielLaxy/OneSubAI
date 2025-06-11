import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SetStateAction, useState } from 'react';

import styles from '../styles/registerStyle';
import theme from '../theme';
import { registerRequest } from '../services/httpsRequests';

const text_logo = require('../../assets/text_logo.png');
const flat_image = require('../../assets/cadastro.png');

export default function Register({ navigation }: any) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);


	const hasEmailErrors = () => !email.includes('@');
	const hasPasswordErrors = () => password.length < 6;
	const hasConfirmPasswordErrors = () => confirmPassword !== password;

	const handleRegister = async () => {
		setError('');
		if (
			hasEmailErrors() ||
			hasPasswordErrors() ||
			hasConfirmPasswordErrors() ||
			!username
		) {
			setError('Preencha todos os campos corretamente.');
			return;
		}
		setLoading(true);
		try {
			const result = await registerRequest(username, email, password);
			setLoading(false);

			if (result && result.user) {
				navigation.navigate('Login');
			} else if (result && result.detail) {
				setError(result.detail);
			} else if (result && result.message) {
				setError(result.message);
			} else {
				setError('Erro ao cadastrar usuário.');
			}
		} catch (error: any) {
			setLoading(false);
			setError(error.message || 'Erro ao cadastrar usuário.');
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />

			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.flexOne}>
					<View style={styles.fakeHeader}>
						<View style={styles.headerContent}>
							<Image source={text_logo} style={styles.logo} />
							<View>
								<Image style={styles.image} source={flat_image} />
							</View>
						</View>
					</View>

					<View style={styles.formContainer}>
						<View style={styles.formHeader}>
							<Text style={styles.title}>Cadastre-se</Text>
							<Text style={styles.subtitle}>Vamos criar sua conta juntos!</Text>
						</View>
						<View>
							<View>
								<TextInput
									theme={theme}
									mode="outlined"
									label="Nome de Usuário"
									style={{ marginBottom: 7 }}
									value={username}
									onChangeText={setUsername}
								/>
								{username.trim() === '' && error !== '' && (
									<HelperText type="error" visible={true}>
										Nome de usuário inválido!
									</HelperText>
								)}
							</View>
							<View>
								<TextInput
									theme={theme}
									mode="outlined"
									label="Email"
									style={{ marginBottom: 7 }}
									value={email}
									onChangeText={setEmail}
								/>
								{hasEmailErrors() && email.trim() !== '' && (
									<HelperText type="error" visible={true}>
										Email inválido!
									</HelperText>
								)}
							</View>

							<View>
								<TextInput
									theme={theme}
									mode="outlined"
									label="Senha"
									style={{ marginBottom: 7 }}
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
								{hasPasswordErrors() && password !== '' && (
									<HelperText type="error" visible={true}>
										Senha inválida! (mínimo 6 caracteres)
									</HelperText>
								)}
							</View>
							<View>
								<TextInput
									theme={theme}
									mode="outlined"
									label="Confirme sua senha"
									style={{ marginBottom: 26 }}
									secureTextEntry={!showConfirmPassword}
									right={
										<TextInput.Icon
											icon={showConfirmPassword ? 'eye-off' : 'eye'}
											onPress={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										/>
									}
									value={confirmPassword}
									onChangeText={setConfirmPassword}
								/>
								{hasConfirmPasswordErrors() && confirmPassword !== '' && (
									<HelperText type="error" visible={true}>
										As senhas não coincidem!
									</HelperText>
								)}
							</View>
							{error ? (
								<Text
									style={{
										color: 'red',
										textAlign: 'center',
										marginTop: 8,
									}}
								>
									{error}
								</Text>
							) : null}
						</View>
						<Button
							style={styles.button}
							contentStyle={{
								height: 48,
								alignItems: 'center',
								justifyContent: 'center',
							}}
							labelStyle={{ fontFamily: 'Poppins-SemiBold', fontSize: 14 }}
							mode="contained"
							loading={loading}
							disabled={loading}
							onPress={handleRegister}
						>
							Cadastrar
						</Button>
						<View style={styles.footer}>
							<Text style={styles.footerText}>Já tem uma conta? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Login')}>
								<Text style={styles.footerTextButton}>Entrar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
