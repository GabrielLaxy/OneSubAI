import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import styles from '../styles/homeStyle';

export default function Home() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar animated={true} style="light" />
			<View style={styles.container}>
				<Text>Home</Text>
			</View>
		</SafeAreaView>
	);
}
