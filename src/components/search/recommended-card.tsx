import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Card, Text, View } from "react-native-ui-lib";

const RecommendedCard = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate("Profile", {
      id: item.id
    });
  };

  return (
    <Card 
      style={{ 
        width: 250, 
        height: "auto",
        minHeight: 250, 
        marginRight: 16, 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8
      }} 
      onPress={() => handlePress()}
    >
      <Card.Image source={{ uri: item.images[0] }} height={125} />
      <View padding-12>
        <Text text65 marginV-4>
          {item.business}
        </Text>
        <Text text80M grey30 marginV-4>
          {item.address}
        </Text>
      </View>
    </Card>
  );
};

export default memo(RecommendedCard);