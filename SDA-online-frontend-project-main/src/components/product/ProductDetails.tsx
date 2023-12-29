import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Product, getProductBySlug } from '../../redux/slices/products/productSlice'
import { addToCart } from '../../redux/slices/cart/cartSlice'
import { AppDispatch, RootState } from '../../redux/store'
import '../../styles/ProductDetails.scss'
import { toast } from 'react-toastify'

const ProductDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { singleProduct, isLoading, error } = useSelector((state: RootState) => state.products)
  const { categories } = useSelector((state: RootState) => state.categories)
  const dispatch: AppDispatch = useDispatch()
  useEffect(() => {
    dispatch(getProductBySlug(slug))
  }, [])

  // getProductBySlug(slug)

  console.log(slug)
  console.log(singleProduct.image)

  if (error) {
    return <div>{error}</div>
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
    toast('Added to cart')
  }

  const getCategoryName = (id: string) => {
    const categoryFound = categories.find((category) => category._id === id)

    return categoryFound ? categoryFound.title + '. ' : 'No category assigned'
  }

  console.log(singleProduct)
  return (
    <div className="product-container">
      <h2>Product Details</h2>
      {singleProduct && (
        <div className="card">
          <h3>{singleProduct.name}</h3>
          <img src={singleProduct.image} alt={singleProduct.name} />
          <p>
            <span>Description: </span>
            {singleProduct.description}
          </p>
          <p>
            <span>Price: </span>
            {singleProduct.price} SAR
          </p>
          <p>
            <span>Category: </span>
            {/* {singleProduct.category &&
              singleProduct.category.title &&
              getCategoryName(singleProduct.category._id)} */}
          </p>
          {singleProduct.sizes && singleProduct.sizes.length > 0 && (
            <p>
              <span>Size: </span>
              {singleProduct.sizes.join(', ')}
            </p>
          )}
          <button
            onClick={() => {
              handleAddToCart(singleProduct)
            }}>
            Add to cart{' '}
          </button>
          <button
            onClick={() => {
              navigate('/')
            }}>
            Continue Shopping{' '}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
