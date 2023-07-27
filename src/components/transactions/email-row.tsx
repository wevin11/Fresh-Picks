import React, { memo } from "react";
import { Colors, ListItem, Text, View } from "react-native-ui-lib";
import { auth } from "../../../firebase";

const EmailRow = () => {
  return (
    <ListItem
      activeOpacity={0.3}
      style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
    >
      <ListItem.Part middle column>
        <View row spread>
          <Text text65 marginV-4 numberOfLines={1}>Email Address</Text>
        </View>
        <View row spread>
          <Text text80M grey30 marginV-4>{auth.currentUser.email}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  );
};

export default memo(EmailRow);