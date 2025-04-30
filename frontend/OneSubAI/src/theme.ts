import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
	fontFamily: 'Helvetica-Regular',
};

const theme = {
	...MD3LightTheme,
	fonts: configureFonts({ config: fontConfig }),
	roundness: 7,
	colors: {
		...MD3LightTheme.colors,
		primary: '#7B2CBF', //lilaz
		accent: '#FFFFFF', //branco
		background: '#F0F0F0', //branco meio cinza
		text: '#000000', //preto
	},
};

export default theme;