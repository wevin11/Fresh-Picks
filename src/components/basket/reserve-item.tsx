import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { setOrderDate } from '../../../src/slices/order-slice';
import { global } from '../../../style';

const ReserveItem = (props) => {
	const {item} = props;
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const onPress = () => {
    dispatch(setOrderDate({ date: item.date }));
    navigation.goBack();
  }
  
	return (
		<TouchableOpacity style={global.item}>
      {/* <Text style={styles.itemHourText}>{item.meetAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> */}

      <View row spread centerV>
        <View>
          <Text text65 marginV-4 numberOfLines={1}>{item.name}</Text>
          <Text text80M grey30 marginV-4>{item.name}</Text>
        </View>
        <Button color={'grey'} title={'Info'} onPress={onPress} />

      </View>
    </TouchableOpacity>
	)
}

export default ReserveItem