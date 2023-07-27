import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Agenda, AgendaSchedule, DateData } from 'react-native-calendars';
import { Text, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import ReserveItem from '../../../src/components/basket/reserve-item';
import { getOrderVendor } from '../../../src/slices/order-slice';

// interface State {
//   items?: AgendaSchedule;
// }

const Reserve = () => {
  const [items, setItems] = useState<any>({});
  const orderVendor = useSelector(getOrderVendor);

  const timeToNumber = (timeString) => {
    // Split the time string into hours, minutes, and AM/PM parts
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
  
    // Convert the hours and minutes to integers
    let hoursInt = parseInt(hours);
    const minutesInt = parseInt(minutes);
  
    // Adjust the hours based on the AM/PM period
    if (period === 'PM' && hoursInt !== 12) {
      hoursInt += 12;
    } else if (period === 'AM' && hoursInt === 12) {
      hoursInt = 0;
    }
  
    // Calculate the total minutes
    // const totalMinutes = hoursInt * 60 + minutesInt;
    const totalMinutes = hoursInt * 60 + minutesInt;
  
    return totalMinutes;
  }

  const loadItems = (date: DateData) => {
    const dates = items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        // Get start and end time from vendor's schedule depending on the day and save them as variables with a switch case
        
        const time = (date.timestamp + i * 24 * 60 * 60 * 1000); // in milliseconds
        console.log("Time:", time);
        const datetime = new Date(time);

        console.log("DT:", datetime);
        const strTime = datetime.toISOString().split('T')[0];
        let enable;
        let start;
        let end;

        switch (datetime.getDay()) {
          case 0:
            enable = orderVendor.schedule.monday.enable;
            start = orderVendor.schedule.monday.start;
            end = orderVendor.schedule.monday.end;
            break;
        
          case 1:
            
            break;
          case 2:
            
            break;
          case 3:
            
            break;
          case 4:
            
            break;
          case 5:
            
            break;
          case 6:
            
            break;
        }

        // Loop the amount of 15 - 30 minutes reservations the vendor can have for the current day

        if (!dates[strTime]) {
          dates[strTime] = [];

          if (enable && start && end) {
            const s = timeToNumber(start);
            const e = timeToNumber(end);
            const interval = 30;
  
            console.log(s);
            console.log(e);
            for (let minute = s; minute < e; minute += interval) {
              const current = (date.timestamp + i * 24 * 60 * 60 * 1000) + (minute * 60 * 1000) + (18000000); // in milliseconds
  
              // if current isn't greater or equal to now, skip it

              if (new Date(current) >= new Date()) {
                dates[strTime].push({
                  name: `Reserve order for ${minute/60} - ${(minute + 30)/60}`,
                  height: 90,
                  day: strTime,
                  date: new Date(current)
                });
              }
            }
          }
        }
      }

      const newItems: AgendaSchedule = {};
      
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });

      setItems(newItems)
    }, 1000);
  }

  const renderItem = useCallback((item: any) => {
    return <ReserveItem item={item} />;
  }, []);

  const renderEmptyDate = () => {
    const fontSize = 16;
    const color = 'black';

    return (
      <TouchableOpacity
        style={[styles.item, {height: 90}]}
        onPress={() => Alert.alert("No reservation available")}
      >
        <Text text65 marginV-4 numberOfLines={1}>No reservation available</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View useSafeArea flex>
      <Agenda
        date={new Date()}
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
    marginVertical: 12
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});

export default Reserve;