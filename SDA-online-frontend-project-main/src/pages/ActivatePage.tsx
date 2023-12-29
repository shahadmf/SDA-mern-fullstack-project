import jwtDecode from 'jwt-decode'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { AppDispatch } from '../redux/store'
import { toast } from 'react-toastify'

import axios from 'axios'
import { activateUser } from '../redux/slices/users/userSlice'

// interface DecodedToken {
//   firstName: string
//   lastName: string
//   email: string
//   password: string
//   image: string
//   address: string
//   phone: string
// }

const ActivatePage = () => {
  const { token } = useParams()
  console.log(token)

  const decoded: { firstName: string; lastName: string } = jwtDecode(token)
  const dispatch: AppDispatch = useDispatch()

  const navigate = useNavigate()

  const handleActivate = async () => {
    try {
      if (token) {
        const response = await dispatch(activateUser(token))
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('New user created successfully')
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
        <h2>Activate Your Account</h2>
        {decoded ? (
          <>
            <h3>Hello {decoded.firstName}</h3>
            <h3>Click the button to activate your account</h3>
            <button onClick={handleActivate}>Activate</button>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {/* <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">Please Enter your new pasword</label>
            <input type="password" name="password" value={password} onChange={handleInputChange} />
          </div>

          <button type="submit">Reset Password</button>
        </form> */}
      </div>
    </div>
  )
}

export default ActivatePage
