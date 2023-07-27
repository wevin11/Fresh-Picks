import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../../firebase';
import AddressRow from '../../../src/components/basket/address-row';
import BasketRow from '../../../src/components/basket/basket-row';
import BusinessRow from '../../../src/components/basket/business-row';
import ReserveRow from '../../../src/components/basket/reserve-row';
import { clearOrder, getOrderCustomer, getOrderDate, getOrderVendor, selectOrderItems, selectOrderTotal } from '../../../src/slices/order-slice';
import { global } from '../../../style';

const Basket = () => {
  const navigation = useNavigation<any>();
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const items = useSelector(selectOrderItems);
  const orderCustomer = useSelector(getOrderCustomer);
  const orderVendor = useSelector(getOrderVendor);
  const orderDate = useSelector(getOrderDate);
  const orderTotal = useSelector(selectOrderTotal);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

  const groupedItems = useMemo(() => {
    return items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
  }, [items]);

  const result = items.reduce(function(acc, curr) {
    // Check if there exist an object in empty array whose CategoryId matches
    let isElemExist = acc.findIndex(function(item) {
      return item.id === curr.id;
    });

    if (isElemExist === -1) {
      let obj: any = {};
      obj.id = curr.id;
      obj.count = 1;
      obj.description = curr.description;
      obj.vendor = curr.user;
      obj.images = curr.images;
      obj.price = curr.price;
      obj.title = curr.title;
      obj.quantity = curr.quantity;
      obj.frequency = curr.frequency;
      acc.push(obj);
    } else {
      acc[isElemExist].count += 1;
    }

    return acc;
  }, []);

  const createOrder = async () => {
    await addDoc(collection(db, "Orders"), {
      customer: orderCustomer.id,
      vendor: orderVendor.id,
      listings: result,
      total: Number(orderTotal.toFixed(2)),
      status: "Ongoing",
      createdAt: new Date(),
      date: orderDate,
      title: `Order for ${orderCustomer.name}`,
    }).then(async () => {
      handleChat();
    }).catch((e) => alert(e.message));
  }

  const handleChat = (async () => {
    // let message = `${orderCustomer.name} has recently created an order (ID: ${order}) of (List of items here) for $${data.total.toFixed(2)}.`;

    if (chat.length != 0) {
      clearOrderItems();
      navigation.navigate("Conversation", { id: chat[0]?.id, message: "" });
      return
    }

    await addDoc(collection(db, "Chats"), {
      customer: orderCustomer.id,
      vendor: orderVendor.id,
      messages: []
    }).then((doc) => {
      clearOrderItems();
      navigation.navigate("Conversation", { id: doc.id, message: "" });
    }).catch(e => alert(e.message));
  });

  // Get the user's chats first
  useEffect(() => {
    if (orderCustomer && orderVendor) {
      onSnapshot(query(collection(db, "Chats"), where("customer", "==", orderCustomer.id), where("vendor", "==", orderVendor.id)), async (snapshot) => {
        setChat(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      setLoading(false); 
    }
  }, [orderCustomer, orderVendor]);

  useEffect(() => {
    if (chat) {
      setLoading(false); 
      return
    }
  }, [chat]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (items.length == 0) {
    return (
      <View useSafeArea flex backgroundColor={Colors.white} style={[global.center, global.container]}>
        <Text text65 marginV-4>Basket is empty</Text>
      </View>
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
              Basket
            </Text>
          </ListItem.Part>
        </ListItem>

        <BusinessRow item={orderVendor} />

        <AddressRow item={orderVendor} />

        <ReserveRow item={orderDate} />
        
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
              Your items
            </Text>
          </ListItem.Part>
        </ListItem>

        {Object.entries(groupedItems).map(([key, items]: any) => (
          <BasketRow key={key} item={items[0]} count={items.length} />
        ))}

        <View flexG />

        <View padding-16>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={`Send Order ($${orderTotal.toFixed(2)})`} 
            labelStyle={{ fontWeight: '600', padding: 8 }} 
            style={global.button} 
            onPress={createOrder}          
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Basket