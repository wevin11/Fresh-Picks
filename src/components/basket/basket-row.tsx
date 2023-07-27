import React, { memo } from "react";
import { Colors, Image, ListItem, Text, View } from "react-native-ui-lib";

const BasketRow = (props) => {
  const {item, count} = props;

  return (
    <ListItem
      activeOpacity={0.3}
      style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
    >
      {item.images && <ListItem.Part left>
        <Image source={{ uri: item.images[0] }} style={{ width: 50, height: 50, marginRight: 8 }} />
      </ListItem.Part>}
      <ListItem.Part middle column>
        <View row spread>
          <Text text65 marginV-4 numberOfLines={1}>{item.title}</Text>
          <Text text65 marginV-4>${item.price.toFixed(2)}</Text>
        </View>
        <View row spread>
          <Text text80M grey30 marginV-4>{item.description}</Text>
          <Text text80M grey30 marginV-4>x {count}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  );
};

export default memo(BasketRow);