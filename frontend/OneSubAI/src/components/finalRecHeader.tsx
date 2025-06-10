import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import theme from '../theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const logo = require('../../assets/logo.png');

const icon = require('../../assets/dog.png');

const text_logo = require('../../assets/text_logo.png');

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
	TabRoutes: undefined;
};

const FinalHeaderOp = (navigation: NavigationProp<RootStackParamList>) => ({
	headerShown: true,
	headerStyle: {
		backgroundColor: theme.colors.primary,
		elevation: 0,
		shadowOpacity: 0,
	},
	headerTintColor: theme.colors.accent,
	headerTitleAlign: 'center' as 'center',
	headerTitle: () => (
		<Image
			source={text_logo}
			style={{
				width: width * 0.28,
				height: undefined,
				aspectRatio: 1,
				marginLeft: 10,
			}}
			resizeMode="contain"
		/>
	),
	headerLeft: () => (
		<TouchableOpacity
			onPress={() => navigation.navigate('TabRoutes')}
			style={{ marginLeft: 15 }}
		>
			<AntDesign name="arrowleft" size={24} color="white" />
		</TouchableOpacity>
	),
});

export default FinalHeaderOp;
