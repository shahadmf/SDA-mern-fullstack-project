import jwtDecode from 'jwt-decode'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch } from '../redux/store'
import { resetPassword } from '../redux/slices/users/userSlice'
import axios from 'axios'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const dispatch: AppDispatch = useDispatch()
  const [password, setPassword] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (token) {
        const response = await dispatch(resetPassword({ password, token }))
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Check your email to reset your password')
          navigate('/signin')
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message)
      }
    }
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">Please Enter your new pasword</label>
            <input type="password" name="password" value={password} onChange={handleInputChange} />
          </div>

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
