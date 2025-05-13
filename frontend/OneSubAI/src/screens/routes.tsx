import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Dimensions, View, TouchableOpacity } from 'react-native';

import Home from './home';
import Subs from './subs';
import Login from './login';
import Register from './register';
import RecOption from './RecOption';
import Config from './Config';
import RecScreen from './RecScreen';
import theme from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const logo = require('../../assets/logo.png');

const icon = require('../../assets/dog.png');

const text_logo = require('../../assets/text_logo.png');

const { width, height } = Dimensions.get('window');

const StackHeaderOp = {
	headerShown: false,
};

function TabRoutes({ navigation }: any) {
	const TabHeaderOp = {
		headerShown: true,
		headerStyle: {
			backgroundColor: theme.colors.primary,
			elevation: 0,
			shadowOpacity: 0,
		},
		headerTintColor: theme.colors.accent,
		headerTitleAlign: "center" as	 "center",
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
							width: width * 0.11,
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
		<Tab.Navigator initialRouteName="Home" screenOptions={{animation: "shift"}}>
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
			<Stack.Screen
				name="RecScreen"
				component={RecScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}
