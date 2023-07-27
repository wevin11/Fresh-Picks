import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePhone from "../../../src/screens/auth/change-phone";
import Settings from "../../../src/screens/settings";
import AccountInformation from "../../../src/screens/settings/account-information";
import AddBusiness from "../../../src/screens/settings/add-business";
import LinkAccount from "../../../src/screens/settings/link-account";
import OrderHistory from "../../../src/screens/settings/order-history";
import PrivacyPolicy from "../../../src/screens/settings/privacy-policy";
import ReportIssue from "../../../src/screens/settings/report-issue";
import TermsAndConditions from "../../../src/screens/settings/terms-and-conditions";
import VendorInformation from "../../../src/screens/settings/vendor-information";
import VendorLocation from "../../../src/screens/settings/vendor-location";
import VendorPayments from "../../../src/screens/settings/vendor-payments";
import VendorPreview from "../../../src/screens/settings/vendor-preview";
import VendorSchedule from "../../../src/screens/settings/vendor-schedule";

const Stack = createNativeStackNavigator();

const SettingStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Settings" 
      screenOptions={{
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        },
      }}
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Add Your Business" component={AddBusiness} />
      <Stack.Screen name="Link Account" component={LinkAccount} />
      <Stack.Screen name="Account Information" component={AccountInformation} />
      <Stack.Screen name="Vendor Information" component={VendorInformation} />
      <Stack.Screen name="Vendor Location" component={VendorLocation} />
      <Stack.Screen name="Vendor Payments" component={VendorPayments} />
      <Stack.Screen name="Vendor Preview" component={VendorPreview} />
      <Stack.Screen name="Vendor Schedule" component={VendorSchedule} />
      <Stack.Screen name="Order History" component={OrderHistory} />
      <Stack.Screen name="Terms and Conditions" component={TermsAndConditions} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicy} />
      <Stack.Screen name="Report Issue" component={ReportIssue} />
    </Stack.Navigator>
  )
}

export default SettingStack