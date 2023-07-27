import React from "react";

import Dashboard from "../../../src/screens/dashboard";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Instructions from "../../../src/screens/instructions";

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard" 
      screenOptions={{
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Instructions" component={Instructions} />
    </Stack.Navigator>
  )
}

export default DashboardStack