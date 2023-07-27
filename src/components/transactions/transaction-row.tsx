import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { memo } from 'react';
import { Alert } from 'react-native';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../../firebase';

const TransactionRow = (props) => {
	const {item} = props;
	const navigation = useNavigation<any>();

	const deleteItem = async (item, collection) => {
    await deleteDoc(doc(db, collection, item.id));
  }

	const onPress = () => {
		Alert.alert(item.party, item.category, [
			{text: 'Edit', onPress: () => navigation.navigate("Edit Transaction", { id: item.id })},
			{text: 'Cancel', style: 'cancel'},
			{text: 'Delete', onPress: async () => deleteItem(item, "Transactions")},
		])
	}

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
			onPress={onPress}
		>
			<ListItem.Part left>
				{item.type == "Expense" 
					? <MCIcon name={"arrow-left-bold-circle-outline"} size={36} color={Colors.red30} style={{marginRight: 12}} />
					: <MCIcon name={"arrow-right-bold-circle-outline"} size={36} color={Colors.tertiary} style={{marginRight: 12}} />
				}
			</ListItem.Part>
			<ListItem.Part middle column>
				
				<View row spread>
					<Text text65 marginV-4 numberOfLines={1}>{item.party}</Text>
					<Text text65 marginV-4>${item.price.toFixed(2)}</Text>
				</View>
				<View row spread>
					<Text text80M grey30 marginV-4>{item.category}</Text>
					<Text text80M grey30 marginV-4>{item.date.toDate().toLocaleDateString()}</Text>
				</View>
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(TransactionRow);