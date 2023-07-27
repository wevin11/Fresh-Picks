import { useNavigation } from '@react-navigation/native';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { auth, db } from '../../../firebase';
import { global } from '../../../style';

const LinkAccount = () => {
	const navigation = useNavigation<any>();
	const phoneRef = useRef<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
	
	const onSubmit = (values) => {
		try {
			const credential = EmailAuthProvider.credential(
				values.email,
				values.password
			);
	
			linkWithCredential(auth.currentUser, credential).then((credential) => {
				const user = credential.user;
				console.log("Linked email to phone number:", user);
				navigation.goBack();
			}).catch((error) => {
        alert(error.message);
        console.log(error);
      });
		} catch (error) {
      alert(error.message);
			console.log(error);
      console.log("HI")
		}
	}

	useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((doc) => {
      const data = doc.data();
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

	if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

	return (
		<View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}> 
        <Formik 
          initialValues={{ email: "", password: "", confirm: "" }} 
          onSubmit={onSubmit}
          validationSchema={validate}
          enableReinitialize={true}
        >
          {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
            <View flex style={global.container}>
              <View style={global.field}>
                <Text text65 marginV-4>Email *</Text>
                <TextField
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={global.input}
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
                  migrate
                />
              </View>
              {errors.password && touched.password && <Text style={{ color: Colors.red30 }}>{errors.password}</Text>}

              <View style={global.field}>
                <Text text65 marginV-4>Confirm Password *</Text>
                <TextField
                  value={values.confirm}
                  onChangeText={handleChange('confirm')}
                  onBlur={handleBlur('confirm')}
                  style={global.input}
                  secureTextEntry
                  migrate
                />
              </View>
              {errors.confirm && touched.confirm && <Text style={{ color: Colors.red30 }}>{errors.confirm}</Text>}

              <View flexG />

              <Button 
                backgroundColor={Colors.primary}
                color={Colors.white}
                label={"Link Account"} 
                labelStyle={{ fontWeight: '600', padding: 8 }} 
                style={global.button} 
                onPress={handleSubmit}                
              />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
	)
}

export default LinkAccount