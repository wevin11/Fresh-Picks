import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { Colors, ListItem, LoaderScreen, Text } from "react-native-ui-lib";
import { auth, db } from "../../../firebase";

const ChatRow = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();
  const [chat, setChat] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const conversation = () => {
    navigation.navigate("Conversation", { id: item.id })
  }

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Chats", item.id), (doc) => {
      setChat(doc.data());
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (chat) {
      console.log(chat);
      getDoc(doc(db, "Users", chat.customer)).then((doc) => {
        const data = doc.data();
    
        setCustomer({...data, id: chat.customer});
      });
  
      getDoc(doc(db, "Users", chat.vendor)).then((doc) => {
        const data = doc.data();
    
        setVendor({...data, id: chat.vendor});
      });
    }
  }, [chat]);

  useEffect(() => {
    if (customer && vendor) {
      console.log(customer);
      setLoading(false);
    }
  }, [customer, vendor]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />
    )
  }

  return (
    <ListItem
      activeBackgroundColor={Colors.white}
      activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
      onPress={conversation}
    >
      <ListItem.Part column>
        <Text text65 marginV-4 numberOfLines={1}>{vendor.business}</Text>
        <Text text80M grey30 marginV-4>{chat.messages?.length === 0 ? "No messages" : `${chat.messages[0]?.user.name === auth.currentUser.displayName ? "You" : chat.messages[0]?.user.name}: ${chat.messages[0]?.text}`}</Text>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(ChatRow);