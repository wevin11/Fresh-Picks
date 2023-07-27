import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Instructions from '../../../src/screens/instructions';
import DashboardStack from '../stack/dashboard-stack';
import ProductStack from '../stack/listing-stack';
import OrderStack from '../stack/order-stack';
import SettingStack from '../stack/setting-stack';
import TransactionStack from '../stack/transaction-stack';

const Tab = createBottomTabNavigator();

const VendorTabs = () => {
	return (
		<Tab.Navigator
      initialRouteName={"First"}
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: Colors.white,
        tabBarActiveTintColor: Colors.tertiary,
        tabBarInactiveTintColor: Colors.grey40,
        tabBarShowLabel: true,
        unmountOnBlur: false
      }}
    >
      <Tab.Screen
        name={"First"}
        component={DashboardStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon 
                name={"google-analytics"}
                size={24} 
                color={color} 
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Dashboard",
          };
        }}
      />
      <Tab.Screen
        name={"Second"}
        component={ProductStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"food-apple"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Products",
          };
        }}
      />
      <Tab.Screen
        name={"Third"}
        component={TransactionStack}
        options={({ route }) => {

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"swap-horizontal-circle-outline"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Transactions",
          };
        }}
      />
      <Tab.Screen
        name={"Fourth"}
        component={OrderStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"calendar-month"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Meetings",
          };
        }}
      />
      <Tab.Screen
        name={"Fifth"}
        component={SettingStack}
        options={({ route }) => {          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon name="cog" size={24} color={color} />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Settings",
          };
        }}
      />
      <Tab.Screen
        name={"Sixth"}
        component={Instructions}
        options={({ route }) => {          
          return {
            tabBarLabel: "Instructions",
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          };
        }}
      />
    </Tab.Navigator>
	)
}

export default VendorTabs;