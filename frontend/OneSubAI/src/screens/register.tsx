import { View, Text, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import Styles from '../styles/registerStyle'; // importando o arquivo de estilos

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	TabRoutes: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'Register'
>;

interface RegisterProps {
	navigation: RegisterScreenNavigationProp;
}


export default function Register({navigation}: RegisterProps) {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={Styles.container}>
				<Text>Register</Text>
				<Button title="Voltar" onPress={() => navigation.goBack()} />
			</View>
		</SafeAreaView>
	);
}
