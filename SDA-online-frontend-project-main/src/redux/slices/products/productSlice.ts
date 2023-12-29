import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'

import { toast } from 'react-toastify'

export const baseUrl = 'http://localhost:5050/products'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  try {
    const response = await axios.get(`${baseUrl}`)
    return response.data.payload.products
  } catch (error) {
    console.error('Error', error)
  }
})

export const fetchProductsHome = createAsyncThunk(
  'products/fetchProductsHome',
  async ({ page, limit }: { page: number; limit: number }) => {
    try {
      const response = await axios.get(`${baseUrl}`, { params: { page, limit } })
      return response.data.payload.products
    } catch (error) {
      console.error('Error', error)
    }
  }
)

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (slug: string) => {
  try {
    await axios.delete<Product[]>(`${baseUrl}/${slug}`)
    return slug
  } catch (error) {
    console.error('Error', error)
  }
})

export const getProductBySlug = createAsyncThunk(
  'products/getProductBySlug',
  async (slug: string | undefined) => {
    const response = await axios.get(`${baseUrl}/${slug}`)
    return response.data.payload
  }
)

export const creatProduct = createAsyncThunk(
  'products/creatProduct',
  async (newProduct: FormData) => {
    const response = await axios.post(`${baseUrl}`, newProduct, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData: Product) => {
    try {
      const response = await axios.put(`${baseUrl}/${productData.slug}`, productData)
      return response.data.payload
    } catch (error) {
      console.log(error)
      throw error
    }
  }
)

export const fetchBrainTreeToken = createAsyncThunk('products/fetchBrainTreeToken', async () => {
  const response = await axios.get(`${baseUrl}/braintree/token`)
  return response.data
})

export const payWithBraintree = createAsyncThunk(
  'products/payWithBraintree',
  async (data: object) => {
    const response = await axios.post(`${baseUrl}/braintree/payment`, data)
    return response.data
  }
)

export type Product = {
  _id: string
  name: string
  price: number
  slug: string
  category: string
  image: string
  description: string
  variants: string[]
  sizes: string[]
  quantity: number
  sold: number
}

export type ProductState = {
  products: Product[]
  error: null | string
  isLoading: boolean
  searchTerm: string
  singleProduct: Product
  pagination: { totalProducts: number; totalPages: number; currentPage: number }
  selectedCategory: string
}

const initialState: ProductState = {
  products: [],
  error: null,
  isLoading: false,
  searchTerm: '',
  singleProduct: {} as Product,
  pagination: {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1
  },
  selectedCategory: ''
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.searchTerm = action.payload
    },

    sortProducts: (state, action) => {
      const sortingCriteria = action.payload
      if (sortingCriteria === 'name') {
        state.products.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortingCriteria === 'price') {
        state.products.sort((a, b) => a.price - b.price)
      }
    },

    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload
      console.log(action.payload)
      state.isLoading = false
    })

    builder.addCase(fetchProductsHome.fulfilled, (state, action) => {
      // const { currentPage, totalPages, totalProducts } = action.payload.pagination
      const currentPage = action.payload.pagination?.currentPage || 1
      const totalPages = action.payload.pagination?.totalPages || 1
      const totalProducts = action.payload.pagination?.totalProducts || 0
      state.pagination = {
        currentPage: currentPage,
        totalPages: totalPages,
        totalProducts: totalProducts
      }
      state.products = action.payload
      console.log(action.payload)
      state.isLoading = false
    })

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false
      state.products = state.products.filter((product) => product.slug !== action.payload)
    })

    builder.addCase(getProductBySlug.fulfilled, (state, action) => {
      state.singleProduct = action.payload
      console.log(action.payload)
    })

    builder.addCase(creatProduct.fulfilled, (state, action) => {
      state.products.push(action.payload)
      toast.success('Product added successfully!')
      console.log(action.payload)
      state.isLoading = false
    })

    builder.addCase(updateProduct.fulfilled, (state) => {
      fetchProducts()
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

export const { searchProduct, sortProducts, setSelectedCategory } = productSlice.actions

export default productSlice.reducer
