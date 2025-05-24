import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import theme from '../theme';

const logo = require('../../assets/logo.png');

const icon = require('../../assets/dog.png');

const text_logo = require('../../assets/text_logo.png');

const { width, height } = Dimensions.get('window');

const HeaderOp = (navigation: any) => ({
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
	)
});

export default HeaderOp;
