import { FlashList } from "@shopify/flash-list";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, LoaderScreen, TextField, View } from "react-native-ui-lib";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../../firebase";
import VendorResult from "../../../src/components/search/vendor-result";

const Vendors = () => {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState(null);
  const [ff, setFF] = useState(null);
  const [loading, setLoading] = useState(true);

  const renderItem = useCallback(({item}) => {
    return (
      <VendorResult item={item} />
    );
  }, []);

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
    const subscriber = onSnapshot(query(collection(db, "Users"), where("vendor", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    })

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
    } 
  }, []);

  useEffect(() => {
    try {
      if (!vendors) {
        return;
      }

      if (search.length == 0) {
        const ff = shuffle(vendors);

        setFF(ff);
      } else {
        const fr = vendors.filter(result => {
          return (result.business.toLowerCase().indexOf(search.toLowerCase()) !== -1 || result.address.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        });
  
        const ff = shuffle(fr);
    
        setFF(ff);
      }  
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, [vendors, search]);

  useEffect(() => {
    if (ff) {
      setLoading(false);
    }
  }, [ff]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }
  
  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <View padding-8>
        <TextField fieldStyle={{ backgroundColor: Colors.grey60, borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for vendors here" placeholderTextColor={Colors.grey30} leadingAccessory={<MCIcon name="magnify" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <FlashList 
        data={ff}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={vendors.length != 0 ? vendors.length : 150}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Vendors