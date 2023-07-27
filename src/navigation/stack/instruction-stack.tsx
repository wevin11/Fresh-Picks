import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Instructions from "../../../src/screens/instructions";

const Stack = createNativeStackNavigator();

const InstructionStack = () => {
  return (
    <Stack.Navigator initialRouteName="Instructions" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Instructions" component={Instructions} />
    </Stack.Navigator>
  )
}

export default InstructionStack