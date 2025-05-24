import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from '../styles/recScreen';

export default function RecScreen() {
	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />
			<View style={styles.topContainer}></View>
			<View style={styles.bottomContainer}>
        
      </View>
		</View>
	);
}
