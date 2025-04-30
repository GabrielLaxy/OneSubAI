import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Dimensions, View, TouchableOpacity } from 'react-native';

import Home from './Home';
import Subs from './Subs';
import Login from './Login';
import Register from './Register';
import RecOption from './RecOption';
import Config from './Config';
import theme from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const logo = require('../../assets/logo.png');

const icon = require('../../assets/dog.png');

const { width, height } = Dimensions.get('window');

const StackHeaderOp = {
	headerShown: false,
};

function TabRoutes({ navigation }: any) {
	const TabHeaderOp = {
		headerShown: true,
		headerStyle: {
			backgroundColor: theme.colors.primary,
			elevation:0,
			shadowOpacity: 0,
		},
		headerTintColor: theme.colors.accent,
		headerTitle: '',
		headerLeft: () => (
			<Image
				source={logo}
				style={{
					width: width * 0.1,
					height: undefined,
					aspectRatio: 1,
					marginLeft: 10,
				}}
				resizeMode="contain"
			/>
		),
		headerRight: () => (
			<View>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('Config');
					}}
				>
					<Image
						source={icon}
						style={{
							width: width * 0.12,
							height: undefined,
							aspectRatio: 1,
							marginRight: 10,
							borderRadius: 50,
							borderWidth: 1,
							borderColor: theme.colors.accent,
						}}
						resizeMode="contain"
					/>
				</TouchableOpacity>
			</View>
		),
	};
	return (
		<Tab.Navigator initialRouteName="Home">
			<Tab.Screen name="RecOptions" component={RecOption} />
			<Tab.Screen name="Home" component={Home} options={TabHeaderOp} />
			<Tab.Screen name="Subs" component={Subs} />
		</Tab.Navigator>
	);
}

export default function Routes() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Login" component={Login} options={StackHeaderOp} />
			<Stack.Screen
				name="Register"
				component={Register}
				options={StackHeaderOp}
			/>
			<Stack.Screen
				name="TabRoutes"
				component={TabRoutes}
				options={StackHeaderOp}
			/>
			<Stack.Screen
				name="Config"
				component={Config}
				options={StackHeaderOp}
			/>
		</Stack.Navigator>
	);
}
