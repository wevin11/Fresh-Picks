import { useNavigation } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import { signOut } from "firebase/auth";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Platform, Share } from "react-native";
import { Colors, KeyboardAwareScrollView, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { auth, db } from "../../../firebase";
import { clearOrder } from "../../../src/slices/order-slice";
import { global } from "../../../style";

const Settings = () => {
  const navigation = useNavigation<any>();
  const appConfig = require("../../../app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState<any>(true);
  const dispatch = useDispatch();
  const url = "https://www.utrgv.edu";

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync({ projectId });

    setToken(token.data);
  }

  const logOut = async () => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      tokens: arrayRemove(token)
    });

    await signOut(auth);
  }

  const deleteAccount = async () => {
    try {
      const uid = auth.currentUser.uid;

      await signOut(auth);
      
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/deleteAccount", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'uid': uid,
          }
        }),
      });

      console.log(response);

      const json = await response.json();

      console.log(json);

      auth.currentUser.reload();

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBusiness = async () => {
    try {
      const uid = auth.currentUser.uid;
      
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/deleteBusiness", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'uid': uid,
          }
        }),
      });

      setLoading(true);

      console.log(response);

      const json = await response.json();

      console.log(json);

      auth.currentUser.reload();

      setLoading(false);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const share = async () => {
    try {
      const options = {
        title: 'Fresh Picks by UTRGV',
        message: 'Find the best fresh produce in the RGV with Fresh Picks',
        url: url
      }

      const response = await Share.share(options);

      if (response.action === Share.dismissedAction) {
        console.log("Shared dismissed");
        return;
      } else if (response.action === Share.sharedAction) {
        console.log("Shared completed");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const switchRoles = async (role) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: role });
    dispatch(clearOrder);
  }
  
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (user && token) {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }
  
  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}> 
        {user?.vendor && (
          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.grey60}
            height={60}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
              <Text text65 marginV-4 numberOfLines={1}>
                Roles
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {(user?.admin && user?.role !== "Admin") && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => {
              Alert.alert("Switch Roles", "Would you like to switch roles?", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => switchRoles("Admin")},
              ]);
            }}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Switch to Admin role
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {(user?.vendor && user?.role !== "Customer") && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => {
              Alert.alert("Switch Roles", "Would you like to switch roles?", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => switchRoles("Customer")},
              ]);
            }}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Switch to Customer role
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {(user?.vendor && user?.role !== "Vendor") && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => {
              Alert.alert("Switch Roles", "Would you like to switch roles?", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => switchRoles("Vendor")},
              ]);
            }}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Switch to Vendor role
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1}>
              App
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Privacy Policy")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Privacy policy
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Report Issue")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Report issue
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={share}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Share the app
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Terms and Conditions")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Terms and conditions
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1}>
              Account
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Change Phone")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Change phone
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Link Account")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Link account to email
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Account Information")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Update account information
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1}>
              Customer
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Order History")}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              My order history
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1}>
              Vendor
            </Text>
          </ListItem.Part>
        </ListItem>
        {!user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Add Your Business")}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Add your business
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={async () => {
              Alert.alert("Delete Your Business", "Are you sure to delete your business?\n\n Your data will be permanently deleted.\n\n (Transactions, Orders, Products, Chats)", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: async () => {
                  await deleteBusiness();
                }},
              ]);
            }}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Delete your business
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Vendor Preview", { id: auth.currentUser.uid })}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Preview your profile
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Vendor Information")}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Update vendor information
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Vendor Location")}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Update vendor location
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Vendor Payments")}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Update vendor payments
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.vendor && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Vendor Schedule")}
          >
            <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Update vendor schedule
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1}>
              UTRGV
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={share}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              About us
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1}>
              Other
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => {
            Alert.alert("Log Out", "Would you like to log out of your account?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: logOut},
            ]);
          }}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Log out
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={async () => {
            Alert.alert("Delete Account", "Would you like to delete your account?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: async () => {
                await deleteAccount();
              }},
            ]);
          }}
        >
          <ListItem.Part column containerStyle={{ paddingHorizontal: 16 }}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Delete account
            </Text>
          </ListItem.Part>
        </ListItem>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Settings;