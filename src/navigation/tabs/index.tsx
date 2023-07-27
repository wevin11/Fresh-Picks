import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import { Platform } from "react-native";
import { Colors, LoaderScreen } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import Instructions from "../../../src/screens/instructions";
import { selectOrderItems } from "../../../src/slices/order-slice";
import BasketStack from "../stack/basket-stack";
import DashboardStack from "../stack/dashboard-stack";
import ListingStack from "../stack/listing-stack";
import MapStack from "../stack/map-stack";
import OrderStack from "../stack/order-stack";
import ScheduleStack from "../stack/schedule-stack";
import SearchStack from "../stack/search-stack";
import SettingStack from "../stack/setting-stack";
import TransactionStack from "../stack/transaction-stack";
import AdminTabs from "./admin-tabs";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const items = useSelector(selectOrderItems);

  const result = items.reduce(function(acc, curr) {
    // Check if there exist an object in empty array whose CategoryId matches
    let isElemExist = acc.findIndex(function(item) {
      return item.id === curr.id;
    });

    if (isElemExist === -1) {
      let obj: any = {};
      obj.id = curr.id;
      obj.count = 1;
      obj.description = curr.description;
      obj.vendor = curr.user;
      obj.images = curr.images;
      obj.price = curr.price;
      obj.title = curr.title;
      obj.quantity = curr.quantity;
      acc.push(obj)
    } else {
      acc[isElemExist].count += 1
    }

    console.log(acc);

    return acc;
  }, []);
  
  // useEffect(() => {
  //   // Check if the user is logging in for the first time
  //   const isFirstLogin = auth.currentUser.metadata.creationTime === auth.currentUser.metadata.lastSignInTime;

  //   if (isFirstLogin) {
  //     // User is logging in for the first time
  //     console.log('First login');
  //     navigation.navigate("Sixth");
  //   } else {
  //     // User has logged in before
  //     console.log('Returning user');
  //   }
  // }, []);

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
      setLoading(false);
      console.log("2");
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [auth.currentUser]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    );
  }

  if (user?.role === "Admin") {
    return (
      <AdminTabs />   
    );
  }

  return (
    <Tab.Navigator
      initialRouteName={user?.role === "Vendor" ? "Dashboard" : "Home"}
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: Colors.white,
        tabBarActiveTintColor: Colors.tertiary,
        tabBarInactiveTintColor: Colors.grey40,
        tabBarShowLabel: false,
        unmountOnBlur: false
      }}
    >
      <Tab.Screen
        name={"First"}
        component={user?.role === "Vendor" ? DashboardStack : SearchStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Dashboard" : "Search";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon 
                name={user?.role === "Vendor" ? "google-analytics" : "magnify"}
                size={24} 
                color={color} 
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
          };
        }}
      />
      <Tab.Screen
        name={"Second"}
        component={user?.role === "Vendor" ? ListingStack : BasketStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Listings" : "Basket";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Vendor" ? "food-apple" : "basket"}
                size={24}
                color={color}
              />
            ),
            tabBarBadge: (user?.role === "Customer" && result.length > 0) ? result.length : null,
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
            unmountOnBlur: false
          };
        }}
      />
      <Tab.Screen
        name={"Third"}
        component={user?.role === "Vendor" ? TransactionStack : MapStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Transactions" : "Map";

          return {
            headerTitle: routeName,
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Vendor" ? "swap-horizontal-circle-outline" : "map-marker"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
          };
        }}
      />
      <Tab.Screen
        name={"Fourth"}
        component={user?.role === "Vendor" ? ScheduleStack : OrderStack}
        options={({ route }) => {
          let routeName = user?.role === "Vendor" ? "Schedule" : "Orders";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Vendor" ? "calendar-month" : "history"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
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
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          };
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs