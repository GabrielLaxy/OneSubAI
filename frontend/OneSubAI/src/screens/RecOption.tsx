import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecOption({ navigation }: any) {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View>
				<Button title="Leva para tela do tinder" onPress={() => navigation.navigate('Reg')} />
			</View>
		</SafeAreaView>
	);
}
