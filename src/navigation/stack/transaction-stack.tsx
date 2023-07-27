import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Transactions from "../../../src/screens/transactions";
import CreateExpense from "../../../src/screens/transactions/create-expense";
import CreateRevenue from "../../../src/screens/transactions/create-revenue";
import CreateTransaction from "../../../src/screens/transactions/create-transaction";
import EditTransaction from "../../../src/screens/transactions/edit-transaction";
import ExportCSV from "../../../src/screens/transactions/export-csv";

const Stack = createNativeStackNavigator();

const TransactionStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Transactions" 
      screenOptions={{ 
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        },
      }}
    >
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Create Transaction" component={CreateTransaction} />
      <Stack.Screen name="Create Expense" component={CreateExpense} />
      <Stack.Screen name="Create Revenue" component={CreateRevenue} />
      <Stack.Screen name="Edit Transaction" component={EditTransaction} />
      <Stack.Screen name="Export CSV" component={ExportCSV} />
    </Stack.Navigator>
  )
}

export default TransactionStack