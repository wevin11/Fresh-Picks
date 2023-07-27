import { useNavigation } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { Alert, Button, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-ui-lib';
import { global } from '../../../style';

interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  const {item} = props;
  const navigation = useNavigation<any>();
  
  const buttonPressed = useCallback(() => {
    console.log(item.id)
    navigation.navigate("Basket");
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  if (isEmpty(item)) {
    return (
      <View style={global.emptyItem}>
        <Text style={global.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={global.item}>
      <Text style={global.itemHourText}>{item.meetAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text style={global.itemTitleText}>{item.title}</Text>
      <View style={global.itemButtonContainer}>
        <Button color={'grey'} title={'Info'} onPress={buttonPressed}/>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);