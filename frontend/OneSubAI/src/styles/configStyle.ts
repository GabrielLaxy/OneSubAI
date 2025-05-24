import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F0F0F0',
	},
	header: {
		backgroundColor: '#7B2CBF',
		alignItems: 'center',
		paddingVertical: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	logo: {
		color: '#FFFFFF',
		fontSize: 18,
		marginBottom: 10,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: '#FFFFFF',
	},
	nome: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		textDecorationLine: 'underline',
	},
	section: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 10,
		color: '#000000',
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 0.5,
		borderColor: '#A7A7A7',
	},
	itemText: {
		marginLeft: 10,
		fontSize: 15,
		color: '#000000',
	},
	sair: {
		backgroundColor: '#7B2CBF',
		margin: 20,
		padding: 12,
		borderRadius: 25,
		alignItems: 'center',
	},
	sairTexto: {
		color: '#FFFFFF',
		fontWeight: 'bold',
		fontSize: 16,
	},
});

export default styles;
