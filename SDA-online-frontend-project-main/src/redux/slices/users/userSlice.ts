import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'
import { toast } from 'react-toastify'
axios.defaults.withCredentials = true

export const baseUrl = 'http://localhost:5050'

type ResetData = {
  password: string
  token: string
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const response = await axios.get(`${baseUrl}/users`)
    return response.data.payload
  } catch (error) {
    throw new Error(`Failed to fetch the users`)
  }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  try {
    await axios.delete(`${baseUrl}/users/${id}`)
    console.log(id)
    return id
  } catch (error) {
    toast.error(`Failed to delete a user`)
  }
})

export const banUser = createAsyncThunk('users/banUser', async (id: string) => {
  try {
    await axios.put(`${baseUrl}/users/ban/${id}`)
    return id
  } catch (error) {
    throw new Error(`Failed to ban a user`)
  }
})

export const unbanUser = createAsyncThunk('users/unbanUser', async (id: string) => {
  try {
    await axios.put(`${baseUrl}/users/unban/${id}`)
    return id
  } catch (error) {
    throw new Error(`Failed to unban a user`)
  }
})

export const updateUserRole = createAsyncThunk('users/updateUserRole', async (id: string) => {
  try {
    await axios.put(`${baseUrl}/users/role/${id}`)
    return id
  } catch (error) {
    throw new Error(`Failed to Updte the user role`)
  }
})

export const updateUserProfile = createAsyncThunk(
  'users/updateUserProfile',
  async (userData: User) => {
    try {
      // const response = await axios.put(`${baseUrl}/users/profile/${id}`, updatedUser)
      // if (!response) {
      //   throw new Error('No response')
      // }
      // console.log(response.data.payload)
      // return response.data
      await axios.put(`${baseUrl}/users/profile/${userData._id}`, userData)
      return userData._id
    } catch (error) {
      throw new Error(`Failed to update a user`)
    }
  }
)

export const createUser = async (newUser: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/users/registering`, newUser, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to register`)
  }
}

export const activateUser = createAsyncThunk('users/activateUser', async (token: string) => {
  try {
    const response = await axios.post(`${baseUrl}/users/activate`, { token })
    console.log(response)
    return response.data
  } catch (error) {
    throw new Error(`Failed to register`)
  }
})

export const signInUsers = createAsyncThunk(
  'users/signInUsers',
  async (user: object, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, user)
      if (!response) {
        throw new Error('No response')
      }
      return response.data.payload
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.msg)
      }
    }
  }
)

export const signOutUsers = createAsyncThunk('users/signOutUsers', async () => {
  try {
    const response = await axios.post(`${baseUrl}/auth/logout`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
})

export const forgetPassword = createAsyncThunk('users/forgetPassword', async (email: string) => {
  try {
    const response = await axios.post(`${baseUrl}/users/forget-password`, { email: email })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
})

export const resetPassword = createAsyncThunk('users/resetPassword', async (data: ResetData) => {
  try {
    const response = await axios.post(`${baseUrl}/users/reset-password`, {
      password: data.password,
      token: data.token
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
})

export type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  age: number
  image: string
  phone: string
  address: string
  isAdmin: boolean
  isBanned: boolean
  gender: string
  order: string[]
}

export type UserState = {
  users: User[]
  error: null | string
  isLoading: boolean
  isSignedin: boolean
  userData: User | null
  ban: boolean
}

const data =
  localStorage.getItem('signinData') !== null
    ? JSON.parse(String(localStorage.getItem('signinData')))
    : []

const initialState: UserState = {
  users: [],
  error: null,
  isLoading: false,
  isSignedin: data.isSignedin,
  userData: data.userData,
  ban: false
}

export const userSlice = createSlice({
  name: 'uers',
  initialState,
  reducers: {
    editProfile: (state, action) => {
      const { id, firstName, lastName } = action.payload
      const userFound = state.users.find((user) => user._id === id)
      if (userFound) {
        userFound.firstName = firstName
        userFound.lastName = lastName
        state.userData = userFound
        localStorage.setItem(
          'loginData',
          JSON.stringify({
            isLoggedin: state.isSignedin,
            userData: state.userData
          })
        )
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload
      state.isLoading = false
    })

    builder.addCase(activateUser.fulfilled, (state, action) => {
      state.users.push(action.payload.payload)
      state.isLoading = false
    })

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload)
      state.isLoading = false
    })

    // builder.addCase(updateUserRole.fulfilled, (state) => {
    //   fetchUsers()
    //   state.isLoading = false
    // })

    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      // const { firstName, lastName, email, image, phone, address } = action.payload
      if (state.userData) {
        //   state.userData.firstName = firstName
        //   state.userData.lastName = lastName
        //   state.userData.email = email
        //   state.userData.image = image
        //   state.userData.phone = phone
        //   state.userData.address = address
        state.userData = JSON.parse(action.payload)
        localStorage.setItem(
          'loginData',
          JSON.stringify({
            isLoggedin: state.isSignedin,
            userData: state.userData
          })
        )
      }
      state.isLoading = false
    })

    builder.addCase(banUser.fulfilled, (state, action) => {
      console.log(state.users)
      const foundUser = state.users.find((user) => user._id === action.payload)
      if (foundUser) {
        foundUser.isBanned = !foundUser.isBanned
      }
      state.isLoading = false
    })

    builder.addCase(unbanUser.fulfilled, (state, action) => {
      // state.users = action.payload
      const foundUser = state.users.find((user) => user._id === action.payload)
      if (foundUser) {
        foundUser.isBanned = !foundUser.isBanned
      }
      state.isLoading = false
    })

    builder.addCase(signInUsers.fulfilled, (state, action) => {
      console.log(action.payload)
      state.isSignedin = true
      state.userData = action.payload
      localStorage.setItem(
        'signinData',
        JSON.stringify({
          isSignedin: state.isSignedin,
          userData: state.userData
        })
      )
    })

    builder.addCase(signOutUsers.fulfilled, (state) => {
      console.log('signed out')
      state.isSignedin = false
      state.userData = null
      localStorage.setItem(
        'signinData',
        JSON.stringify({
          isSignedin: state.isSignedin,
          userData: state.userData
        })
      )
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

export const { editProfile } = userSlice.actions
export default userSlice.reducer
