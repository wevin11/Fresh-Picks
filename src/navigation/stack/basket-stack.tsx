import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Basket from "../../../src/screens/basket";
import Reserve from "../../../src/screens/basket/reserve";

const Stack = createNativeStackNavigator();

const BasketStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Basket" 
      screenOptions={{ 
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }
      }}
    >
      <Stack.Screen name="Basket" component={Basket} />
      <Stack.Screen name="Reserve" component={Reserve} />
    </Stack.Navigator>
  )
}

export default BasketStack