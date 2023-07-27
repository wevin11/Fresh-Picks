import React from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const VendorResult = (props) => {
  const {item} = props;

	return (
		<ListItem
      activeBackgroundColor={Colors.white}
      activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
    >
      <ListItem.Part column>
        <Text text65 marginV-4>{item.business}</Text>
        <Text text80M grey30 marginV-4>{item.address}</Text>
      </ListItem.Part>
    </ListItem>
	)
}

export default VendorResult;