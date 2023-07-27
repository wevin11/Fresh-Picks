import { FlashList } from "@shopify/flash-list";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, LoaderScreen, TextField, View } from "react-native-ui-lib";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../../firebase";
import ProductResult from "../../../src/components/search/product-result";

const Products = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fp, setFP] = useState(null);

  const renderItem = useCallback(({item}) => {
    return (
      <ProductResult item={item} />
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
    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "!=", auth.currentUser.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
    } 
  }, []);

  useEffect(() => {
    try {
      if (!products) {
        return;
      }

      if (search.length == 0) {
        const fp = shuffle(products);

        setFP(fp);
      } else {
        const pr = products.filter(result => {
          return result.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
  
        const fp = shuffle(pr);
    
        setFP(fp);
      }  
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, [products, search]);

  useEffect(() => {
    if (fp) {
      setLoading(false);
    }
  }, [fp]);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }
  
  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <View padding-8>
        <TextField fieldStyle={{ backgroundColor: Colors.grey60, borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for produce here" placeholderTextColor={Colors.grey30} leadingAccessory={<MCIcon name="magnify" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <FlashList 
        data={fp}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={products.length != 0 ? products.length : 150}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Products