import React from "react";

import EditSubscription from "../../../src/screens/listings/edit-subscription";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Content from "../../../src/screens/content";
import EditProduct from "../../../src/screens/listings/edit-product";

const Stack = createNativeStackNavigator();

const ContentStack = () => { 
  return (
    <Stack.Navigator 
      initialRouteName="Content" 
      screenOptions={{
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Content" component={Content} />
      <Stack.Screen name="Edit Product" component={EditProduct} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ContentStack