import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import React from 'react';
import { Platform } from 'react-native';
import { Button, Colors, KeyboardAwareScrollView, RadioButton, RadioGroup, Text, TextField, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { auth, db } from '../../../firebase';
import { global } from '../../../style';

const ReportIssue = () => {
	const navigation = useNavigation<any>();

	const onSubmit = async (values) => {
    await addDoc(collection(db, "Issues"), {
      reason: values.reason,
      details: values.details,
			user: auth.currentUser.uid,
			createdAt: new Date()
    })
    .then(() => {
      navigation.goBack();
    })
    .catch((error) => {
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
							<RadioButton value={'App Content'} label={'App Content'} style={{ marginVertical: 16 }} /> 
							<RadioButton value={'App Feature'} label={'App Feature'} style={{ marginVertical: 16 }} /> 
							<RadioButton value={'App Performance'} label={'App Performance'} style={{ marginVertical: 16 }} /> 
							<RadioButton value={'App Security'} label={'App Security'} style={{ marginVertical: 16 }} />
							<RadioButton value={'App Suggestion'} label={'App Suggestion'} style={{ marginVertical: 16 }} />
							<RadioButton value={'App User Interface'} label={'App User Interface'} style={{ marginVertical: 16 }} />
							<RadioButton value={'Other'} label={'Other'} style={{ marginVertical: 16 }} />
						</RadioGroup>
						{errors.reason && touched.reason && <Text style={{ color: Colors.red30 }}>{errors.reason}</Text>}

						<Text text80M grey30 marginV-4>Explain your reason(s) for the report</Text>
						<TextField 
							value={values.details} 
							onChangeText={handleChange('details')}
							onBlur={handleBlur('details')}
							style={global.area} 
							maxLength={250} 
						/>
						{errors.details && touched.details && <Text style={{ color: Colors.red30 }}>{errors.details}</Text>}

						<View flexG />

						<Button 
							backgroundColor={Colors.primary}
							color={Colors.white}
							label={"Report Issue"} 
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

export default ReportIssue