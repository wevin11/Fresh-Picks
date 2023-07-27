import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useLayoutEffect } from "react";
import { Image, ImageBackground } from "react-native";
import { Button, Colors, View } from "react-native-ui-lib";
import { global } from "../../../style";

const Landing = () => {
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <ImageBackground style={global.flex} source={require("../../../assets/images/landing.png")} >
      <View useSafeArea flex>
        <View flex spread style={global.container}>
          <Image style={{ width: "auto", height: 100, marginTop: 32 }} source={require("../../../assets/images/logo.png")} resizeMode="contain" />

          <View style={global.field}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"Register"} 
              labelStyle={{ fontWeight: '600', padding: 4 }} 
              style={global.button} 
              onPress={() => navigation.navigate("Register")}  
            />

            <Button 
              backgroundColor={Colors.white}
              color={Colors.black}
              label={"Login"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.button} 
              onPress={() => navigation.navigate("Login")}  
            />
          </View>   
        </View>
      </View>
    </ImageBackground>
  )
}

export default Landing