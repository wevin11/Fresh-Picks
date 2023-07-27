import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    vendor: null,
    customer: null,
    date: null
  },
  reducers: {
    addToOrder: (state, action) => {
      state.items = [...state.items, action.payload.product];
      state.vendor = action.payload.vendor;
      state.customer = action.payload.customer;
    },
    removeFromOrder: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      let newOrder = [...state.items];

      if (index >= 0) {
        newOrder.splice(index, 1);
      } else {
        console.warn(`Can"t remove product ${action.payload.id} as it's not in basket`);
      }

      state.items = newOrder;

      if (state.items.length == 0) {
        state.vendor = null;
      }
    },
    clearOrder: (state) => {
      state.items = [];
      state.vendor = null;
      state.date = null;
    },
    setOrderDate: (state, action) => {
      state.date = action.payload.date;
    },
  }
});

export const { addToOrder, removeFromOrder, clearOrder, setOrderDate } = orderSlice.actions

export const selectOrderItems = (state) => state.order.items;

export const selectOrderItemsWithId = (state, id) => state.order.items.filter((item) => item.id === id);

export const selectOrderTotal = (state) => state.order.items.reduce((total, item) => {
  return total + item.price;
}, 0);

export const getOrderVendor = (state) => state.order.vendor;

export const getOrderCustomer = (state) => state.order.customer;

export const getOrderDate = (state) => state.order.date;

export default orderSlice.reducer