import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import { Colors, LoaderScreen, TabController, Text, View } from 'react-native-ui-lib';
import { auth, db } from '../../../firebase';
import ChatRow from '../../../src/components/chat/chat-row';
import AgendaItem from '../../../src/components/orders/agenda-item';
import { global } from '../../../style';
interface State {
  items?: AgendaSchedule;
}

const Orders = () => {
  const layout = useWindowDimensions();
  const width = layout.width/3;
  const [items, setItems] = useState<any>(null);
  const [chats, setChats] = useState([]);
  const [orders, setOrders] = useState<any>(null);
  const [confirmed, setConfirmed] = useState<any>(null);
  const [pending, setPending] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const generateTimeSlots = () => {
    // Get vendor's schedule here

    // Check day of the week

    // Setup start and ending hour

    // 
    const startHour = 9;
    const endHour = 17;
    const timeSlots = [];
  
    for (let hour = startHour; hour <= endHour; ++hour) {
      const time = moment().hour(hour).startOf('hour').format();
      console.log(time);
      timeSlots.push({
        time,
        title: `Reserve at ${moment(time).format('hh:mm A')}`,
      });
    }
  
    return timeSlots;
  };

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const loadItems = (day: DateData) => {
    const dates = items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!dates[strTime]) {
          dates[strTime] = [];
          
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            dates[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime
            });
          }
        }
      }
      
      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });

      setItems(newItems);
    }, 1000);
  }

	const renderOrder = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);

	const renderChat = useCallback(({item}: any) => {
    return <ChatRow item={item} />
  }, []);

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = 16;
    const color = 'black';

    return (
      <TouchableOpacity
        style={[global.reserve, {height: 75}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  }

  const FirstRoute = () => (
    <View useSafeArea flex>
      <Agenda
        date={new Date()}
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        // contentContainerStyle={{ marginBottom: 16 }}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length != 0 ? chats.length : 150}
        renderItem={renderChat}
      />
    </View>
  );

	useEffect(() => {
    const subscriber1 = onSnapshot(query(collection(db, "Chats"), where("customer", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    const subscriber2 = onSnapshot(query(collection(db, "Orders"), where("customer", "==", auth.currentUser.uid)), async (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber1();
      subscriber2();
    }
  }, []);

	useEffect(() => {
    if (orders) {
      const c = orders.filter((element) => element.status === 'Confirmed');
      const p = orders.filter((element) => element.status === 'Pending');

      setConfirmed(c);
      setPending(p);
    }
  }, [orders]);

  useEffect(() => {
    if (confirmed && pending) {
      const newArray = [];
      confirmed.forEach(doc => {
        // Create a new object and save it to a new variable
        const newObj = {
          // Add desired properties from Firestore document data
          title: doc.meetAt.toDate().toISOString().split('T')[0],
          data: [doc]
        };

        newArray.push(newObj);
      });

      setItems(newArray);
    }
  }, [confirmed, pending]);

  useEffect(() => {
    if (chats && items) {
      setLoading(false);
    }
  }, [chats, items]);
  
  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <TabController items={[{label: 'Orders'}, {label: 'Chats'}]}>  
        <TabController.TabBar
          indicatorInsets={0}
          indicatorStyle={{ backgroundColor: Colors.tertiary }} 
          selectedLabelColor={Colors.tertiary}
          labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
        />  
        <View flex style={global.white}>    
          <TabController.TabPage index={0} lazy>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={2} lazy>{SecondRoute()}</TabController.TabPage>    
        </View>
      </TabController>
    </View>    
  );
}

export default Orders