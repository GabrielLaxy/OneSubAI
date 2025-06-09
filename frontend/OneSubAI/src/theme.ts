import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
	regular: {
	  fontFamily: 'Poppins-Regular',
	  fontWeight: "400" as "400",
	  fontSize: 16,
	  lineHeight: 24,
	  letterSpacing: 0.5,
	},
	medium: {
	  fontFamily: 'Poppins-Medium',
	  fontWeight: "500" as "500",
	  fontSize: 16,
	  lineHeight: 24,
	  letterSpacing: 0.5,
	},
	light: {
	  fontFamily: 'Poppins-Light',
	  fontWeight: "300" as "300",
	  fontSize: 16,
	  lineHeight: 24,
	  letterSpacing: 0.5,
	},
	thin: {
	  fontFamily: 'Poppins-Light',
	  fontWeight: "100" as "100",
	  fontSize: 16,
	  lineHeight: 24,
	  letterSpacing: 0.5,
	},
	bold: {
	  fontFamily: 'Poppins-Bold',
	  fontWeight: "700" as "700",
	  fontSize: 16,
	  lineHeight: 24,
	  letterSpacing: 0.5,
	},
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
		placeholder: '#A7A7A7', //cinza
		outline: '#FFFFFF',
		labels: '#7D7D7D', //cinza um pouco claro
		dashboardBorder: '#D9D9D9' //cinza claro
	},
};

export default theme;