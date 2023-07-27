import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { Formik } from 'formik'
import React from "react"
import { Alert, Platform } from "react-native"
import CurrencyInput from "react-native-currency-input"
import { Button, Colors, Image, KeyboardAwareScrollView, NumberInput, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db, storage } from "../../../firebase"
import { global } from "../../../style"

const CreateProduct = () => {
  const navigation = useNavigation<any>();

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

  const compress = async (result: ImagePicker.ImagePickerResult, setFieldValue) => {
    const compressed = [];
    
    result.assets.forEach(async (asset) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 512 }}], { compress: 0.5 });

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
        quality: 0.5,
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
        quality: 0.5,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

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

  const createProduct = async (values, images) => {
    await addDoc(collection(db, "Products"), {
      description: values.description,
      images: images,
      price: values.price,
      title: values.title,
      user: values.user,
      quantity: values.quantity,
      frequency: "Order",
      createdAt: new Date()
    }).then(() => {
      console.log("Data saved!");
      navigation.goBack();
    }).catch((error) => {
      alert(error.message);
      console.log(error);
    });
  };

  const handleSubmit = async (values) => {
    try {
      const imgs = await uploadImages(values.images);
      await createProduct(values, imgs);
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };
  
  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().min(0.01, 'Price is required'),
    quantity: Yup.number().min(1, 'Quantity is required'),
  });

  return (
    <Formik
      initialValues={{ user: auth.currentUser.uid, title: '', description: '', price: 1.00, quantity: 1, images: [] }}
      validationSchema={validate}
      onSubmit={handleSubmit}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <View style={global.field}>
              <Text text65 marginV-4>Title *</Text>
              <TextField
                style={global.input}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                migrate
              />
            </View>
            {errors.title && touched.title && <Text style={{ color: Colors.red30 }}>{errors.title}</Text>}

            <View style={global.field}>
              <Text text65 marginV-4>Description *</Text>
              <TextField
                style={global.area}
                multiline
                maxLength={200}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                migrate
              />
            </View>
            {errors.description && touched.description && <Text style={{ color: Colors.red30}}>{errors.description}</Text>}

            <View row spread style={{ paddingVertical: 8 }}>
              <View style={{ width: "47.5%" }}>
                <Text text65 marginV-4>Price *</Text>
                <CurrencyInput
                  value={values.price}
                  onChangeValue={(price) => setFieldValue("price", price)}
                  style={global.input}
                  prefix={values.type == 'Expense' ? "- $ " : "+ $ "}
                  delimiter=","
                  separator="."
                  precision={2}
                  minValue={0}
                  onBlur={handleBlur('price')}
                  onChangeText={(formattedValue) => {
                    console.log(formattedValue); // R$ +2.310,46
                  }}
                />
                {errors.price && touched.price && <Text style={{ color: Colors.red30 }}>{errors.price}</Text>}
              </View>

              <View style={{ width: "47.5%" }}>
              <Text text65 marginV-4>Quantity *</Text>
                <NumberInput
                  initialNumber={values.quantity}
                  style={global.input}
                  onChangeNumber={(data) => setFieldValue("quantity", data.number)}
                  onBlur={handleBlur('quantity')}
                  keyboardType={'numeric'}
                  fractionDigits={2}
                  migrate
                />
                {errors.quantity && touched.descripquantitytion && <Text style={{ color: Colors.red30 }}>{errors.quantity}</Text>}
              </View>
            </View>

            <View style={global.field}>
              <Text text65 marginV-4>Image</Text>
              <TouchableOpacity onPress={() => Alert.alert("Options", "Select photo from which option", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Camera', onPress: async () => await camera(setFieldValue)},
                {text: 'Gallery', onPress: async () => await gallery(setFieldValue)},
              ])}>
                {values.images.length == 0
                  ? <Image style={{ borderRadius: 8, borderWidth: 0.25, height: 150, width: "100%" }} source={require("../../../assets/images/default.png")} />
                  : <Image style={{ width: "100%", height: 150 }} source={{ uri: values.images[0] }} />
                }
              </TouchableOpacity>
            </View>
            
            <View flexG />

            <View style={global.field}>
              <Button 
                backgroundColor={Colors.primary}
                color={Colors.white}
                label={"Create Product"} 
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

export default CreateProduct