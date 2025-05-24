import React, { useState } from 'react';
import { View, Text, Image, Switch, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import styles from '../styles/configStyle';

const photo = require('../../assets/dog.png');

export default function Config(): JSX.Element {
	const [notificacoesAtivadas, setNotificacoesAtivadas] =
		useState<boolean>(false);

	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="light" />

			<View style={styles.header}>
				<Text style={styles.logo}>OneSub AI</Text>
				<Image source={photo} style={styles.avatar} />
				<Text style={styles.nome}>Humberto Souza</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Conta</Text>

				<TouchableRipple onPress={() => console.log('Editar Nome')}>
					<View style={styles.item}>
						<Feather name="edit" size={20} color="#000000" />
						<Text style={styles.itemText}>Editar Nome</Text>
					</View>
				</TouchableRipple>

				<TouchableOpacity style={styles.item}>
					<Feather name="lock" size={20} color="#000000" />
					<Text style={styles.itemText}>Alterar Senha</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.item}>
					<FontAwesome name="credit-card" size={20} color="#000000" />
					<Text style={styles.itemText}>Minhas Assinaturas</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Preferências</Text>

				<View style={styles.item}>
					<MaterialIcons name="notifications-none" size={20} color="#000000" />
					<Text style={styles.itemText}>Notificações</Text>
					<Switch
						value={notificacoesAtivadas}
						onValueChange={setNotificacoesAtivadas}
						style={{ marginLeft: 'auto' }}
						trackColor={{ false: '#ccc', true: '#7B2CBF' }}
						thumbColor={notificacoesAtivadas ? '#FFFFFF' : '#A7A7A7'}
					/>
				</View>
			</View>

			<TouchableOpacity style={styles.sair}>
				<Text style={styles.sairTexto}>↩ Sair</Text>
			</TouchableOpacity>
		</View>
	);
}
