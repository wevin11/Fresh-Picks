import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";


import { Platform } from "react-native";
import { Colors } from "react-native-ui-lib";
import Instructions from "../../../src/screens/instructions";
import BasketStack from "../stack/basket-stack";
import MapStack from "../stack/map-stack";
import OrderStack from "../stack/order-stack";
import SearchStack from "../stack/search-stack";
import SettingStack from "../stack/setting-stack";

const Tab = createBottomTabNavigator();

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={"Home"}
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
        component={SearchStack}
        options={({ route }) => { 
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon 
                name={"home"}
                size={24} 
                color={color} 
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Search",
          };
        }}
      />
      <Tab.Screen
        name={"Second"}
        component={BasketStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"basket"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Basket",
          };
        }}
      />
      <Tab.Screen
        name={"Third"}
        component={MapStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"map-marker"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Map",
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
                name={"history"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "History",
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
  );
}

export default CustomerTabs;