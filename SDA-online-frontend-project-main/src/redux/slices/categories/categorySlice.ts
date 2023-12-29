import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'

export const baseUrl = 'http://localhost:5050/categories'
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  try {
    const response = await axios.get(`${baseUrl}`)
    return response.data.payload.categories
  } catch (error) {
    console.error('Error', error)
  }
})
export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id: string) => {
  try {
    await axios.delete(`${baseUrl}/${id}`)
    return id
  } catch (error) {
    console.error('Error', error)
  }
})
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (title: string) => {
    try {
      const response = await axios.post(`${baseUrl}`, { title: title })
      return response.data
    } catch (error) {
      console.error('Error', error)
    }
  }
)
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: Partial<Category>) => {
    try {
      await axios.put(`${baseUrl}/${category._id}`, { title: category.title })
      return category
    } catch (error) {
      console.error('Error', error)
    }
  }
)
export type Category = {
  _id: string
  title: string
  slug: string
}

export type CategoryState = {
  categories: Category[]
  error: null | string
  isLoading: boolean
}

const initialState: CategoryState = {
  categories: [],
  error: null,
  isLoading: false
}

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // removeCategory: (state, action: { payload: { categoryId: string } }) => {
    //   const filteredCategories = state.categories.filter(
    //     (category) => category._id !== action.payload.categoryId
    //   )
    //   state.categories = filteredCategories
    // },
    // addCategory: (state, action) => {
    //   state.categories.push(action.payload)
    // },
    // updateCategory: (state, action) => {
    //   const { id, name } = action.payload
    //   const foundCategory = state.categories.find((category) => category._id === id)
    //   if (foundCategory) {
    //     foundCategory.title = name
    //   }
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload
      state.isLoading = false
    })
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter((category) => category._id !== action.payload)
      state.isLoading = false
    })
    builder.addCase(createCategory.fulfilled, (state, action) => {
      console.log(action.payload)
      state.categories.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      if (action.payload) {
        const { _id, title } = action.payload
        const foundCategory = state.categories.find((category) => category._id === _id)
        if (foundCategory && title) {
          foundCategory.title = title
        }
      }
      state.isLoading = false
    })
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true
        state.error = null
      }
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'an error occured'
      }
    )
  }
})

export default categorySlice.reducer
