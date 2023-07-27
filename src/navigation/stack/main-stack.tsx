import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform } from "react-native";
import MainDrawer from "../drawer";
import MainTabs from "../tabs";

const MainStack = () => {  
  return (
    <NavigationContainer>
      {Platform.OS !== "web" ? <MainTabs /> : <MainDrawer />}
      {/* {(user.admin && user.role === "Admin") && <AdminTabs />}
      {user.role === "Customer" && <CustomerTabs />}
      {user.role === "Vendor" && <VendorTabs />} */}
    </NavigationContainer>
  )
}

export default MainStack