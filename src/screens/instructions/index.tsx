import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { global } from '../../../style';

const Instructions = () => {
  const navigation = useNavigation<any>();
  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <Button style={active !== 0 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-left"} size={48} color={Colors.white} />} onPress={goToPrevStep} disabled={active === 0} />
    );
  };

  const goToNextStep = () => {
    const prevActiveIndex = active;
    const prevCompletedStepIndex = completedStep;
    const activeIndex = prevActiveIndex + 1;
    let completedStepIndex = prevCompletedStepIndex;
    if (!prevCompletedStepIndex || prevCompletedStepIndex < prevActiveIndex) {
      completedStepIndex = prevActiveIndex;
    }

    if (activeIndex !== prevActiveIndex || completedStepIndex !== prevCompletedStepIndex) {
      setActive(activeIndex);
      setCompletedStep(completedStepIndex);
    }
  };

  const Next = () => {
    return (
      <View>
        {active !== 4
          ? <Button style={active !== 4 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active == 4} />
          : <Button style={{backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"check"} size={48} color={Colors.white} />} onPress={() => navigation.navigate("First")} />
        }
      </View>
    );
  };

  const Buttons = () => {
    return (
      <View style={global.field}>
        <View row spread centerV>
          {Prev()}
          <Text>{active}</Text>
          {Next()}
        </View>
      </View>
    )
  }

  const Search = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../../assets/images/search.jpg")} />
        </View>
        <View flex style={[global.container, global.white]}>
          <Text text65 marginV-4>Searching for fresh produce</Text>
          <Text text80M grey30 marginV-4>Search for a vendor near you and pick out fresh produce that you would like to purchase</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    )
  }

  const Request = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../../assets/images/request.jpg")} />
        </View>
        <View flex style={[global.container, global.white]}>
          <Text text65 marginV-4>Request a meeting</Text>
          <Text text80M grey30 marginV-4>Request a meeting to the vendor with your order at their available time options that they have to be able to purchase your order.</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Decide = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../../assets/images/decide.jpg")} />
        </View>
        <View flex style={[global.container, global.white]}>
          <Text text65 marginV-4>Decide on your requests</Text>
          <Text text80M grey30 marginV-4>Vendors would need to decide on if they would accept or decline your meeting request.</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Meet = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../../assets/images/meet.jpg")} />
        </View>
        <View flex style={[global.container, global.white]}>
          <Text text65 marginV-4>Meet up</Text>
          <Text text80M grey30 marginV-4>If the request has been confirmed, the customer would meet at the vendor's location to purchase their order of fresh produce.</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Enjoy = () => {
    return (
      <View flex>
        <View flex>
          <ImageBackground style={global.flex} source={require("../../../assets/images/enjoy.jpg")} />
        </View>
        <View flex style={[global.container, global.white]}>
          <Text text65 marginV-4>Enjoy!</Text>
          <Text text80M grey30 marginV-4>Enjoy your fresh produce!</Text>
          <View flexG />
          <Buttons />
        </View>
      </View>
    );
  };

  const Current = () => {
    switch (active) {
      case 0:
      default:
        return Search();
      case 1:
        return Request();
      case 2:
        return Decide();
      case 3:
        return Meet();
      case 4:
        return Enjoy();
    }
  };

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <View style={global.flex}>
          {Current()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Instructions