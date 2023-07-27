import { FlashList } from "@shopify/flash-list";
import * as Linking from 'expo-linking';
import * as Location from "expo-location";
import * as SplashScreen from 'expo-splash-screen';
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";
import { auth, db } from "../../../firebase";
import MapRow from "../../../src/components/map/map-row";
import { global } from "../../../style";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const Map = () => {
  const [vendors, setVendors] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);

  const renderItem = useCallback(({item}) => {
    return (
      <MapRow item={item} />
    );
  }, []);

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    setLocation(location);
  }

  const navigateToApp = (vendor) => {
    if (Platform.OS == "android") {
      Linking.openURL(`google.navigation:q=${vendor.latitude}+${vendor.longitude}`);
    } else {
      Linking.openURL(`maps://app?saddr=${location.coords.latitude}+${location.coords.longitude}&daddr=${vendor.latitude}+${vendor.longitude}`);
    }
  }

  useEffect(() => { 
    getLocation();

    const subscriber = onSnapshot(query(collection(db, "Users"), where("vendor", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
    }
  }, []);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setLoading(false);
      SplashScreen.hideAsync();
    }
  }, [location]);

  // const onLayoutRootView = useCallback(async () => {
  //   if (!loading) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync();
  //   }
  // }, [loading]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />
    );
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <View flex>
        <MapView
          ref={map => (this.map = map)} 
          style={global.fullscreen}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={false}
          showsPointsOfInterest={false}
          moveOnMarkerPress={true}
          mapType={"standard"}
          showsTraffic
          // cacheEnabled={NetInfo.fetch().}
        >
          {vendors.map((vendor, index) => {
            return (
              <Marker 
                key={index} 
                focusable 
                title={vendor.business} 
                description={vendor.address} 
                coordinate={{ latitude: vendor?.location?.latitude, longitude: vendor?.location?.longitude }}
                onCalloutPress={() => {
                  navigateToApp(vendor.location);
                }}
              />
            );
          })}
        </MapView>
      </View>
      <View flex>
        <FlashList 
          data={vendors}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={vendors.length != 0 ? vendors.length : 150}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

export default Map;