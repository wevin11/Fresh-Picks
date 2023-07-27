import * as Notifications from 'expo-notifications';
import { signInWithEmailAndPassword } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import * as React from "react";
import { useEffect, useState } from "react";
import { Platform } from 'react-native';
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib";
import * as Yup from 'yup';
import { auth, db } from "../../../firebase";
import { global } from "../../../style";

const Login = () => {
  const appConfig = require("../../../app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;

  const [token, setToken] = useState<any>(null)
  const [loading, setLoading] = useState(true);


  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync({ projectId });

    setToken(token.data);
  }

  const onSubmit = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password).then(async (credential) => {
        const user = credential.user;

        await updateDoc(doc(db, "Users", user.uid), {
          tokens: arrayUnion(token),
          createdAt: new Date(),
        });
      });
    } catch (error: any) {
      alert(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  return (
    <Formik 
      initialValues={{ email: "", password: "" }} 
      onSubmit={onSubmit}
      validationSchema={validation}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values, isSubmitting, submitCount }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <View style={global.field}>
              <Text text65 marginV-4>Email *</Text>
              <TextField
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={global.input}
                placeholder="Enter your email address" 
                migrate
              />
            </View>
            {errors.email && touched.email && <Text style={{ color: Colors.red30 }}>{errors.email}</Text>}
            
            <View style={global.field}>
              <Text text65 marginV-4>Password *</Text>
              <TextField
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={global.input}
                secureTextEntry
                placeholder="Enter your password" 
                migrate
              />
            </View>
            {errors.password && touched.password && <Text style={{ color: Colors.red30 }}>{errors.password}</Text>}

            <View flexG />
          
            <View style={global.field}>
              <Button 
                backgroundColor={Colors.primary}
                color={Colors.white}
                label={"Login"} 
                labelStyle={{ fontWeight: '600', padding: 8 }} 
                style={global.button} 
                onPress={handleSubmit}                
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </Formik>
  );
}

export default Login