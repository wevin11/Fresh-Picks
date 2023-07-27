import { useNavigation } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import * as React from "react";
import { useRef, useState } from "react";
import PhoneInput from 'react-native-phone-input';
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { app, auth } from "../../../firebase";
import { global } from "../../../style";

const ChangePhone = () => {
  const navigation = useNavigation<any>();
  const phoneRef = useRef(null);
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;

  const [phone, setPhone] = useState<string>("");
  const [vid, setVID] = useState<any>();
  const [sms, setSMS] = useState<any>("");

  const checkIfUserExists = async () => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/checkIfUserExists", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'phoneNumber': phone,
          }
        }),
      });

      console.log(response);

      const json = await response.json();

      console.log(json);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const verifyPhone = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
      setVID(vid);
    } catch (error: any) {
      alert(error.message);
      console.log(error.message);
    }
  }

  const onSubmit = async (sms: string) => {
    let error = false;

    if (phone.length == 0) {
      error = true;
      return
    }

    const i = await checkIfUserExists();

    console.log(i);

    console.log("HI");

    if (error) {
      error = false;
      return
    }

    try {
      const credential = PhoneAuthProvider.credential(vid, sms);

      await signInWithCredential(auth, credential);
    } catch (error: any) {
      alert(error.message);
      console.log(error.message);
    }
  };

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>      
      <View flex style={global.container}>
        <View>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
            attemptInvisibleVerification={attemptInvisibleVerification}
          />
        </View>

        <View style={global.field}>
          <Text text65 marginV-4>Phone Number</Text>
          <PhoneInput
            ref={phoneRef}
            initialCountry={'us'}
            style={global.input}
            onChangePhoneNumber={(phone) => {
              setPhone(phone);
              console.log(phone);
            }}
            textProps={{
              placeholder: 'Enter a phone number...'
            }}
          />
        </View>

        <Button 
          backgroundColor={Colors.primary}
          color={Colors.white}
          label={"Send Verification Code"} 
          labelStyle={{ fontWeight: '600', padding: 8 }} 
          style={global.button} 
          onPress={verifyPhone}          
        />

        <View style={global.field}>
          <Text text65 marginV-4>Verify SMS Code</Text>
          <OTPInputView
            style={{width: '100%', height: 50}}
            pinCount={6}
            code={sms}
            onCodeChanged={code => setSMS(code)}
            autoFocusOnLoad={false}
            codeInputFieldStyle={global.otp}
            codeInputHighlightStyle={global.underline}
            onCodeFilled={code => onSubmit(code)}
          />
        </View>          

        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
    </View>
  );
}

export default ChangePhone