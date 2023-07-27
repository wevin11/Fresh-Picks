import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import { Colors, LoaderScreen } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Basket from "../../../src/screens/basket";
import DashboardStack from "../stack/dashboard-stack";
import ProductStack from "../stack/listing-stack";
import MapStack from "../stack/map-stack";
import OrderStack from "../stack/order-stack";
import SearchStack from "../stack/search-stack";
import SettingStack from "../stack/setting-stack";
import TransactionStack from "../stack/transaction-stack";

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
      setLoading(false);
    });

    return unsubscribe
  }, [auth.currentUser.uid]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    );
  }
  
  return (
    <Drawer.Navigator
      initialRouteName={user?.role === "Vendor" ? "Dashboard" : "Home"}
      // useLegacyImplementation
      // drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation, route }) => ({ 
        drawerLabelStyle: {
          color: Colors.white,
          fontSize: 16,
        },
        drawerStyle: {
          backgroundColor: Colors.tertiary,
        },
        headerShown: true,
        headerTintColor: Colors.black,
        headerTitle: () => (
          <Image
            style={{ width: 200, height: 50 }}
            source={require("../../../assets/images/logo.png")}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: "center",
        unmountOnBlur: true
      })}
    >
      <Drawer.Screen
        name={user?.role === "Vendor" ? "Dashboard" : "Home"}
        component={user?.role === "Vendor" ? DashboardStack : SearchStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Dashboard" : "Home";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role === "Vendor" ? "view-dashboard" : "home"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name={user?.role === "Vendor" ? "Products" : "Feed"}
        component={user?.role === "Vendor" ? ProductStack : ProductStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Products" : "Feed";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Vendor" ? "food-apple" : "timeline"}
                size={24}
                color={Colors.white}
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name={user?.role === "Vendor" ? "Transactions" : "Map"}
        component={user?.role === "Vendor" ? TransactionStack : MapStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Transactions" : "Map";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role === "Vendor" ? "swap-horizontal-circle-outline" : "map-marker"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name={user?.role === "Vendor" ? "Orders" : "History"}
        component={user?.role === "Vendor" ? OrderStack : OrderStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Meetings" : "History";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role === "Vendor" ? "clock-time-four-outline" : "history"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingStack}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role === "Vendor" ? "view-dashboard" : "home"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: "Settings"
          };
        }}
      />
      <Drawer.Screen
        name="Basket"
        component={Basket}
        options={({ route }) => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="cart" size={24} color={Colors.white} />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawer