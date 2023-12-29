import React, { ChangeEvent, FormEvent, useState } from 'react'
import '../styles/From.scss'
import { forgetPassword } from '../redux/slices/users/userSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { toast } from 'react-toastify'

const ForgetPassword = () => {
  const dispatch: AppDispatch = useDispatch()
  const [email, setEmail] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    dispatch(forgetPassword(email))
    toast.success('Check your email to reset your password')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Forget password?</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={handleInputChange} />
          </div>

          <button type="submit">Send reset email</button>
        </form>
      </div>
    </div>
  )
}

export default ForgetPassword
