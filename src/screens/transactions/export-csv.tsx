import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { Button, Colors, KeyboardAwareScrollView, ListItem, Text, View } from 'react-native-ui-lib';
import { auth } from '../../../firebase';
import EmailRow from '../../../src/components/transactions/email-row';
import TransactionRow from '../../../src/components/transactions/transaction-row';
import { global } from '../../../style';

const ExportCSV = ({ route }) => {
	const renderItem = useCallback(({item}) => {
    return (
      <TransactionRow item={item} />
    );
  }, []);
	
	const exportTransactions = useCallback(async () => {
    try {
      await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/exportTransactions", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'uid': auth.currentUser.uid
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
	
	return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
              Export CSV to Email
            </Text>
          </ListItem.Part>
        </ListItem>

        {/* <BusinessRow item={orderVendor} />

        <AddressRow item={orderVendor} />

        <ReserveRow item={orderDate} /> */}
        
        <EmailRow />

        {/* {Object.entries(groupedItems).map(([key, items]: any) => (
          <BasketRow key={key} item={items[0]} count={items.length} />
        ))} */}

        <ListItem
          activeOpacity={0.3}
          backgroundColor={Colors.grey60}
          height={60}
        >
          <ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
            <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
              Your transactions
            </Text>
          </ListItem.Part>
        </ListItem>

        <FlashList 
          data={route.params.transactions}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={route.params.transactions.length != 0 ? route.params.transactions.length : 150}
          renderItem={renderItem}
        />

        <View flexG />

        <View padding-16>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Export CSV to Email"} 
            labelStyle={{ fontWeight: '600', padding: 8 }} 
            style={global.button} 
            onPress={exportTransactions}          
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
	)
}

export default ExportCSV