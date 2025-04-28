import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './home';
import Subs from './subs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StackHeaderOp = {
  headerShown: false,
};

function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Subs" component={Subs} />
    </Tab.Navigator>
  );
};

export default function Routes() {
  return (
		<Stack.Navigator>
			<Stack.Screen name="TabRoutes" component={TabRoutes} options={StackHeaderOp} />
		</Stack.Navigator>
	);
};