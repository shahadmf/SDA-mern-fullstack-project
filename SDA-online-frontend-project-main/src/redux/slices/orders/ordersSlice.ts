import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const baseUrl = 'http://localhost:5050/orders'

// export type OrderItems = {
//   _id: string
//   quantity: number
//   product: string
// }

export type Order = {
  _id: string
  user: string
  orderItems: [{ _id: string; quantity: number; product: string }]
  totalAmount: number
  status: string
  createdAt?: Date
  updatedAt?: Date
}

export type OrdersState = {
  orders: Order[]
  error: null | string
  isLoading: boolean
  searchInput: string
}

const initialState: OrdersState = {
  orders: [],
  error: null,
  isLoading: false,
  searchInput: ''
}

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  try {
    const response = await axios.get(`${baseUrl}`)
    console.log(response.data.payload)
    return response.data.payload
  } catch (error) {
    console.log(error)
  }
})

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    searchOrder: (state, action) => {
      state.searchInput = action.payload
    },
    deleteOrder: (state, action) => {
      const id = action.payload
      const filteredOrders = state.orders.filter((order) => order._id !== id)
      state.orders = filteredOrders
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchOrders.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.error = action.error.message || 'Error has occured!'
      state.isLoading = false
    })
  }
})

export const { searchOrder, deleteOrder } = ordersSlice.actions
export default ordersSlice.reducer
