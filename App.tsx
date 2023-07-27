import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors, ConnectionStatusBar, ThemeManager } from "react-native-ui-lib";
import { Provider } from "react-redux";
import { auth } from "./firebase";
import AuthStack from "./src/navigation/stack/auth-stack";
import MainStack from "./src/navigation/stack/main-stack";
import { store } from "./src/store";
import { global } from "./style";

Colors.loadColors({  
  primary: "#008000",  
  secondary: "#FF4500",
  tertiary: "#32CD32",
  disabled: "lightgray"
});

Colors.loadDesignTokens({ primaryColor: Colors.primary });

ThemeManager.setComponentTheme('Card', (props, context) => {
  const style = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 16,
  };
  return {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 16,
  };;
});

ThemeManager.setComponentTheme('Stepper', (props, context) => {
  const config = {color: Colors.black, backgroundColor: Colors.tertiary, circleColor: Colors.black};
  return {config};
});

// ThemeManager.setComponentTheme('Wizard', (props, context) => {
//   const activeConfig = {color: Colors.white, circleBackgroundColor: Colors.primary, circleColor: "transparent", indexLabelStyle: { fontWeight: "600" }, labelStyle: { fontWeight: "600" }};
//   return {activeConfig};
// });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const appConfig = require("./app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  const registerForPushNotificationsAsync = async () => {
    try {
      let token;
      
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      if (Platform.OS !== "web") {
        registerForPushNotificationsAsync();
  
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
          console.log(notification);
        });
  
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
  
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      const subscriber = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          setUser(user);
          setLoading(false);
          console.log('User is signed in:', user.uid);
        } else {
          // User is signed out
          setUser(user);
          setLoading(false);
          console.log('User is signed out');
        }

        console.log("1");
      });
  
      // Clean up the listener when the component unmounts
      return () => subscriber();
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, []);

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={global.flex} onLayout={onLayoutRootView}>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <Provider store={store}>
          <StatusBar style={"auto"} animated />
          <ConnectionStatusBar />
          {user ? <MainStack /> : <AuthStack />}
        </Provider>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}

export default App