import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conversation from "../../../src/screens/chat/conversation";
import Order from "../../../src/screens/orders/order";
import Schedule from "../../../src/screens/schedule";

const Stack = createNativeStackNavigator();

const ScheduleStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Orders" 
      screenOptions={{ 
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default ScheduleStack