import { faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useRef, useState } from 'react';
import {
	Dimensions,
	Image,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	Button,
	Dialog,
	List,
	Modal,
	Provider as PaperProvider,
	Portal,
} from 'react-native-paper';
import { useUserContext } from '../contexts/userContext';
import {
	getStreamingProviders,
	updateUserPlanos,
} from '../services/httpsRequests';
import styles from '../styles/subsStyle';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const logoNetFlix = require('../../assets/providers-logo/netflix-logo-hd.png');
const logoPrimeVideo = require('../../assets/providers-logo/prime-video-logo-hd.png');
const logoDisneyPlus = require('../../assets/providers-logo/disney-plus-logo-hd.png');
const logoMax = require('../../assets/providers-logo/max-logo-hd.png');
const logoGloboPlay = require('../../assets/providers-logo/globoplay-logo-hd.png');

// Mapeamento dos nomes para os logos
const streamingLogos: Record<string, any> = {
	Netflix: logoNetFlix,
	'Prime Video': logoPrimeVideo,
	'Disney+': logoDisneyPlus,
	Max: logoMax,
	Globoplay: logoGloboPlay,
};

export default function Subs() {
	const [modalVisible, setModalVisible] = useState(false);
	const [streamings, setStreamings] = useState<any[]>([]);
	const [dateModalVisible, setDateModalVisible] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<any>(null);
	const [dateInput, setDateInput] = useState('');
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [planToDelete, setPlanToDelete] = useState<any>(null);
	const { user, setUser } = useUserContext();
	const [searchText, setSearchText] = useState('');

	React.useEffect(() => {
		if (modalVisible) {
			getStreamingProviders().then(data => {
				if (Array.isArray(data) && data.length > 0 && data[0].streamings) {
					setStreamings(data[0].streamings);
				} else {
					setStreamings([]);
				}
			});
		}
	}, [modalVisible]);

	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleDateChange = (text: string) => {
		// Remove tudo que não seja número
		const cleaned = text.replace(/\D/g, '');

		let formatted = '';
		if (cleaned.length <= 2) {
			formatted = cleaned;
		} else if (cleaned.length <= 4) {
			formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
		} else {
			formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
				2,
				4
			)}/${cleaned.slice(4, 8)}`;
		}

		setDateInput(formatted);
	};

	const handleSelectPlan = (plan: any) => {
		setSelectedPlan(plan);
		setDateInput('');
		setDateModalVisible(true);
	};

	const handleConfirmDate = async () => {
		if (!selectedPlan || dateInput.length !== 10) return;

		// Monta o novo plano no formato esperado
		const novoPlano = {
			id: selectedPlan.id,
			name: selectedPlan.name,
			preço: selectedPlan.preço,
			vencimento: selectedPlan.vencimento,
			dataAssinada: dateInput,
		};

		setUser((prevUser: any) => {
			const novosPlanos = prevUser.planos
				? [...prevUser.planos, novoPlano]
				: [novoPlano];
			// Chama o request para atualizar no backend
			updateUserPlanos(prevUser.email, novosPlanos);
			return {
				...prevUser,
				planos: novosPlanos,
			};
		});

		setDateModalVisible(false);
		setModalVisible(false);
		setSelectedPlan(null);
		setDateInput('');
	};

	const handleDeletePlan = () => {
		if (!planToDelete) return;

		setUser((prevUser: any) => {
			const novosPlanos = prevUser.planos
				? prevUser.planos.filter((p: any) => p.id !== planToDelete.id)
				: [];
			// Chama o request para atualizar no backend
			updateUserPlanos(prevUser.email, novosPlanos);
			return {
				...prevUser,
				planos: novosPlanos,
			};
		});

		setDeleteDialogVisible(false);
		setPlanToDelete(null);
	};

	// Função utilitária para pegar o nome do streaming pelo id do plano
	const getStreamingNameByPlanId = (planId: number) => {
		const firstDigit = planId.toString()[0];
		switch (firstDigit) {
			case '1':
				return 'Netflix';
			case '2':
				return 'Prime Video';
			case '3':
				return 'Max';
			case '4':
				return 'Disney+';
			case '5':
				return 'Globoplay';
			default:
				return 'Desconhecido';
		}
	};

	return (
		<PaperProvider>
			<View style={{ flex: 1, backgroundColor: theme.colors.accent }}>
				<StatusBar animated={true} />
				<Portal>
					{/* Modal de seleção de plano */}
					<Modal
						visible={modalVisible}
						onDismiss={() => setModalVisible(false)}
						contentContainerStyle={{
							backgroundColor: 'white',
							margin: 20,
							borderRadius: 10,
							padding: 20,
							width: width * 0.9,
							alignSelf: 'center',
							position: 'relative', // importante para posicionar o botão
						}}
					>
						{/* Botão fechar no canto superior direito */}
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
							style={{
								position: 'absolute',
								top: 20,
								left: 10,
								zIndex: 10,
								padding: 5,
							}}
						>
							<FontAwesomeIcon
								icon={faTimes}
								size={20}
								color={theme.colors.text}
							/>
						</TouchableOpacity>
						<Text
							style={{
								fontFamily: 'Poppins-SemiBold',
								fontSize: 20,
								marginBottom: 10,
								textAlign: 'center',
							}}
						>
							Adicionar assinatura
						</Text>
						<ScrollView style={{ maxHeight: 400 }}>
							{streamings.map((streaming: any) => (
								<List.Accordion
									style={styles.listTile}
									key={streaming.id}
									title={streaming.name}
									titleStyle={{
										color: theme.colors.text,
										fontFamily: 'Poppins-SemiBold',
									}}
									left={() => (
										<Image
											source={streamingLogos[streaming.name]}
											style={{
												width: 32,
												height: 32,
												borderRadius: 6,
												marginRight: 8,
											}}
											resizeMode="contain"
										/>
									)}
								>
									{streaming.planos
										.filter(
											(plano: any) =>
												!user?.planos?.some(
													(userPlan: any) => userPlan.id === plano.id
												)
										)
										.map((plano: any) => (
											<List.Item
												key={plano.id}
												title={plano.name}
												titleStyle={{
													color: theme.colors.text,
													fontFamily: 'Poppins-Medium',
													fontSize: 15,
												}}
												description={`R$ ${Number(plano.preço)
													.toFixed(2)
													.replace('.', ',')} - ${plano.vencimento}`}
												descriptionStyle={{
													color: theme.colors.labels,
													fontFamily: 'Poppins-Light',
													fontSize: 12,
												}}
												left={props => (
													<List.Icon {...props} icon="playlist-play" />
												)}
												onPress={() => {
													setModalVisible(false);
													setSelectedPlan({
														...plano,
														streaming: streaming.name,
													});
													setDateInput('');
													setDateModalVisible(true);
												}}
											/>
										))}
								</List.Accordion>
							))}
						</ScrollView>
					</Modal>

					{/* Modal para inserir data manualmente */}
					<Modal
						visible={dateModalVisible}
						onDismiss={() => setDateModalVisible(false)}
						contentContainerStyle={{
							backgroundColor: theme.colors.accent,
							margin: 20,
							borderRadius: 10,
							padding: 20,
							width: width * 0.9,
							alignSelf: 'center',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							onPress={() => setDateModalVisible(false)}
							style={{
								position: 'absolute',
								top: 20,
								left: 10,
								zIndex: 10,
								padding: 5,
							}}
						>
							<FontAwesomeIcon
								icon={faTimes}
								size={20}
								color={theme.colors.text}
							/>
						</TouchableOpacity>
						<Text style={styles.signatureDateTitle}>Data de Assinatura</Text>
						<Text style={styles.signatureDateParagraph}>
							Nos informe em que data foi feita a realização desta assinatura
						</Text>
						<TextInput
							style={{
								borderWidth: 1,
								borderColor: '#ccc',
								borderRadius: 8,
								padding: 10,
								width: 180,
								fontSize: 18,
								textAlign: 'center',
								marginBottom: 20,
							}}
							placeholder="DD/MM/AAAA"
							placeholderTextColor="#aaa"
							keyboardType="number-pad"
							maxLength={10}
							value={dateInput}
							onChangeText={handleDateChange}
						/>
						<TouchableOpacity
							style={styles.confirmButton}
							onPress={handleConfirmDate}
							disabled={dateInput.length !== 10}
						>
							<Text
								style={{
									color: theme.colors.accent,
									fontFamily: 'Poppins-Medium',
								}}
							>
								Confirmar
							</Text>
						</TouchableOpacity>
					</Modal>

					{/* Dialog de confirmação de exclusão */}
					<Dialog
						visible={deleteDialogVisible}
						onDismiss={() => setDeleteDialogVisible(false)}
						style={styles.dialog}
					>
						<Dialog.Title style={styles.dialogTitle}>
							Excluir assinatura
						</Dialog.Title>
						<Dialog.Content>
							<Text style={styles.dialogParagraph}>
								Deseja realmente excluir a assinatura de{' '}
								{planToDelete ? planToDelete.name : ''}?
							</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button
								labelStyle={{
									color: theme.colors.labels,
									fontFamily: 'Poppins-Medium',
								}}
								onPress={() => setDeleteDialogVisible(false)}
							>
								Cancelar
							</Button>
							<Button
								labelStyle={{
									color: theme.colors.primary,
									fontFamily: 'Poppins-SemiBold',
								}}
								onPress={handleDeletePlan}
							>
								Excluir
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
				<ScrollView>
					<View style={styles.secondLayer}>
						<Text style={styles.descriptionPage}>
							Gerencie suas assinaturas
						</Text>
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
								value={searchText}
								onChangeText={setSearchText}
							/>
						</View>
					</View>

					<View style={styles.fakeHeader}>
						<View style={styles.managerSubsTitle}>
							<Text style={styles.subsTitle}>Minhas assinaturas</Text>
							<TouchableOpacity onPress={() => setModalVisible(true)}>
								<FontAwesomeIcon
									icon={faPlus}
									size={20}
									color={theme.colors.text}
									style={styles.icon}
								/>
							</TouchableOpacity>
						</View>
						<ScrollView>
							<View>
								{user?.planos?.length > 0 ? (
									user.planos
										.filter(
											(sub: any) =>
												sub.name
													.toLowerCase()
													.includes(searchText.toLowerCase()) ||
												getStreamingNameByPlanId(sub.id)
													.toLowerCase()
													.includes(searchText.toLowerCase())
										)
										.map((sub: any, idx: number) => {
											const streamingName = getStreamingNameByPlanId(sub.id);
											return (
												<TouchableOpacity
													key={idx}
													style={styles.plansContainer}
													activeOpacity={0.7}
													onPress={() => {
														setPlanToDelete(sub);
														setDeleteDialogVisible(true);
													}}
												>
													<View style={styles.streamingImageContainer}>
														<Image
															source={streamingLogos[streamingName]}
															style={styles.streamingImage}
														/>
													</View>
													<View style={styles.streamingPlans}>
														<Text style={styles.streaming}>
															{streamingName}
														</Text>
														<Text style={styles.plan}>{sub.name}</Text>

														<Text
															style={{
																color: '#888',
																fontSize: 9,
																fontFamily: 'Poppins-Light',
															}}
														>
															Assinada em: {sub.dataAssinada}
														</Text>
													</View>
													<View style={styles.priceContainer}>
														<Text style={styles.price}>
															R${' '}
															{Number(sub.preço).toFixed(2).replace('.', ',')}
														</Text>
													</View>
												</TouchableOpacity>
											);
										})
								) : (
									<Text
										style={{
											textAlign: 'center',
											color: '#888',
											marginTop: 20,
										}}
									>
										Você ainda não possui assinaturas cadastradas.
									</Text>
								)}
							</View>
						</ScrollView>
					</View>
				</ScrollView>
			</View>
		</PaperProvider>
	);
}
