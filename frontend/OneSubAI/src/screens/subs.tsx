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

const { width } = Dimensions.get('window');

type Plan = {
	id: number;
	name: string;
	preço: number;
	vencimento: string;
	dataAssinada: string;
};

type Streaming = {
	id: number;
	name: string;
	planos: Plan[];
};

const streamingLogos: Record<string, any> = {
	Netflix: require('../../assets/providers-logo/netflix-logo-hd.png'),
	'Prime Video': require('../../assets/providers-logo/prime-video-logo-hd.png'),
	'Disney+': require('../../assets/providers-logo/disney-plus-logo-hd.png'),
	Max: require('../../assets/providers-logo/max-logo-hd.png'),
	Globoplay: require('../../assets/providers-logo/globoplay-logo-hd.png'),
};

export default function Subs() {
	const [modalVisible, setModalVisible] = useState(false);
	const [streamings, setStreamings] = useState<Streaming[]>([]);
	const [dateModalVisible, setDateModalVisible] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [dateInput, setDateInput] = useState('');
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
	const [searchText, setSearchText] = useState('');
	const { user, setUser } = useUserContext();
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Efeitos
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

	// Handlers
	const handleDateChange = (text: string) => {
		const cleaned = text.replace(/\D/g, '');
		let formatted = cleaned;

		if (cleaned.length > 2)
			formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
		if (cleaned.length > 4)
			formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
				2,
				4
			)}/${cleaned.slice(4, 8)}`;

		setDateInput(formatted);
	};

	const handleSelectPlan = (plan: Plan) => {
		setSelectedPlan(plan);
		setDateInput('');
		setDateModalVisible(true);
	};

	const handleConfirmDate = async () => {
		if (!selectedPlan || dateInput.length !== 10) return;

		const novoPlano = {
			...selectedPlan,
			dataAssinada: dateInput,
		};

		setUser((prevUser: any) => {
			const novosPlanos = [...(prevUser.planos || []), novoPlano];
			updateUserPlanos(prevUser.email, novosPlanos);
			return { ...prevUser, planos: novosPlanos };
		});

		setDateModalVisible(false);
		setModalVisible(false);
		setSelectedPlan(null);
		setDateInput('');
	};

	const handleDeletePlan = () => {
		if (!planToDelete) return;

		setUser((prevUser: any) => {
			const novosPlanos =
				prevUser.planos?.filter((p: Plan) => p.id !== planToDelete.id) || [];
			updateUserPlanos(prevUser.email, novosPlanos);
			return { ...prevUser, planos: novosPlanos };
		});

		setDeleteDialogVisible(false);
		setPlanToDelete(null);
	};

	// Utilitários
	const getStreamingNameByPlanId = (planId: number) => {
		const providers: { [key: string]: string } = {
			'1': 'Netflix',
			'2': 'Prime Video',
			'3': 'Max',
			'4': 'Disney+',
			'5': 'Globoplay',
			default: 'Desconhecido',
		};

		return providers[planId.toString()[0]] || providers.default;
	};

	const formatPrice = (price: number) =>
		`R$ ${price.toFixed(2).replace('.', ',')}`;

	// Componentes reutilizáveis
	const CloseButton = ({ onPress }: { onPress: () => void }) => (
		<TouchableOpacity
			onPress={onPress}
			style={{
				position: 'absolute',
				top: 20,
				left: 10,
				zIndex: 10,
				padding: 5,
			}}
		>
			<FontAwesomeIcon icon={faTimes} size={20} color={theme.colors.text} />
		</TouchableOpacity>
	);

	const PlanItem = ({
		plan,
		streamingName,
	}: {
		plan: Plan;
		streamingName: string;
	}) => (
		<TouchableOpacity
			style={styles.plansContainer}
			activeOpacity={0.7}
			onPress={() => {
				setPlanToDelete(plan);
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
				<Text style={styles.streaming}>{streamingName}</Text>
				<Text style={styles.plan}>{plan.name}</Text>
				<Text
					style={{ color: '#888', fontSize: 9, fontFamily: 'Poppins-Light' }}
				>
					Assinada em: {plan.dataAssinada}
				</Text>
			</View>
			<View style={styles.priceContainer}>
				<Text style={styles.price}>{formatPrice(plan.preço)}</Text>
			</View>
		</TouchableOpacity>
	);

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
							position: 'relative',
						}}
					>
						<CloseButton onPress={() => setModalVisible(false)} />
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
							{streamings.map(streaming => (
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
											plano =>
												!user?.planos?.some(
													(userPlan: Plan) => userPlan.id === plano.id
												)
										)
										.map(plano => (
											<List.Item
												key={plano.id}
												title={plano.name}
												titleStyle={{
													color: theme.colors.text,
													fontFamily: 'Poppins-Medium',
													fontSize: 15,
												}}
												description={`${formatPrice(plano.preço)} - ${
													plano.vencimento
												}`}
												descriptionStyle={{
													color: theme.colors.labels,
													fontFamily: 'Poppins-Light',
													fontSize: 12,
												}}
												left={props => (
													<List.Icon {...props} icon="playlist-play" />
												)}
												onPress={() => handleSelectPlan(plano)}
											/>
										))}
								</List.Accordion>
							))}
						</ScrollView>
					</Modal>

					{/* Modal para inserir data */}
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
						<CloseButton onPress={() => setDateModalVisible(false)} />
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
								{planToDelete?.name || ''}?
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
						<View style={{ flex: 1 }}>
							<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
								<View>
									{user?.planos?.length > 0 ? (
										user.planos
											.filter((sub: Plan) => {
												const searchLower = searchText.toLowerCase();
												return (
													sub.name.toLowerCase().includes(searchLower) ||
													getStreamingNameByPlanId(sub.id)
														.toLowerCase()
														.includes(searchLower)
												);
											})
											.map((sub: Plan, idx: number) => (
												<PlanItem
													key={idx}
													plan={sub}
													streamingName={getStreamingNameByPlanId(sub.id)}
												/>
											))
									) : (
										<View style={styles.noSignatures}>
											<Image
												source={require('../../assets/noSignatures.png')}
												style={styles.noSignaturesImage}
											></Image>
											<Text
												style={{
													textAlign: 'center',
													color: '#411260',
													fontFamily: 'Poppins-Medium',
													fontSize: 15,
													marginTop: 20,
													width: 250,
												}}
											>
												Err... Não tem nenhuma assinatura aqui...
											</Text>
										</View>
									)}
								</View>
							</ScrollView>
						</View>
					</View>
				</ScrollView>
			</View>
		</PaperProvider>
	);
}
