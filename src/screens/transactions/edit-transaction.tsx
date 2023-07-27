import { useNavigation } from "@react-navigation/native"
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useEffect, useState } from "react"
import { Platform } from "react-native"
import CurrencyInput from 'react-native-currency-input'
import { Button, Colors, DateTimePicker, KeyboardAwareScrollView, LoaderScreen, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db } from "../../../firebase"
import { global } from "../../../style"

const EditTransaction = ({ route }) => {
  const navigation = useNavigation<any>();
  const types = [
    {label: "Expense", value: "Expense"},
    {label: "Revenue", value: "Revenue"},
  ]
  const expense = [
    {label: "Uncategorized", value: "Uncategorized"},
    {label: "Assets", value: "Assets"},
    {label: "Business Administration", value: "Business Administration"},
    {label: "Farm Building Maintenance", value: "Farm Building Maintenance"},
    {label: "Farm Equipment", value: "Farm Equipment"},
    {label: "Farm Vehicle", value: "Farm Vehicle"},
    {label: "Labor", value: "Labor"},
    {label: "Loans & Interest", value: "Loans & Interest"},
    {label: "Inputs", value: "Inputs"},
    {label: "Other", value: "Other"},
    {label: "Rent", value: "Rent"},
    {label: "Storage", value: "Storage"},
  ]
  const revenue = [
    {label: "Uncategorized", value: "Uncategorized"},
    {label: "Agricultural Sales", value: "Agricultural Sales"},
    {label: "Custom Work Income", value: "Custom Work Income"},
    {label: "Gov Ag Program Payments", value: "Gov Ag Program Payments"},
    {label: "Insurance", value: "Insurance"},
    {label: "Rent Received", value: "Rent Received"},
    {label: "Other", value: "Other"}
  ]
	const [transaction, setTransaction] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const editTransaction = async (values) => {
    await updateDoc(doc(db, "Products", route.params.id), values).then(() => {
      console.log("Data saved!");
      navigation.goBack();
    }).catch((error) => {
      alert(error.message);
      console.log(error);
    });
  };

  const onSubmit = async (values) => {
    console.log(values);

    await editTransaction(values);
  }

  // const validationSchema = yup.object({
  //   title: yup.string().required('First name is required'),
  //   description: yup.string().required('Last name is required'),
  //   type: yup.string().email('Invalid email address').required('Email is required'),
  //   amount: yup.string().email('Invalid email address').required('Email is required'),
  //   price: yup.string().email('Invalid email address').required('Email is required'),
  // });

	useEffect(() => {
    if (route.params.id) {
      getDoc(doc(db, "Transactions", route.params.id)).then((doc) => {
        const data = doc.data();
        setTransaction(data);
      });
    }
  }, [route.params.id]);
  
  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (transaction && products) {
      products.unshift({id: "", title: "Not Specified"})
      console.log(products);
      setLoading(false);
    }
  }, [products, transaction]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <Formik
      initialValues={transaction || { user: auth.currentUser.uid, party: '', type: '', price: 0.00, product: '', label: '', category: '', notes: '', createdAt: new Date(), date: new Date() }}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <View row spread style={{ paddingVertical: 8 }}>
              <View style={{ width: "30%" }}>
                <Text text65 marginV-4>Type</Text>
                <Picker  
                  value={values.type}
                  style={[global.input, { marginBottom: -16 }]}
                  onChange={handleChange('type')}
                  onBlur={handleBlur('type')}
                  useSafeArea={true} 
                  topBarProps={{ title: 'Type' }} 
                >  
                  {types.map((type) => (   
                    <Picker.Item key={type.value} value={type.value} label={type.label} />
                  ))}
                </Picker>
              </View>

              <View style={{ width: "30%" }}>
                <Text text65 marginV-4>Price</Text>
                <CurrencyInput
                  value={values.price}
                  onChangeValue={(price) => setFieldValue("price", price)}
                  style={global.input}
                  prefix={values.type == 'Expense' ? "- $ " : "+ $ "}
                  delimiter=","
                  separator="."
                  precision={2}
                  minValue={0}
                  onChangeText={(formattedValue) => {
                    console.log(formattedValue); // R$ +2.310,46
                  }}
                />
              </View>

              <View style={{ width: "30%" }}>
                <Text text65 marginV-4>Date</Text>
                <DateTimePicker 
                  value={values.date.toDate()} 
                  onChange={(date) => setFieldValue("date", date)} 
                  style={global.input} 
                  placeholder="Transaction Date" 
                  pm 
                />
              </View>
            </View>

            <View style={global.field}>
              {values.type == 'Expense' 
                ? <Text text65 marginV-4>Vendor Name</Text>
                : <Text text65 marginV-4>Customer Name</Text>
              }
              <TextField
                style={global.input}
                onChangeText={handleChange('party')}
                onBlur={handleBlur('party')}
                value={values.party}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text text65 marginV-4>Product</Text>
              <Picker  
                value={values.product}
                style={[global.input, { marginBottom: -16 }]}
                onChange={handleChange("product")}
                onBlur={handleBlur("product")}
                useSafeArea={true} 
                topBarProps={{ title: 'Products' }} 
              >  
                {products.map((product) => (   
                  <Picker.Item 
                    key={product.id} 
                    value={product.id} 
                    label={product.title} 
                    onPress={() => {
                      setFieldValue("product", product.id);
                      setFieldValue("label", product.title);
                    }}
                  />
                ))}
              </Picker>
            </View>

            <View style={global.field}>
              <Text text65 marginV-4>Category</Text>
              {values.type == 'Expense' 
                ? <Picker  
                    value={values.category}
                    style={[global.input, { marginBottom: -16 }]}
                    onChange={handleChange('category')}
                    onBlur={handleBlur('category')}
                    useSafeArea={true} 
                    topBarProps={{ title: 'Categories' }} 
                  >  
                    {expense.map((category) => (   
                      <Picker.Item key={category.value} value={category.value} label={category.label} />
                    ))}
                  </Picker>
                : <Picker  
                    value={values.category}
                    style={[global.input, { marginBottom: -16 }]}
                    onChange={handleChange('category')}
                    onBlur={handleBlur('category')}
                    useSafeArea={true} 
                    topBarProps={{ title: 'Categories' }} 
                  >  
                    {revenue.map((category) => (   
                      <Picker.Item key={category.value} value={category.value} label={category.label} />
                    ))}
                  </Picker>
                }
            </View>

            <View style={global.field}>
              <Text text65 marginV-4>Notes</Text>
              <TextField
                style={global.area}
                multiline
                maxLength={100}
                onChangeText={handleChange('notes')}
                onBlur={handleBlur('notes')}
                value={values.notes}
                migrate
              />
            </View>

            <View flexG />

            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"Create Transaction"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.button} 
              onPress={handleSubmit}                
            />
          </KeyboardAwareScrollView>
        </View>
      )}
    </Formik>
  );
}

export default EditTransaction