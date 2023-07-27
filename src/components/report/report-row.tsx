import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Colors, ListItem, Text, View } from "react-native-ui-lib";

const ReportRow = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();

	// const onPress = () => {
	// 	navigation.navigate("Issue", { id: item.id })
	// }

  return (
    <ListItem
      activeBackgroundColor={Colors.grey60}
      activeOpacity={0.3}
      backgroundColor={Colors.white}
      style={{ padding: 8, height: "auto" }}
    >
      <ListItem.Part middle column>
        <View row spread>
          <Text text65 marginV-4>{item.reason}</Text>
          <Text text65 marginV-4>{item.name}</Text>
        </View>
        <View row spread>
          <Text text80M grey30 marginV-4>{item.details}</Text>
          <Text text80M grey30 marginV-4>{item.createdAt.toDate().toLocaleDateString()}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(ReportRow);