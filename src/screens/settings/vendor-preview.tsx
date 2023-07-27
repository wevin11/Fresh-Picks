import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Carousel, Chip, Colors, Image, KeyboardAwareScrollView, LoaderScreen, Text, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { auth, db } from "../../../firebase";
import ProfileRow from "../../../src/components/profile/profile-row";
import { selectOrderItems } from "../../../src/slices/order-slice";
import { global } from "../../../style";

const VendorPreview = ({ route }) => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState([]);
  const [chat, setChat] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vendor, setVendor] = useState(null);
  const items = useSelector(selectOrderItems);
  const [loading, setLoading] = useState(true);

  const handleChat = async () => {
    // Check user if they have current vendor id saved in chatted
    // If there isn't, create a chat and 
    // Find a chat that has both ids in the chat
    
    if (chat.length != 0) {
      navigation.navigate("Conversation", { id: chat[0]?.id });
      return
    }

    await addDoc(collection(db, "Chats"), {
      customer: customer.id,
      vendor: vendor.id,
      messages: []
    })
    .then((doc) => {
      navigation.navigate("Conversation", { id: doc?.id })
    })
    .catch(e => alert(e.message));
  }

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((doc) => {
      const data = doc.data();
      setCustomer({...data, id: auth.currentUser.uid});
    });

    getDoc(doc(db, "Users", route.params.id)).then((doc) => {
      const data = doc.data();
      setVendor({...data, id: route.params.id});
    });

    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "==", route.params.id)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (customer && vendor) {
      onSnapshot(query(collection(db, "Chats"), where("customer", "==", auth.currentUser.uid), where("vendor", "==", route.params.id)), async (snapshot) => {
        setChat(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [customer, vendor]);

  useEffect(() => {
    if (chat) {
      setLoading(false);
    }
  }, [chat]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <Carousel
          containerStyle={{
            height: 200
          }}
        >
          {vendor.images?.map((image, i) => {
            return (
              <View flex centerV key={i}>
                <Image
                  overlayType={Image.overlayTypes.BOTTOM}
                  style={global.flex}
                  source={{
                    uri: image
                  }}
                  cover
                />
              </View>
            );
          })}
        </Carousel>

        <View padding-16>
          <View row>
            <Text text65 marginV-4>{vendor.business}</Text>
          </View>

          <View row>
            <Text text80M grey30 marginV-4>{vendor.address}</Text>
          </View>

          <View row>
            <Text text80M grey30 marginV-4>{vendor.description}</Text>
          </View>

          <View row spread style={global.flexWrap}>
            <Chip backgroundColor={Colors.primary} containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Chat with ${vendor.name}`} labelStyle={{ color: Colors.white }} onPress={handleChat}/>
            <Chip backgroundColor="blue" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Call`} labelStyle={{ color: Colors.white }} onPress={() => { Linking.openURL(`tel:${vendor.phone}`) }}/>
            <Chip backgroundColor="red" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Email`} labelStyle={{ color: Colors.white }} onPress={() => { Linking.openURL(`mailto:${vendor.email}`) }}/>
          </View>
        </View>

        {products.map((item) => (
          <ProfileRow item={item} vendor={vendor} customer={customer} />
        ))}
      </KeyboardAwareScrollView>
    </View>
  );
}

export default VendorPreview;