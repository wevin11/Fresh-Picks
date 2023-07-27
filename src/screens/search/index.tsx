import * as Location from "expo-location";
import * as SplashScreen from 'expo-splash-screen';
import { collection, documentId, endAt, getDocs, limit, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore";
import * as geofire from 'geofire-common';
import React, { useEffect, useState } from "react";
import {
  Platform
} from "react-native";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Colors, KeyboardAwareScrollView, LoaderScreen, TextField, View } from "react-native-ui-lib";
import { auth, db } from "../../../firebase";
import ProductList from "../../../src/components/search/product-list";
import RecommendedList from "../../../src/components/search/recommended-list";
import SubscriptionList from "../../../src/components/search/subscription-list";
import VendorList from "../../../src/components/search/vendor-list";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const Search = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState(null);
  const [vendors, setVendors] = useState(null);
  const [products, setProducts] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [fr, setFR] = useState(null);
  const [fp, setFP] = useState(null);
  const [ff, setFF] = useState(null);
  const [fs, setFS] = useState(null);
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    setLocation(location);
  }

  const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  useEffect(() => {
    getLocation();

    const subscriber = onSnapshot(query(collection(db, "Users"), where("vendor", "==", true), where(documentId(), "!=", auth.currentUser.uid), limit(10)), async (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    })

    const subscriber2 = onSnapshot(query(collection(db, "Products"), where("user", "!=", auth.currentUser.uid), limit(10)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    const subscriber3 = onSnapshot(query(collection(db, "Subscriptions"), where("user", "!=", auth.currentUser.uid), limit(10)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
      subscriber2();
      subscriber3();
    } 
  }, []);

  useEffect(() => {
    // Function to perform a geoquery
    const performGeoquery = async (radius) => {
      const center = [location.coords.latitude, location.coords.longitude] as geofire.Geopoint;
      const radiusInM = radius * 1000; // Convert radius from kilometers to meters

      // Calculate the range of geohashes covering the specified area
      const bounds = geofire.geohashQueryBounds(center, radiusInM);

      // iterate over all bounds returned from query
      const geohashes = bounds.map((bound) => { return getDocs(query(collection(db, "Users"), orderBy("geohash"), startAt(bound[0]), endAt(bound[1]))) });

      // Collect all the query results together into a single list
      Promise.all(geohashes).then((snapshots) => {
        const matchingDocs = [];

        snapshots.map((snap) => {
          snap.docs.map((doc) => {
            const lat = doc.data().location.latitude;
            const lng = doc.data().location.longitude;

            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will match
            const distanceInKm = geofire.distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push({...doc.data(), id: doc.id});
            }
          })
        });

        setRecommended(matchingDocs);
      });

    };

    if (location) {
      // Call the function to perform the geoquery
      performGeoquery(15); // Example: Query for places within 15 kilometers of your location
    }
  }, [location]);

  useEffect(() => {
    try {
      if (!recommended || !vendors || !products || !subscriptions) {
        return;
      }

      if (search.length == 0) {
        const fr = shuffle(recommended);
        const ff = shuffle(vendors);
        const fp = shuffle(products);
        const fs = shuffle(subscriptions);

        setFR(fr);
        setFF(ff);
        setFP(fp);
        setFS(fs);
      } else {
        const rr = recommended.filter(result => {
          return (result.business.toLowerCase().indexOf(search.toLowerCase()) !== -1 || result.address.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        });

        const vr = vendors.filter(result => {
          return (result.business.toLowerCase().indexOf(search.toLowerCase()) !== -1 || result.address.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        });
    
        const pr = products.filter(result => {
          return result.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        const sr = subscriptions.filter(result => {
          return result.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
  
        const fr = shuffle(rr);
        const ff = shuffle(vr);
        const fp = shuffle(pr);
        const fs = shuffle(sr);
    
        setFR(fr);
        setFF(ff);
        setFP(fp);
        setFS(fs);
      }  
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, [recommended, vendors, products, subscriptions, search]);

  useEffect(() => {
    if (fr && ff && fp && fs && location) {
      setLoading(false);
      SplashScreen.hideAsync();
    }
  }, [fr, ff, fp, fs, location]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <View padding-8>
        <TextField fieldStyle={{ backgroundColor: Colors.grey60, borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Vendors, produce, subscriptions, etc." placeholderTextColor={Colors.grey30} leadingAccessory={<MCIcon name="magnify" color={Colors.grey30} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <RecommendedList title={"Recommended"} description={"Recommended vendors that are near you"} recommended={fr} />
        <VendorList title={"Vendors"} description={"Available Vendors"} vendors={ff} />
        <ProductList title={"Products"} description={"Available Products"} products={fp} />
        <SubscriptionList title={"Subscriptions"} description={"Available Subscriptions"} subscriptions={fs} />
      </KeyboardAwareScrollView>
    </View>
  )
}

export default Search