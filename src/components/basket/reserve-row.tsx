import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { Button } from 'react-native';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';

const ReserveRow = (props) => {
	const {item} = props;
	const navigation = useNavigation<any>();

	const buttonPressed = useCallback(() => {
    // console.log(item.id)
    navigation.navigate("Reserve");
  }, []);

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part middle column>
				<View row spread centerV>
					<View>
						<Text text65 marginV-4 numberOfLines={1}>Date</Text>
						<Text text80M grey30 marginV-4>{item ? item.toLocaleString('en-US', { timeZone: 'America/Chicago' }) : "No date reserved yet"}</Text>
					</View>
					<View>
						<Button color={'grey'} title={'Select'} onPress={buttonPressed} />
						{/* <DateTimePicker title={'Select time'} placeholder={'Placeholder'} mode={'time'} />					 */}
					</View>
				</View> 
      </ListItem.Part>
		</ListItem>
	)
}

export default memo(ReserveRow);