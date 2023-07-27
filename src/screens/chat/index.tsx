import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { auth, db } from "../../../firebase";
import ChatRow from "../../../src/components/chat/chat-row";
import { global } from "../../../style";

const Chat = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  const renderItem = useCallback(({item}) => {
    return (
      <ChatRow item={item} />
    );
  }, []);

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === "Vendor") {
      onSnapshot(query(collection(db, "Chats"), where("vendor", "==", auth.currentUser.uid)), async (snapshot) => {
        setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      onSnapshot(query(collection(db, "Chats"), where("customer", "==", auth.currentUser.uid)), async (snapshot) => {
        setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [user]);

  useEffect(() => {
    if (chats) {
      setLoading(false);
    }
  }, [chats, user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (chats.length == 0) {
    return (
      <View useSafeArea flex backgroundColor={Colors.white} style={[global.center, global.container]}>
        <Text text65 marginV-4>Your inbox is empty</Text>
      </View>
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>      
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length != 0 ? chats.length : 150}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Chat