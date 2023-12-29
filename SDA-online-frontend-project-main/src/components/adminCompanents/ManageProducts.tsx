import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppDispatch, RootState } from '../../redux/store'
import AdminSideBar from '../../pages/admin/AdminSideBar'
import { IoIosClose } from 'react-icons/io'
import {
  creatProduct,
  deleteProduct,
  fetchProducts,
  fetchProductsHome,
  updateProduct
} from '../../redux/slices/products/productSlice'
import { fetchCategories } from '../../redux/slices/categories/categorySlice'
import { Button } from 'react-bootstrap'

const initialProductData = {
  name: '',
  price: '0',
  slug: '',
  category: '',
  image: '',
  description: '',
  variants: [],
  sizes: '',
  quantity: '0'
}

function ManageProducts() {
  const dispatch: AppDispatch = useDispatch()
  const { products, error, pagination } = useSelector((state: RootState) => state.products)
  const { categories } = useSelector((state: RootState) => state.categories)
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    sizes: '',
    quantity: ''
  })
  const [isEdited, setIsEdit] = useState(false)
  const [productSlug, setProductSlug] = useState('')
  const [productName, setProductName] = useState('')
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(4)
  useEffect(() => {
    dispatch(fetchProductsHome({ page: currentPage, limit: itemsPerPage }))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  if (error) {
    return <div>{error}</div>
  }

  const handleDelete = (slug: string) => {
    dispatch(deleteProduct(slug))
    // dispatch(fetchProducts())
    toast.success('Product deleted successfully!')
  }

  const handleCreateClick = () => {
    setIsFormVisible(!isFormVisible)
    if (isEdited) {
      setIsEdit(false)
      setProduct(initialProductData)
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    console.log(product)
    if (type === 'file') {
      const inputFile = event.target as HTMLInputElement

      setProduct((prevState) => {
        return { ...prevState, [name]: inputFile.files?.[0] }
      })
    } else {
      setProduct((prevState) => {
        return { ...prevState, [name]: value }
      })
    }
  }

  const handleEdit = (slug: string, name: string) => {
    setProductSlug(slug)
    setIsEdit(!isEdited)
    setProductName(name)
    setIsFormVisible(true)
    const existeingProduct = products.find((product) => product.slug === slug)
    console.log(existeingProduct)
    if (existeingProduct) {
      setProduct({
        ...existeingProduct,
        name: existeingProduct.name
      })
    }
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (
      !product.name ||
      !product.description ||
      !product.image ||
      !product.quantity ||
      Number(product.price) <= 0
    ) {
      alert('All fields are required and price must be greater than 0')
      return
    }

    if (product.name.length < 2) {
      alert('Product name must be at least 2 characters long')
      return
    }

    if (product.description.length < 10) {
      alert('Product description must be at least 10 characters long')
      return
    }

    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', String(product.price))
    formData.append('image', product.image || '')
    formData.append('category', String(product.category))
    formData.append('sizes', String(product.sizes))
    formData.append('quantity', String(product.quantity))
    if (!isEdited) {
      dispatch(creatProduct(formData))
      // dispatch(fetchProducts())
    } else {
      dispatch(updateProduct(product))
      setIsEdit(!isEdited)
      toast.success('Product updated successfully!')
    }

    setProduct(initialProductData)
    setIsFormVisible(false)
  }

  const buttonElements = []
  for (let i = 2; i <= pagination.totalPages - 1; i++) {
    buttonElements.push(
      <Button
        onClick={() => {
          handlePageChange(i)
        }}>
        {i}
      </Button>
    )
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1)
  }
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }
  const pageNumbers = []
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i)
  }
  return (
    <div className="wrapper">
      <AdminSideBar />
      <div className="main-content" style={{ overflowY: 'scroll' }}>
        <h2>Products</h2>
        <button onClick={handleCreateClick}>
          {isFormVisible ? <IoIosClose /> : 'Add new product'}
        </button>
        {isFormVisible && (
          <div className="add-form">
            <h3>Add Product</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Product Name"
                  value={product.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="description">Product Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Enter Product Description"
                  value={product.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="category">Product Category</label>
                <select
                  name="category"
                  id="category"
                  disabled={isEdited}
                  onChange={handleInputChange}
                  value={product.category}>
                  <option value="">Select a category</option>
                  {categories.map((category) => {
                    // eslint-disable-next-line react/jsx-key
                    return (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="price">Product Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter Product Price"
                  value={product.price}
                  onChange={handleInputChange}
                />
                <label htmlFor="quantity">Product Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter Product Quantity"
                  value={product.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="sizes">Product Sizes</label>
                <input
                  type="text"
                  name="sizes"
                  placeholder="Enter Product Sizes"
                  value={product.sizes}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="image">Product Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  disabled={isEdited}
                  onChange={handleInputChange}
                />
              </div>
              <button>{isEdited ? 'Update' : 'Create'}</button>
            </form>
          </div>
        )}
        <section className="products">
          {products.length > 0 &&
            products.map((product) => {
              return (
                <div className="product" key={product.slug}>
                  <div className="product-info">
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '50px', height: '50px' }}
                    />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>
                      <span>{product.price} SAR</span>
                    </p>
                    <p>
                      <span>{product.quantity} items</span>
                    </p>
                    {/* <p>
                      <span>{product.category}</span>
                    </p> */}
                    <p>
                      <span>{product.sizes}</span>
                    </p>
                    <div className="buttons">
                      <button onClick={() => handleDelete(product.slug)}>delete</button>
                      <button
                        onClick={() => {
                          handleEdit(product.slug, product.name)
                        }}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
        </section>
        <div className="pagination-container">
          <ul className="pagination">
            <li className="page-item">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
            </li>
            {/* {pageNumbers.map((number) => (
              <li className="page-item" key={number}>
                <button
                  onClick={() => handlePageChange(number)}
                  className={currentPage === number ? 'active' : ''}>
                  {number}
                </button>
              </li>
            ))} */}
            {[...Array(pagination.totalPages).keys()].map((_, index) => (
              <li className="page-item" key={index}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button onClick={handleNextPage} disabled={pagination.totalPages >= products.length}>
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ManageProducts
