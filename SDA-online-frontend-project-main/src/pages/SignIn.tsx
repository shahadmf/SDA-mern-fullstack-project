import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUsers, signInUsers } from '../redux/slices/users/userSlice'
import { AppDispatch, RootState } from '../redux/store'
import '../styles/From.scss'
import axios from 'axios'
import { toast } from 'react-toastify'

export const SignIn = ({ pathName }: { pathName: string }) => {
  const { userData } = useSelector((state: RootState) => state.users)
  const dispatch: AppDispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  useEffect(() => {
    if (userData) {
      navigate(pathName ? pathName : `/dashboard/${userData?.isAdmin ? 'admin' : 'user'}`)
    }
  }, [userData, navigate, pathName])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      dispatch(signInUsers(user))
      // navigate(`/${userData?.isAdmin ? 'admin' : 'user'}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message)
      }
    }
    setUser({
      email: '',
      password: ''
    })
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={user.email} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Sign In</button>
          <Link to="/forget-password">Forget Password?</Link>
        </form>
      </div>
    </div>
  )
}

export default SignIn
