import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import DatePicker from 'react-native-neat-date-picker';
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, View } from "react-native-ui-lib";
import { auth, db } from "../../../firebase";
import Cashflow from "../../../src/components/dashboard/cashflow";
import Products from "../../../src/components/dashboard/products";
import Subscriptions from "../../../src/components/dashboard/subscriptions";
import { global } from "../../../style";

const Dashboard = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  const openDatePickerRange = () => setShowCalendar(true)

  const onCancelRange = () => {
    setShowCalendar(false)
  }

  const onConfirmRange = (output) => {
    setShowCalendar(false)
    setStartDate(output.startDate)
    setEndDate(output.endDate)
  }
  
  const [transactions, setTransactions] = useState(null);
  const [products, setProducts] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filtered, setFiltered] = useState(null);
  const [filteredSum, setFilteredSum] = useState(null);
  const [cpp, setCPP] = useState(null);
  const [cps, setCPS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const subscriber2 = onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const subscriber3 = onSnapshot(query(collection(db, "Subscriptions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
      subscriber2();
      subscriber3();
    }
  }, []);

  useEffect(() => {
    if (transactions) {
      if (transactions.length == 0) {
        setFiltered([]);
        setFilteredSum(0);
        return;
      }

      // Get today's date
      const today = new Date();

      // Using reduce to find the oldest element
      const oldestElement = transactions.reduce((oldest, current) => {
        if (!oldest || current.date < oldest.date) {
          return current;
        } else {
          return oldest;
        }
      }, null);

      // Get the start of the year
      const oldest = new Date(oldestElement.date.toDate());

      // Filter elements based on date being between start of year and today
      const f = transactions.filter(element => {return new Date(element.date.toDate()) >= oldest && new Date(element.date.toDate()) <= today});
      const fs = f.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

      setStartDate(oldest);
      setEndDate(today);
      setFiltered(f);
      setFilteredSum(fs);
    }
  }, [transactions]);

  useEffect(() => {
    if (startDate && endDate && transactions) {
      // Filter elements based on date being between start date and end date
      
      const f = transactions.filter(element => {return new Date(element.date.toDate()) >= startDate && new Date(element.date.toDate()) <= endDate});
      const fs = f.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

      setFiltered(f);
      setFilteredSum(fs);
    }
  }, [startDate, endDate, transactions]);

  useEffect(() => {
    if (products) {
      const cpp = [];
      
      products.map((product) => {
        const pt = transactions.filter(element => {return element.product == product.id});

        const sum = pt.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

        cpp.push({...product, sum: sum});
      });
      
      const c = cpp.sort((a, b) => b.sum - a.sum)

      setCPP(c);
    }
  }, [products]);

  useEffect(() => {
    if (subscriptions) {
      const cps = [];
      
      subscriptions.map((subscription) => {
        const pt = transactions.filter(element => {return element.product == subscription.id});

        const sum = pt.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

        cps.push({...subscription, sum: sum});
      });
      
      const c = cps.sort((a, b) => b.sum - a.sum)

      setCPS(c);
    }
  }, [setSubscriptions]);

  useEffect(() => {
    if (transactions && filtered && startDate && endDate && cpp && cps) {
      setLoading(false);
    }
  }, [transactions, filtered, startDate, endDate, products, cpp, cps]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <Cashflow sum={filteredSum} start={startDate} end={endDate} />
        <Products cpp={cpp} />
        <Subscriptions cps={cps} />
        <Button title={'range'} onPress={openDatePickerRange} />
        <DatePicker
          isVisible={showCalendar}
          mode={'range'}
          onCancel={onCancelRange}
          onConfirm={onConfirmRange}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Dashboard