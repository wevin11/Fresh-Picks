import { useNavigation } from '@react-navigation/native';
import { GeoPoint, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import * as geofire from 'geofire-common';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { auth, db } from '../../../firebase';
import { global } from '../../../style';

const VendorLocation = () => {
	const navigation = useNavigation<any>();
	const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

	const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      address: values.address,
      location: values.location,
			geohash: values.geohash
    })
    .then(() => {
      navigation.goBack();
    })
    .catch((error) => {
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
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({ 
    address: Yup.string().required("Address is required"), 
    location: Yup.object().required("Location is required"),
  });

  return (
		<Formik 
			enableReinitialize={true}
			initialValues={{ address: user.address, location: user.location, geohash: user.geohash } || { address: "", location: "", hash: "" }}
			onSubmit={onSubmit}
			validationSchema={validate}
		>
			{({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
				<View useSafeArea flex backgroundColor={Colors.white}>
					<KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
						<Text text65 marginV-4>Business Address *</Text>
						<GooglePlacesAutocomplete
							textInputProps={{
								onChange(text) {
									setFieldValue('address', text);
									setFieldValue('location', null);
								},
								autoCapitalize: "none",
								autoCorrect: false,
								value: values.address
							}}
							styles={{
								textInput: {
									height: 50,
									width: "100%",
									borderWidth: 1,
									borderColor: "rgba(0, 0, 0, 0.2)",
									borderRadius: 8,
									paddingHorizontal: 8,
									backgroundColor: Colors.white,
								}
							}}
							onPress={(data, details) => {
								if (!data || !details) return;

								const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);

								const { lat, lng } = details.geometry.location;

								const geohash = geofire.geohashForLocation([lat, lng]);

								setFieldValue('address', data.description);
								setFieldValue('location', geopoint);
								setFieldValue('geohash', geohash);

								console.log(geohash);
							}}
							fetchDetails={true}
							minLength={10}
							enablePoweredByContainer={false}
							placeholder="Enter your address here"
							debounce={1000}
							nearbyPlacesAPI="GooglePlacesSearch"
							keepResultsAfterBlur={true}
							query={{
								key: "APIKEY",
								language: "en",
							  }}
							  requestUrl={{
								url: "PROXYAPI",
								useOnPlatform: "web"
							  }}
						/>

						<Button 
							backgroundColor={Colors.primary}
							color={Colors.white}
							label={"Update Vendor Location"} 
							labelStyle={{ fontWeight: '600', padding: 8 }} 
							style={global.button} 
							onPress={handleSubmit}
							disabled={!values.location}
						/>
					</KeyboardAwareScrollView>
				</View>
					
			)}
		</Formik>
  );
};

export default VendorLocation;