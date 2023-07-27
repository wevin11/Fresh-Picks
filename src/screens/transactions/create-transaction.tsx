import { useNavigation } from "@react-navigation/native"
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useEffect, useState } from "react"
import { Platform } from "react-native"
import CurrencyInput from "react-native-currency-input"
import { Button, Colors, DateTimePicker, KeyboardAwareScrollView, LoaderScreen, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db } from "../../../firebase"
import { global } from "../../../style"

const CreateTransaction = () => {
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
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async (values) => {
    console.log(values);

    await addDoc(collection(db, "Transactions"), values).then(() => {
      console.log("Data saved!");
      navigation.goBack();
    }).catch((error) => {
      alert(error.message);
      console.log(error);
    });
  }
  
  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (products) {
      products.unshift({id: "", title: "Not Specified"})
      console.log(products);
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({
    party: Yup.string().required('Party is required'), 
    type: Yup.string().required('Type is required'), 
    price: Yup.number().required('Type is required'), 
    product: Yup.string().notRequired(), 
    label: Yup.string().notRequired(), 
    category: Yup.string().required('Category is required'), 
    notes: Yup.string().required('Notes is required'), 
    date: Yup.date().required('Date is required')
  });

  return (
    <Formik
      initialValues={{ user: auth.currentUser.uid, party: '', type: '', price: 0.00, product: '', label: '', category: '', notes: '', createdAt: new Date(), date: new Date() }}
      onSubmit={onSubmit}
      validationSchema={validate}
    >
      {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
        <View useSafeArea flex backgroundColor={Colors.white}>
          <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <View row spread style={{ paddingVertical: 8 }}>
              <View style={{ width: "47.5%" }}>
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

              <View style={{ width: "47.5%" }}>
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
            </View>

            <View row spread style={{ paddingVertical: 8 }}>
              <View style={{ width: "47.5%" }}>
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
                {errors.party && touched.party && <Text style={{ color: Colors.red30 }}>{errors.party}</Text>}
              </View>

              <View style={{ width: "47.5%" }}>
                <Text text65 marginV-4>Date</Text>
                <DateTimePicker 
                  value={values.date} 
                  onChange={(date) => setFieldValue("date", date)} 
                  style={global.input} 
                  placeholder="Transaction Date" 
                  pm 
                />
                {errors.type && touched.type && <Text style={{ color: Colors.red30 }}>{errors.type}</Text>}
              </View>
            </View>

            <View row spread style={{ paddingVertical: 8 }}>
              <View style={{ width: "47.5%" }}>
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
                {errors.product && touched.product && <Text style={{ color: Colors.red30 }}>{errors.product}</Text>}
              </View>

              <View style={{ width: "47.5%" }}>
              <Text text65 marginV-4>Category</Text>
              {values.type == 'Expense' 
                ? <Picker  
                    numberOfLines = { 1 } 
                    value={values.category}
                    style={[global.input, { marginBottom: -16 }]}
                    onChange={handleChange('category')}
                    onBlur={handleBlur('category')}
                    useSafeArea={true} 
                    topBarProps={{ title: 'Categories' }} 
                  >  
                    {expense.map((category) => (   
                      <Picker.Item 
                        key={category.value} 
                        value={category.value} 
                        label={category.label}
                        onPress={() => {
                          setFieldValue("category", category.value);
                        }}
                      />
                    ))}
                  </Picker>
                : <Picker 
                numberOfLines = { 1 }  
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
            {errors.notes && touched.notes && <Text style={{ color: Colors.red30 }}>{errors.notes}</Text>}
            {errors.party && touched.party && <Text style={{ color: Colors.red30 }}>{errors.party}</Text>}
            {errors.type && touched.type && <Text style={{ color: Colors.red30 }}>{errors.type}</Text>}
            {errors.price && touched.price && <Text style={{ color: Colors.red30 }}>{errors.price}</Text>}
            {errors.product && touched.product && <Text style={{ color: Colors.red30 }}>{errors.product}</Text>}
            {errors.label && touched.label && <Text style={{ color: Colors.red30 }}>{errors.label}</Text>}
            {errors.category && touched.category && <Text style={{ color: Colors.red30 }}>{errors.category}</Text>}
            {errors.date && touched.date && <Text style={{ color: Colors.red30 }}>{errors.date}</Text>}

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

export default CreateTransaction