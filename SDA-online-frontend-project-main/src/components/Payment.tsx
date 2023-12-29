import React, { useEffect, useState } from 'react'
import DropIn from 'braintree-web-drop-in-react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../redux/store'
import { toast } from 'react-toastify'
// import { fetchBrainTreeToken, payWithBraintree } from '../services/productServices'
import {
  Product,
  fetchBrainTreeToken,
  payWithBraintree
} from '../redux/slices/products/productSlice'

const Payment = ({ cartItems, amount }: { cartItems: Product[]; amount: number }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [braintreeClientToken, setBraintreeClientToken] = useState(null)
  const [instance, setInstance] = useState()

  const getBraintreeClientToken = async () => {
    try {
      const res = await dispatch(fetchBrainTreeToken())
      setBraintreeClientToken(res.payload.clientToken)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBraintreeClientToken()
  }, [])

  const handlePayment = async () => {
    console.log(cartItems)
    console.log(amount)
    const { nonce } = await instance.requestPaymentMethod()
    await dispatch(payWithBraintree({ nonce, cartItems, amount }))
    toast.success('payment went successfully')
  }

  return (
    <div>
      {braintreeClientToken && (
        <DropIn
          options={{ authorization: braintreeClientToken }}
          onInstance={(instance) => setInstance(instance)}
        />
      )}
      <button onClick={handlePayment}>Make the Payment</button>
    </div>
  )
}

export default Payment
