import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../../firebase';
import TransactionRow from '../../../src/components/transactions/transaction-row';
import { global } from '../../../style';

const Transactions = () => {
  const navigation = useNavigation<any>();
  const layout = useWindowDimensions();
  const [transactions, setTransactions] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const actions = [
    {
      text: "Create Expense",
      icon: <MCIcon name="credit-card" color={Colors.white} size={24} />,
      name: "Create Expense",
      position: 1,
      color: Colors.tertiary
    },
    {
      text: "Create Revenue",
      icon: <MCIcon name="cash" color={Colors.white} size={24} />,
      name: "Create Revenue",
      position: 2,
      color: Colors.tertiary
    },
    {
      text: "Send CSV to your email",
      icon: <MCIcon name="email" color={Colors.white} size={24} />,
      name: "Export CSV",
      position: 3,
      color: Colors.tertiary
    }
  ];

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

  const renderItem = useCallback(({item}) => {
    return (
      <TransactionRow item={item} />
    );
  }, []);

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (transactions) {
      const e = transactions.filter((element) => element.type === 'Expense');
      const r = transactions.filter((element) => element.type === 'Revenue');

      setRevenue(r);
      setExpenses(e);
    }
  }, [transactions]);

  useEffect(() => {
    if (transactions && revenue && expenses) {
      setLoading(false);
    }
  }, [transactions, revenue, expenses]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (transactions.length == 0) {
    return (
      <View useSafeArea flex backgroundColor={Colors.white} style={[global.center, global.container]}>
        <Text text65 marginV-4>No transactions made</Text>
        <FloatingAction
          actions={actions}
          color={Colors.tertiary}
          tintColor={Colors.tertiary}
          distanceToEdge={16}
          onPressItem={(name) =>{
            if (name === "Export CSV") {
              exportTransactions();
            } else {
              navigation.navigate(name);
            }
          }}
        />
      </View>
    )
  }
	
	return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <FlashList 
        data={transactions}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={transactions.length != 0 ? transactions.length : 150}
        renderItem={renderItem}
      />
      <FloatingAction
        actions={actions}
        color={Colors.tertiary}
        tintColor={Colors.tertiary}
        distanceToEdge={16}
        onPressItem={(name) =>{
          if (name === "Export CSV") {
            exportTransactions();
          } else {
            navigation.navigate(name);
          }
        }}
      />
    </View>
	)
}

export default Transactions