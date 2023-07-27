import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { Formik } from "formik"
import React, { useState } from "react"
import { Alert, Platform, TouchableOpacity } from "react-native"
import CurrencyInput from "react-native-currency-input"
import { Button, Colors, Image, KeyboardAwareScrollView, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db, storage } from "../../../firebase"
import { global } from "../../../style"

const CreateSubscription = () => {
  const navigation = useNavigation<any>();
  const frequency = [
    {label: "Weekly", value: "Weekly"},
    {label: "Bi-Weekly", value: "Bi-Weekly"},
    {label: "Monthly", value: "Monthly"},
    {label: "Yearly", value: "Yearly"}
  ]
  const [visible, setVisible] = useState(false);

  const compress = async (uri: string, setFieldValue) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { height: 512 }}], { compress: 1 });
    setFieldValue('images', [manipulatedImage.uri]);
    setVisible(false);
  };

  const camera = async (setFieldValue) => {
    console.log("HERE 2");
    setVisible(true);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result.assets[0].uri, setFieldValue);
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

  const gallery = async (setFieldValue) => {
    setVisible(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result.assets[0].uri, setFieldValue);
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

  const createSubscription = async (values, images) => {
    await addDoc(collection(db, "Subscriptions"), {
      description: values.description,
      images: images,
      price: values.price,
      title: values.title,
      user: values.user,
      quantity: values.quantity,
      frequency: values.frequency,
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
      await createSubscription(values, imgs);
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required'),
  });

  return (
    <Formik
      initialValues={{ user: auth.currentUser.uid, title: '', description: '', price: 1.00, quantity: 1, images: [], frequency: frequency[0].value }}
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
              <View style={{ width: "30%" }}>
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

              <View style={{ width: "30%" }}>
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

              <View style={{ width: "30%" }}>
                <Text text65 marginV-4>Frequency *</Text>
                <Picker  
                  value={values.frequency}
                  style={[global.input, { marginBottom: -16 }]}
                  onChange={handleChange("frequency")}
                  onBlur={handleBlur("frequency")}
                  useSafeArea={true} 
                  topBarProps={{ title: 'Frequency' }} 
                >  
                  {frequency.map((frequency) => (   
                    <Picker.Item 
                      key={frequency.value} 
                      value={frequency.value} 
                      label={frequency.label} 
                      onPress={() => {
                        setFieldValue("frequency", frequency.value);
                      }}
                    />
                  ))}
                </Picker>
              </View>
              {errors.frequency && touched.frequency && <Text style={{ color: Colors.red30}}>{errors.frequency}</Text>}
            </View>

            <View style={global.field}>
              <Text text65 marginV-4>Image *</Text>
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
                label={"Create Subscription"} 
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

export default CreateSubscription