import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from 'expo-notifications';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { GeoPoint, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, Carousel, Checkbox, Colors, DateTimePicker, Image, KeyboardAwareScrollView, LoaderScreen, PageControl, Text, TextField, View, Wizard } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { auth, db, storage } from '../../../firebase';
import { global } from '../../../style';

const Register = () => {
  const appConfig = require("../../../app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;
  
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [vid, setVID] = useState<any>();
  const [vendor, setVendor] = useState<boolean>(false);
  const [monday, setMonday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [tuesday, setTuesday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [wednesday, setWednesday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [thursday, setThursday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [friday, setFriday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [saturday, setSaturday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [sunday, setSunday] = useState<any>({ enable: false, start: new Date(), end: new Date() });
  const [visible, setVisible] = useState<boolean>(false);
  const [token, setToken] = useState<any>(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  const hideToast = () => {
    setVisible(false);
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

      // console.log(json);

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async (values, user, images) => {
    try {
      console.log(monday);

      if (vendor) {
        await setDoc(doc(db, "Users", user.uid), {
          createdAt: new Date(),
          name: values.name,
          role: vendor ? "Vendor" : "Customer",
          admin: false,
          vendor: vendor,
          email: values.email,
          address: values.address,
          location: values.location,
          images: images,
          business: values.business,
          description: values.description,
          website: values.website.length != 0 ? values.website : null,
          schedule: {
            monday: { enable: monday.enable, start: monday.start.toLocaleTimeString(), end: monday.end.toLocaleTimeString() }, 
            tuesday: { enable: tuesday.enable, start: tuesday.start.toLocaleTimeString(), end: tuesday.end.toLocaleTimeString() }, 
            wednesday: { enable: wednesday.enable, start: wednesday.start.toLocaleTimeString(), end: wednesday.end.toLocaleTimeString() }, 
            thursday: { enable: thursday.enable, start: thursday.start.toLocaleTimeString(), end: thursday.end.toLocaleTimeString() }, 
            friday: { enable: friday.enable, start: friday.start.toLocaleTimeString(), end: friday.end.toLocaleTimeString() }, 
            saturday: { enable: saturday.enable, start: saturday.start.toLocaleTimeString(), end: saturday.end.toLocaleTimeString() }, 
            sunday: { enable: sunday.enable, start: sunday.start.toLocaleTimeString(), end: sunday.end.toLocaleTimeString() }
          },
          payments: {
            paypal: values.paypal,
            cashapp: values.cashapp,
            venmo: values.venmo,
            zelle: values.zelle,
          },
          tokens: [token],
        });
      } else {
        await setDoc(doc(db, "Users", user.uid), {
          createdAt: new Date(),
          name: values.name,
          role: vendor ? "Vendor" : "Customer",
          admin: false,
          vendor: vendor,
          email: values.email,
          tokens: [token],
        });
      }
      
      
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values.email, values.password);
      const auth_credential = await createUserWithEmailAndPassword(auth, values.email, values.password);

      const user = auth_credential.user;
      const imgs = vendor ? await uploadImages(values.images) : [];
      await createUser(values, user, imgs);
    } catch (error) {
      console.log(error);
    }
  };

  const onActiveIndexChanged = (activeIndex: number) => {
    setActive(activeIndex);
  };

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <Button style={active !== 0 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-left"} size={48} color={Colors.white} />} onPress={goToPrevStep} disabled={active === 0} />
    );
  };

  const goToNextStep = () => {
    const prevActiveIndex = active;
    const prevCompletedStepIndex = completedStep;
    const activeIndex = prevActiveIndex + 1;
    let completedStepIndex = prevCompletedStepIndex;
    if (!prevCompletedStepIndex || prevCompletedStepIndex < prevActiveIndex) {
      completedStepIndex = prevActiveIndex;
    }

    if (activeIndex !== prevActiveIndex || completedStepIndex !== prevCompletedStepIndex) {
      setActive(activeIndex);
      setCompletedStep(completedStepIndex);
    }
  };

  const Next = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View>
        {vendor && active !== 5 || !vendor && active !== 1
          ? <Button style={{ backgroundColor: Colors.primary }} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} />
          : <Button style={{ backgroundColor: Colors.primary }} iconSource={() => <MCIcon name={"check"} size={48} color={Colors.white} />} onPress={handleSubmit} />
        }
      </View>
    );
  };

  const Buttons = (props) => {
    return (
      <View style={global.field}>
        <View row spread centerV>
          {Prev()}
          {/* <Text>{active}</Text> */}
          <PageControl numOfPages={vendor ? 6 : 2} currentPage={active} color={Colors.primary} />
          {Next(props)}
        </View>
      </View>
    )
  }

  const PersonalInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex style={global.container}>
        <View style={global.field}>
          <Text text65 marginV-4>Register as a Vendor?</Text>
          <Checkbox 
            value={vendor} 
            onValueChange={() => setVendor(!vendor)} 
            style={global.checkbox}
            color={Colors.primary}
          />
        </View>

        <View style={global.field}>
          <Text text65 marginV-4>Full Name *</Text>
          <TextField 
            style={global.input} 
            value={values.name} 
            onChangeText={handleChange('name')} 
            onBlur={handleBlur('name')}
            autoComplete="name" 
            placeholder="Enter your full name" 
            migrate 
          />
        </View>
        {errors.name && touched.name && <Text style={{ color: Colors.red30 }}>{errors.name}</Text>}

        <View flexG />
          
        <View style={global.field}>
          {Buttons(props)}
        </View>
      </View>
    )
  }

  const VendorInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View useSafeArea flex>
        <Carousel containerStyle={{ height: 200 }}>
          <TouchableOpacity style={global.flex} onPress={() => Alert.alert("Photo", "Would you like to delete this post?", [
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
        
        <View flexG style={{ padding: 24 }}>
          <View style={global.field}>
            <Text text65 marginV-4>Business Name *</Text>
            <TextField 
              value={values.business} 
              onChangeText={handleChange('business')} 
              onBlur={handleBlur('business')} 
              style={global.input} 
              placeholder="Enter your business" 
            />
          </View>
          {errors.business && touched.business && <Text style={{ color: Colors.red30 }}>{errors.business}</Text>}
          
          <View style={global.field}>
            <Text text65 marginV-4>Describe Your Business *</Text>
            <TextField 
              value={values.description} 
              onChangeText={handleChange('description')} 
              onBlur={handleBlur('description')} 
              style={global.area} 
              placeholder="Describe what products and services you sell" 
              maxLength={250} 
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
              placeholder="Enter your website"
            />
          </View>
          {errors.website && touched.website && <Text style={{ color: Colors.red30 }}>{errors.website}</Text>}

          <View flexG />

          <View style={global.field}>
            {Buttons(props)}
          </View>
        </View>
      </View>
    );
  };

  const VendorAddress = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex style={global.container}>
        <Text text65 marginV-4>Business Address *</Text>
        {errors.address && touched.address && <Text style={{ color: Colors.red30 }}>{errors.address}</Text>}

        {errors.location && touched.location && <Text style={{ color: Colors.red30 }}>{errors.location}</Text>}

        <GooglePlacesAutocomplete
          textInputProps={{
            onChange(text) {
              setFieldValue('address', text);
              setFieldValue('location', "");
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
              marginBottom: 16,
            },
            listView: {
              marginBottom: 16,
            }
          }}
          onPress={(data, details) => {
            if (!data || !details) return;

            const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
        
            setFieldValue('address', data.description);
            setFieldValue('location', geopoint);
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
                  
        <View style={global.field}>
          {Buttons(props)}  
        </View>
      </View> 
    );
  };

  const VendorSchedule = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex padding-24>
        <View row spread centerV height={72}>
          <Checkbox
            label={<Text text65 marginV-4>Monday</Text>}
            value={monday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setMonday({ enable: !monday.enable, start: null, end: null});
              } else {
                setMonday({ ...monday, enable: !monday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {monday.enable && <View row spread centerV style={global.time}>
            <DateTimePicker
              display="clock"
              mode="time"
              onChange={(date) => setMonday({ ...monday, start: date })}
              timeFormat={'hh:mm A'}
              value={monday.start}
            />

            <Text> - </Text>

            <DateTimePicker
              display="clock"
              minimumDate={monday.start}
              mode="time"
              onChange={(date) => setMonday({ ...monday, end: date })}
              timeFormat={'hh:mm A'}
              value={monday.end}
            />
          </View>}
        </View>

        <View row spread centerV height={72}>
          <Checkbox
            label={<Text text65 marginV-4>Tuesday</Text>} 
            value={tuesday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setTuesday({ enable: !tuesday.enable, start: null, end: null});
              } else {
                setTuesday({ ...tuesday, enable: !tuesday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {tuesday.enable && <View row spread centerV style={global.time}>
            <DateTimePicker
              display="clock"
              mode="time" 
              onChange={(date) => setTuesday({ ...tuesday, start: date })}
              timeFormat={'hh:mm A'} 
              value={tuesday.start}
            />

            <Text> - </Text>

            <DateTimePicker
              display="clock"
              minimumDate={tuesday.start}
              mode="time" 
              onChange={(date) => setTuesday({ ...tuesday, end: date })}
              timeFormat={'hh:mm A'} 
              value={tuesday.start}
            />
          </View>}
        </View>

        <View row spread centerV height={72}>
          <Checkbox
            label={<Text text65 marginV-4>Wednesday</Text>} 
            value={wednesday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setWednesday({ enable: !wednesday.enable, start: null, end: null});
              } else {
                setWednesday({ ...wednesday, enable: !wednesday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {wednesday.enable && <View row spread centerV style={global.time}>
            <DateTimePicker
              value={wednesday.start || new Date()}
              onChange={(date) => setWednesday({ ...wednesday, start: date })}
              mode="time" 
              timeFormat={'hh:mm A'} 
              display="clock"
            />

            <Text> - </Text>

            <DateTimePicker
              value={wednesday.end || new Date()}
              onChange={(date) => setWednesday({ ...wednesday, end: date })}
              mode="time" 
              timeFormat={'hh:mm A'}
              display="clock"
            />
          </View>}
        </View>

        <View row spread centerV height={72}>
          <Checkbox 
            label={<Text text65 marginV-4>Thursday</Text>} 
            value={thursday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setThursday({ enable: !thursday.enable, start: null, end: null});
              } else {
                setThursday({ ...thursday, enable: !thursday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {thursday.enable &&<View row spread centerV style={global.time}>
            <DateTimePicker
              value={thursday.start || new Date()}
              onChange={(date) => setThursday({ ...thursday, start: date })}
              mode="time" 
              timeFormat={'hh:mm A'} 
              display="clock"
            />

            <Text> - </Text>

            <DateTimePicker
              value={thursday.end ||new Date()} 
              onChange={(date) => setThursday({ ...thursday, end: date })}
              mode="time" 
              timeFormat={'hh:mm A'}
              display="clock"
            />
          </View>}
        </View>

        <View row spread centerV height={72}>
          <Checkbox
            label={<Text text65 marginV-4>Friday</Text>} 
            value={friday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setFriday({ enable: !friday.enable, start: null, end: null});
              } else {
                setFriday({ ...friday, enable: !friday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {friday.enable && <View row spread centerV style={global.time}>
            <DateTimePicker
              value={friday.start || new Date()}
              onChange={(date) => setFriday({ ...friday, start: date })}
              mode="time" 
              timeFormat={'hh:mm A'} 
              display="clock"
            />

            <Text> - </Text>

            <DateTimePicker
              value={friday.end || new Date()}
              onChange={(date) => setFriday({ ...friday, end: date })}
              mode="time" 
              timeFormat={'hh:mm A'}
              display="clock"
            />
          </View>}
        </View>

        <View row spread centerV height={72}>
          <Checkbox
            label={<Text text65 marginV-4>Saturday</Text>} 
            value={saturday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setSaturday({ enable: !saturday.enable, start: null, end: null});
              } else {
                setSaturday({ ...saturday, enable: !saturday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {saturday.enable &&<View row spread centerV style={global.time}>
            <DateTimePicker
              value={saturday.start || new Date()}
              onChange={(date) => setSaturday({ ...saturday, start: date })}
              mode="time" 
              timeFormat={'hh:mm A'} 
              display="clock"
            />

            <Text> - </Text>

            <DateTimePicker
              value={saturday.end || new Date()}
              onChange={(date) => setSaturday({ ...saturday, end: date })}
              mode="time" 
              timeFormat={'hh:mm A'}
              display="clock"
            />
          </View>}
        </View>

        <View row spread centerV height={72}>
          <Checkbox
            label={<Text text65 marginV-4>Sunday</Text>} 
            value={sunday.enable} 
            onValueChange={(value) => {
              if (!value) {
                setSunday({ enable: !sunday.enable, start: null, end: null});
              } else {
                setSunday({ ...sunday, enable: !sunday.enable })
              }
            }} 
            style={global.checkbox} 
          />

          {sunday.enable && <View row spread centerV style={global.time}>
            <DateTimePicker
              value={sunday.start || new Date()}
              onChange={(date) => setSunday({ ...sunday, start: date })}
              mode="time" 
              timeFormat={'hh:mm A'}
              display="clock"
            />

            <Text> - </Text>

            <DateTimePicker
              value={sunday.end || new Date()}
              onChange={(date) => setSunday({ ...sunday, end: date })}
              mode="time" 
              timeFormat={'hh:mm A'}
              display="clock"
            />
          </View>}
        </View>

        <View flexG />

        <View style={global.field}>
          {Buttons(props)}
        </View>
      </View>
    );
  };

  const VendorPayments = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex padding-24>
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
          {Buttons(props)}
        </View>
      </View>
    );
  };

  const AccountInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex padding-24>
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
          {Buttons(props)}
        </View>   
      </View>
    );
  };

  const Current = (props) => {
    switch (active) {
      case 0:
        return PersonalInformation(props);
      case 1:
        if (vendor)
          return VendorInformation(props);

        return AccountInformation(props);
      case 2:
        return VendorAddress(props);
      case 3:
        return VendorSchedule(props);
      case 4:
        return VendorPayments(props);
      case 5:
        return AccountInformation(props);
    }
  };

  const getStepState = (index: number) => {
    let state = Wizard.States.DISABLED;
    if (completedStep > index - 1) {
      state = Wizard.States.COMPLETED;
    } else if (active === index || completedStep === index - 1) {
      state = Wizard.States.ENABLED;
    }

    return state;
  }

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync({ projectId });

    setToken(token.data);

    return token.data;
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  // useEffect(() => {
  //   if (!monday.enable) {
  //     setMonday({...monday, start: null, end: null});
  //   }

  //   else if (!monday.enable) {
  //     setMonday({...monday, start: null, end: null});
  //   }

  //   if (!monday.enable) {
  //     setMonday({...monday, start: null, end: null});
  //   }


  // }, [monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validation = Yup.object().shape({
    name: Yup.string().required('Name is required'), 
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    address: Yup.string().when([], {
      is: () => vendor,
      then: (schema) => schema.required('Address is required'),
    }),
    location: Yup.object().when([], {
      is: () => vendor,
      then: (schema) => schema.required('Location is required'),
    }),
    business: Yup.string().when([], {
      is: () => vendor,
      then: (schema) => schema.required('Business is required'),
    }),
    description: Yup.string().when([], {
      is: () => vendor,
      then: (schema) => schema.required('Description is required'),
    }),
    website: Yup.string().url("Website must be a valid URL\nE.g. (https://www.google.com)").when([], {
      is: () => vendor,
      then: (schema) => schema.notRequired(),
    }),
    // images: Yup.array().required('Images is required')
  });

  return (
    <Formik 
      initialValues={{ name: "", email: "", password: "", address: "", location: "", business: "", description: "", website: "", images: [], paypal: "", cashapp: "", venmo: "", zelle: "" }} 
      onSubmit={handleSubmit}
      // validationSchema={validation}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values, isSubmitting, submitCount }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            {Current({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values })}
          </KeyboardAwareScrollView>
        </View>
      )}
    </Formik>
  );
}

export default Register