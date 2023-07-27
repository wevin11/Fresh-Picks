import React from "react";

import CreateSubscription from "../../../src/screens/listings/create-subscription";
import EditSubscription from "../../../src/screens/listings/edit-subscription";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Listings from "../../../src/screens/listings";
import CreateProduct from "../../../src/screens/listings/create-product";
import EditProduct from "../../../src/screens/listings/edit-product";

const Stack = createNativeStackNavigator();

const ListingStack = () => { 
  return (
    <Stack.Navigator 
      initialRouteName="Products" 
      screenOptions={{ 
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="Create Product" component={CreateProduct} />
      <Stack.Screen name="Create Subscription" component={CreateSubscription} />
      <Stack.Screen name="Edit Product" component={EditProduct} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ListingStack;