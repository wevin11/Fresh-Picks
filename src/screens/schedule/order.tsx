import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Platform } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { db } from '../../../firebase';
import AddressRow from '../../../src/components/basket/address-row';
import BasketRow from '../../../src/components/basket/basket-row';
import BusinessRow from '../../../src/components/basket/business-row';
import { global } from '../../../style';

const Order = ({ route }) => {
	const [order, setOrder] = useState(null);
	const [customer, setCustomer] = useState(null);
	const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

	useEffect(() => {
    getDoc(doc(db, "Orders", route.params.id)).then((doc) => {
      const data = doc.data();
      setOrder({...data, id: route.params.id});
    });
  }, []);

	useEffect(() => {
		if (order) {
      console.log("Order:", order);
			getDoc(doc(db, "Users", order.customer)).then((doc) => {
				const data = doc.data();
				setCustomer({...data, id: order.customer});
			});
		
			getDoc(doc(db, "Users", order.vendor)).then((doc) => {
				const data = doc.data();
				setVendor({...data, id: order.vendor});
			});
		}
  }, [order]);

	useEffect(() => {
		if (customer && vendor) {
      console.log("Customer:", customer.id);
      console.log("Vendor:", vendor.id);
      console.log("Products:", order.products);
			setLoading(false);
		}
  }, [customer, vendor]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <ListItem
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
              Order
            </Text>
          </ListItem.Part>
        </ListItem>

        <BusinessRow item={vendor} />

        <AddressRow item={vendor} />
        
        <ListItem
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
              Your items
            </Text>
          </ListItem.Part>
        </ListItem>

        {order.products.map((item: any) => (
          <BasketRow item={item} count={item.count} />
        ))}

        <View flexG />

        <View padding-16>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Send Meeting Request"} 
            labelStyle={{ fontWeight: '600', padding: 8 }} 
            style={global.button} 
            // onPress={createOrder}          
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Order