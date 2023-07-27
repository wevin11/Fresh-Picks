import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { Colors, ListItem, Text, View } from "react-native-ui-lib";
import { db } from "../../../firebase";

const HistoryRow = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

	const onPress = () => {
		navigation.navigate("Order", { id: item.id })
	}

  useEffect(() => {
    if (item) {
      getDoc(doc(db, "Users", item.vendor)).then((doc) => {
        const data = doc.data();
    
        setVendor({...data, id: item.vendor});
      });
    }
  }, [item]);

  useEffect(() => {
    if (vendor) {
      setLoading(false);
    }
  }, [vendor]);

  if (loading) {
    return null
  }

  return (
    <ListItem
      activeBackgroundColor={Colors.grey60}
      activeOpacity={0.3}
      backgroundColor={Colors.white}
      onPress={onPress}
      style={{ padding: 8, height: "auto" }}
    >
      <ListItem.Part middle column>
        <View row spread>
          <Text text65 marginV-4>Order {item.id}</Text>
          <Text text65 marginV-4>${item.total.toFixed(2)}</Text>
        </View>
        <View row spread>
          <Text text80M grey30 marginV-4>{vendor.business}</Text>
          <Text text80M grey30 marginV-4>{item.status}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(HistoryRow);