import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { memo } from 'react';
import { Alert } from 'react-native';
import { Colors, Image, ListItem, Text } from 'react-native-ui-lib';
import { db } from '../../../firebase';

const SubscriptionRow = (props) => {
	const {item} = props;
  const navigation = useNavigation<any>();

	const deleteItem = async (item, collection) => {
    await deleteDoc(doc(db, collection, item.id));
  }

	const onPress = () => {
		Alert.alert(item.title, item.description, [
			{text: 'Edit', onPress: () => navigation.navigate("Edit Subscription", { id: item.id })},
			{text: 'Cancel', style: 'cancel'},
			{text: 'Delete', onPress: async () => deleteItem(item, "Subscriptions")},
		])
	}
	
	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto", width: "100%" }}
			onPress={onPress}
		>
			<ListItem.Part middle column>
				<Text text65 marginV-4 numberOfLines={1}>{item.title}</Text>
				<Text text80M grey30 marginV-4>${item.price.toFixed(2)}/{item.frequency.toLowerCase()} ({item.quantity} remaining)</Text>
			</ListItem.Part>
			{item.images && <ListItem.Part right>
				<Image source={{ uri: item.images[0] }} style={{ width: 50, height: 50 }} />
			</ListItem.Part>}
		</ListItem> 
	)
}

export default memo(SubscriptionRow);