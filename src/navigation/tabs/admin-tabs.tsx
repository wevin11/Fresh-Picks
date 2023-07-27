import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Instructions from '../../../src/screens/instructions';
import AccountStack from '../stack/account-stack';
import ContentStack from '../stack/content-stack';
import IssueStack from '../stack/issue-stack';
import ReportStack from '../stack/report-stack';
import SettingStack from '../stack/setting-stack';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
	return (
		<Tab.Navigator
      initialRouteName={"Dashboard"}
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
        component={AccountStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon 
                name={"account"}
                size={24} 
                color={color} 
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Accounts",
          };
        }}
      />
      <Tab.Screen
        name={"Second"}
        component={ContentStack}
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
            tabBarLabel: "Content",
          };
        }}
      />
      <Tab.Screen
        name={"Third"}
        component={IssueStack}
        options={({ route }) => {

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"bug"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Issues",
          };
        }}
      />
      <Tab.Screen
        name={"Fourth"}
        component={ReportStack}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={"alert-octagon"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Reports",
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

export default AdminTabs