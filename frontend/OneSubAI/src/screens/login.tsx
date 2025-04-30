import { View, Text, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../styles/loginStyle'; // importando o arquivo de estilos

// sempre manter o conteudo dentro da tag </SafeAreaView> ele eveita que o conteudo seja escondido pela status bar dos celulares

export default function Login({ navigation }: any) {
	return (
		<SafeAreaView style={{flex: 1}}> 
		{/* definir o estilo do SafeAreaView sempre como flex: 1 para ocupar toda a tela toda */}
			<View style={Styles.container}>
				<Text>Tela de Login</Text>
				<Button title="Tela de cadastro" onPress={() => navigation.navigate('Register')} />
				<Button title="Home" onPress={() => navigation.navigate('TabRoutes')} />
			</View>
		</SafeAreaView>
	);
}
