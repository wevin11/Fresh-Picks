import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Button, Colors, KeyboardAwareScrollView, RadioButton, RadioGroup, Text, TextField, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { db } from '../../../firebase';
import { global } from '../../../style';

const Report = ({ route }) => {
	const customer = route.params.customer;
	const vendor = route.params.vendor;
	const navigation = useNavigation<any>();
	const [reason, setReason] = useState("");
	const [details, setDetails] = useState("");

	const onSubmit = async (values) => {
    await addDoc(collection(db, "Reports"), {
      reason: values.reason,
      details: values.details,
			customer: customer.id,
			vendor: vendor.id,
			createdAt: new Date()
    }).then(() => {
      navigation.goBack();
    }).catch((error) => {
			alert(error.message);
      console.log(error);
    });
  };

	const validate = Yup.object().shape({ 
    reason: Yup.string().required("Reason is required"), 
    details: Yup.string().required("Details is required"),
  });

	return (
		<Formik 
			enableReinitialize={true}
			initialValues={{ reason: "", details: ""}}
			onSubmit={onSubmit}
			validationSchema={validate}
		>
			{({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
				<View useSafeArea flex backgroundColor={Colors.white}>
					<KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}> 
						<Text text65 marginV-4 numberOfLines={1}>Reason for the report:</Text>
						<RadioGroup initialValue={values.reason} onValueChange={(reason) => setFieldValue('reason', reason)}>
							<RadioButton value={'Account Hacking'} label={'Account Hacking'} style={{ marginVertical: 16 }} />
							<RadioButton value={'Copyright Infringement'} label={'Copyright Infringement'} style={{ marginVertical: 16 }} />
							<RadioButton value={'Harassment'} label={'Harassment'} style={{ marginVertical: 16 }} />  
							<RadioButton value={'Inappropriate Content'} label={'Inappropriate Content'} style={{ marginVertical: 16 }} />
							<RadioButton value={'Spam'} label={'Spam'} style={{ marginVertical: 16 }} />
							<RadioButton value={'Other'} label={'Other'} style={{ marginVertical: 16 }} />
						</RadioGroup>

						<Text text80M grey30 marginV-4>Explain your reason(s) for the report</Text>
						<TextField 
							value={values.details} 
							onChangeText={handleChange('details')}
							onBlur={handleBlur('details')}
							style={global.area} 
							maxLength={250} 
						/>
						
						<View flexG />

						<Button 
							backgroundColor={Colors.primary}
							color={Colors.white}
							label={"Report Profile"} 
							labelStyle={{ fontWeight: '600', padding: 8 }} 
							style={global.button} 
							onPress={handleSubmit}
						/>
					</KeyboardAwareScrollView>
				</View>
			)}
		</Formik>
	)
}

export default Report