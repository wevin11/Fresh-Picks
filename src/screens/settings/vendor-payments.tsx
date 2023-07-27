import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib";
import { auth, db } from "../../../firebase";
import { global } from "../../../style";

const VendorPayments = () => {
	const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      payments: {
        paypal: values.paypal,
        cashapp: values.cashapp,
        venmo: values.venmo,
        zelle: values.zelle,
      },
    }).then(() => {
      navigation.goBack();
    }).catch((error) => {
      alert(error.message);
      console.log(error);
    });
  };

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((doc) => {
      const data = doc.data();
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user.payments.paypal);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

	return (
    <Formik
      enableReinitialize={true} 
      initialValues={{ paypal: user.payments.paypal, cashapp: user.payments.cashapp, venmo: user.payments.venmo, zelle: user.payments.zelle } || { paypal: "", cashapp: "", venmo: "", zelle: "" }} 
      onSubmit={onSubmit}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <View style={global.field}>
              <Text text65 marginV-4>PayPal</Text>
              <TextField
                value={values.paypal}
                onChangeText={handleChange('paypal')}
                onBlur={handleBlur('paypal')}
                style={global.input}
                migrate
              />
            </View>
            {errors.paypal && touched.paypal && <Text style={{ color: Colors.red30 }}>{errors.paypal}</Text>}
            
            <View style={global.field}>
              <Text text65 marginV-4>CashApp</Text>
              <TextField
                value={values.cashapp}
                onChangeText={handleChange('cashapp')}
                onBlur={handleBlur('cashapp')}
                style={global.input}
                migrate
              />
            </View>
            {errors.cashapp && touched.cashapp && <Text style={{ color: Colors.red30 }}>{errors.cashapp}</Text>}

            <View style={global.field}>
              <Text text65 marginV-4>Venmo</Text>
              <TextField
                value={values.venmo}
                onChangeText={handleChange('venmo')}
                onBlur={handleBlur('venmo')}
                style={global.input}
                migrate
              />
            </View>
            {errors.venmo && touched.venmo && <Text style={{ color: Colors.red30 }}>{errors.venmo}</Text>}

            <View style={global.field}>
              <Text text65 marginV-4>Zelle</Text>
              <TextField
                value={values.zelle}
                onChangeText={handleChange('zelle')}
                onBlur={handleBlur('zelle')}
                style={global.input}
                migrate
              />
            </View>
            {errors.zelle && touched.zelle && <Text style={{ color: Colors.red30 }}>{errors.zelle}</Text>}

            <View flexG />

            <View style={global.field}>
              <Button 
                backgroundColor={Colors.primary}
                color={Colors.white}
                label={"Update Vendor Payments"} 
                labelStyle={{ fontWeight: '600', padding: 8 }} 
                style={global.button} 
                onPress={handleSubmit}                
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </Formik>
	)
}

export default VendorPayments