import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { createUser } from '../redux/slices/users/userSlice'

function SignUp() {
  const navigate = useNavigate()
  // const dispatch: AppDispatch = useDispatch()
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    age: 0,
    image: null,
    phone: '',
    address: '',
    isAdmin: false,
    isBanned: false
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      const fileInput = event.target as HTMLInputElement
      setUser((prevState) => {
        return {
          ...prevState,
          [event.target.name]: fileInput.files?.[0]
        }
      })
    } else {
      setUser((prevState) => {
        return {
          ...prevState,
          [event.target.name]: event.target.value
        }
      })
    }
  }

  console.log(user)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      alert('All fields are required')
      return
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(user.email)) {
      alert('Please enter a valid email address')
      return
    }

    if (user.password.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    const formData = new FormData()
    formData.append('firstName', user.firstName)
    formData.append('lastName', user.lastName)
    formData.append('email', user.email)
    formData.append('password', user.password)
    formData.append('phone', String(user.phone))
    formData.append('address', user.address)
    formData.append('age', String(user.age))
    formData.append('image', user.image || '')

    try {
      const response = await createUser(formData)
      console.log(response)
      // console.log(user)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log(error)
      }
    }

    toast.success('Check your email to activate your account!')
    navigate('/SignIn')

    // setTimeout(() => {
    //   navigate('/signin')
    // }, 2000)
  }

  return (
    <div className="form-container">
      <ToastContainer />
      <div className="form-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="address"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input type="age" name="age" value={user.age} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="image">Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
