import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const AddressRow = (props) => {
	const {item} = props;

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part column>
				<Text text65 marginV-4 numberOfLines={1}>Address</Text>
				<Text text80M grey30 marginV-4>{item.address}</Text>
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(AddressRow);