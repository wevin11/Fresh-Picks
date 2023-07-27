import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { memo } from 'react';
import { Alert } from 'react-native';
import { Colors, ListItem, Text } from 'react-native-ui-lib';
import { db } from '../../../firebase';

const RequestRow = (props) => {
	const {item} = props;
  const navigation = useNavigation<any>();

	const deleteItem = async (item, collection) => {
    await deleteDoc(doc(db, collection, item.id));
  }

	const onPress = () => {
		Alert.alert(item.title, item.description, [
			{text: 'Edit', onPress: () => navigation.navigate("Order", { id: item.id })},
			{text: 'Cancel', style: 'cancel'},
			{text: 'Delete', onPress: async () => deleteItem(item, "Orders")},
		]);
	}

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto", width: "100%" }}
			onPress={onPress}
		>
			<ListItem.Part column>
				<Text text65 marginV-4 numberOfLines={1}>{item.title}</Text>
				<Text text80M grey30 marginV-4>Price: ${item.total.toFixed(2)}</Text>
			</ListItem.Part>
		</ListItem> 
	)
}

export default memo(RequestRow);