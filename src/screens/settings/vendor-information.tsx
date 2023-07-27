import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { Button, Carousel, Colors, Image, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib";
import * as Yup from 'yup';
import { auth, db, storage } from "../../../firebase";
import { global } from "../../../style";

const VendorInformation = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const checkIfImageIsAppropriate = async (images) => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/checkIfImageIsAppropriate", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'image': images[0],
          }
        }),
      });

      // console.log(response);

      const json = await response.json();

      console.log(json);

      return json;
    } catch (error) {
      console.error(error);
    }
  }

  const camera = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

  const gallery = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

  const compress = async (result: ImagePicker.ImagePickerResult, setFieldValue) => {
    const compressed = [];
    
    result.assets.forEach(async (asset) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 400 }}], { compress: 0 });

      compressed.push(manipulatedImage.uri);
    });

    const i = await checkIfImageIsAppropriate(result.assets);

    if (!i.result) {
      Alert.alert("Image has inappropriate content", "The image has been scanned to have some inappropriate content. Please select another image to upload.", [
        {text: 'OK', style: 'cancel'},
      ]);
    } else {
      setFieldValue('images', compressed)
    }
  };

  const deleteImage = async () => {
    try {
      const storageRef = ref(storage, `${auth.currentUser.uid}/images`);
      await deleteObject(storageRef);
      console.log('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const uploadImages = async (images) => {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const uploadImage = async (image) => {
    const storageRef = ref(storage, `${auth.currentUser.uid}/images/${Date.now()}`);
    const img = await fetch(image);
    const blob = await img.blob();

    const response = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(response.ref);
    return url;
  }

  const onSubmit = async (values) => {
    await deleteImage();
    const imgs = await uploadImages(values.images);
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      business: values.business,
      description: values.description,
      website: values.website,
      images: imgs
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
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({ 
    business: Yup.string().required('Business is required'), 
    description: Yup.string().required('Description is required'), 
    website: Yup.string().url("Website must be a valid URL\nE.g. (https://www.google.com)").required('Website is required'), 
    images: Yup.array().min(1, "Images is required")
  });
  
  return (
    <Formik
      enableReinitialize={true} 
      initialValues={{ business: user.business, description: user.description, website: user.website, address: user.address, images: user.images } || { business: "", description: "", website: "", images: [] }} 
      onSubmit={onSubmit}
      validationSchema={validate}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <Carousel containerStyle={{ height: 200 }}>
              <TouchableOpacity style={global.flex} onPress={() => Alert.alert("Delete Chat", "Would you like to delete this post?", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Camera', onPress: async () => await camera(setFieldValue)},
                {text: 'Gallery', onPress: async () => await gallery(setFieldValue)},
              ])}>
                <View flex centerV>
                  {values.images.length == 0
                    ? <Image style={global.flex} source={require("../../../assets/images/default.png")} overlayType={Image.overlayTypes.BOTTOM} />
                    : <Image style={global.flex} source={{ uri: values.images[0] }} cover overlayType={Image.overlayTypes.BOTTOM} />
                  }
                </View>
              </TouchableOpacity>
            </Carousel>
            <View flex style={[global.container, global.white]}>
              <View style={global.field}>
                <Text text65 marginV-4>Business Name *</Text>
                <TextField
                  value={values.business}
                  onChangeText={handleChange('business')}
                  onBlur={handleBlur('business')}
                  style={global.input}
                  migrate
                />
              </View>
              {errors.business && touched.business && <Text style={{ color: Colors.red30 }}>{errors.business}</Text>}
              
              <View style={global.field}>
                <Text text65 marginV-4>Describe your business *</Text>
                <TextField
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  style={global.area}
                  multiline
                  maxLength={100}
                  migrate
                />
              </View>
              {errors.description && touched.description && <Text style={{ color: Colors.red30 }}>{errors.description}</Text>}

              <View style={global.field}>
                <Text text65 marginV-4>Website</Text>
                <TextField
                  value={values.website}
                  onChangeText={handleChange('website')}
                  onBlur={handleBlur('website')}
                  style={global.input}
                  migrate
                />
              </View>
              {errors.website && touched.website && <Text style={{ color: Colors.red30 }}>{errors.website}</Text>}

              <View flexG />

              <Button 
                backgroundColor={Colors.primary}
                color={Colors.white}
                label={"Update Vendor Information"} 
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

export default VendorInformation