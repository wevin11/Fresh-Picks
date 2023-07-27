import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Platform } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { QuickReplies } from "react-native-gifted-chat/lib/QuickReplies";
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../../firebase";

const Conversation = ({ route }) => {
  const {
    params: {
      id,
      message
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState(null);
  const [chat, setChat] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatsRef = doc(db, "Chats", route.params.id);

  const deleteChat = async (id) => {
    await deleteDoc(doc(db, "Chats", id));
    navigation.goBack();
  }

  const quickReplies = [
    {
      text: 'Send location',
      value: {
        location: {
          latitude: 37.78825,
          longitude: -122.4324,
        }
      }
    },
    {
      text: 'Send message',
      value: 'Hello!',
    },
  ];

  const renderBubble = props => {
    const margin = Platform.OS != "web" ? 8 : 4;
    return (
      <Bubble {...props} 
        wrapperStyle={{
          right: {
            backgroundColor: Colors.tertiary,
          },
          left: {
            backgroundColor: Colors.grey70,
          }
        }}
        textStyle={{
          right: {
            marginLeft: margin,
            color: Colors.white,
          },
          left: {
            marginRight: margin,
            color: Colors.black,
          }
        }}
      />
    )
  }
  
  const renderLoading = () => {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }
  
  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MCIcon name="send" size={24} style={{
            marginBottom: 8,
            marginRight: 12
          }}/>
        </View>
      </Send>
    )
  }

  const renderQuickReplies = (props) => {
    return <QuickReplies quickReplies={quickReplies} color={Colors.blue20} {...props} />;
  };

  const handleQuickReply = (value) => {
    if (value.location) {
      // Send location to messaging system
    } else {
      // Send message to messaging system
    }
  }

  const renderQuickReplySend = () => {
    return (
      <Send>
        <Text>Send</Text>
      </Send>
    );
  }  

  const onSend = useCallback(async (m = []) => {
    try {
      await setDoc(chatsRef, {
        messages: GiftedChat.append(messages, m)
      }, {merge: true});

      await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/sendMessage", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'message': m[0].text,
          'sender': auth.currentUser.uid == chat.customer ? customer.name : vendor.business,
          'tokens': auth.currentUser.uid == chat.customer ? vendor.token : customer.token,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, [route.params.id, messages]);

  const sendOrderMessage = async (reply) => {
    setDoc(chatsRef, {
      messages: GiftedChat.append(messages, [reply])
    }, {merge: true});
  }
  
  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name="angle-double-down" size={24} color="#333" />
    );
  }

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Chats", route.params.id), (doc) => {
      setChat(doc.data());
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = onSnapshot(chatsRef, async (snapshot) => {
      setMessages(snapshot.data().messages.map(message => ({
        ...message,
        createdAt: message.createdAt.toDate(),
      })));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [route.params.id]);

  useEffect(() => {
    if (chat) {
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

  useLayoutEffect(() => {
    if (chat && customer && vendor && messages) {
      navigation.setOptions({
        headerTitle: chat?.customer == auth.currentUser.uid ? vendor.name : customer.name,
        // headerRight: () => (
        //   <View row>
        //     <MCIcon 
        //       name={"ellipsis-vertical"} 
        //       size={24} 
        //       color={Colors.black} 
        //       onPress={() => Alert.alert("Delete Chat", "Would you like to delete this chat?", [
        //         {text: 'Cancel', style: 'cancel'},
        //         {text: 'OK', onPress: () => deleteChat(id)},
        //       ])} 
        //     />
        //   </View>
        // ),
      });

      setLoading(false);
    }
  }, [chat, customer, vendor, messages]);

  const onQuickReply = replies => {
    const createdAt = new Date()
    if (replies.length === 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user: auth.currentUser.uid,
        },
      ])
    } else if (replies.length > 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user: auth.currentUser.uid,
        },
      ])
    } else {
      console.warn('replies param is not set correctly')
    }
  }

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser.uid,
          name: chat?.customer == auth.currentUser.uid ? customer.name : vendor.name,
        }}
        // multiline={false}
        alwaysShowSend={true}
        onQuickReply={onQuickReply}
        renderBubble={renderBubble}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        // isTyping={true}
        // renderInputToolbar={renderInputToolbar}
        showUserAvatar={false}
        bottomOffset={Platform.OS == "android" ? 0 : 80}
      />
    </View>
  );
}


export default Conversation