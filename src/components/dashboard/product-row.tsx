import React from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const ProductRow = (props) => {
	const {item} = props;
	
	return (
		<ListItem
			activeOpacity={0.3}
			backgroundColor={Colors.white}
			style={{ padding: 8, height: "auto" }}
			key={10}
		>
			<ListItem.Part column>
				<Text text65 marginV-4 numberOfLines={1}>{item.title}</Text>
				<Text text80M grey30 marginV-4>${item.sum.toFixed(2)}</Text>
			</ListItem.Part>
		</ListItem>
	)
}

export default ProductRow

