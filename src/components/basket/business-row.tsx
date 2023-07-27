import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const BusinessRow = (props) => {
	const {item} = props;

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part column>
				<Text text65 marginV-4 numberOfLines={1}>Vendor</Text>
				<Text text80M grey30 marginV-4>{item.business}</Text>
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(BusinessRow);