import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { Text, View } from "react-native-ui-lib";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import RecommendedCard from "./recommended-card";

const RecommendedList = ({ title, description, recommended }) => {
  const navigation = useNavigation<any>();

  const renderItem = useCallback(({item}) => {
    return (
      <RecommendedCard item={item} />
    );
  }, []);

  return (
    <View>
      <View row spread marginH-16 marginT-16 centerV>
        <View>
          <Text text65 marginV-4>{title}</Text>      
          <Text text90L marginV-4>{description}</Text>
        </View>

        <MCIcon name={"arrow-right"} size={32} onPress={() => navigation.navigate("Vendors")} />
      </View>

      <FlashList 
        data={recommended}
        keyExtractor={(item: any) => item.id}
        horizontal
        contentContainerStyle={{ padding: 16 }}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={recommended.length != 0 ? recommended.length : 150}
        renderItem={renderItem}
      />
    </View>
  );
};

export default RecommendedList;