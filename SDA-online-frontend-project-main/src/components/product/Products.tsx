import { Link } from 'react-router-dom'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Product,
  fetchProducts,
  fetchProductsHome,
  searchProduct
} from '../../redux/slices/products/productSlice'
import { addToCart } from '../../redux/slices/cart/cartSlice'
import { AppDispatch, RootState } from '../../redux/store'
import SortProducts from './SortProducts'
import '../../styles/Dashboard.scss'
import { Button } from 'react-bootstrap'

function Products() {
  const dispatch: AppDispatch = useDispatch()
  const { searchTerm, products, error, pagination } = useSelector(
    (state: RootState) => state.products
  )
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(4)

  const fetchData = async () => {
    await dispatch(fetchProductsHome({ page: currentPage, limit: itemsPerPage }))
  }
  useEffect(() => {
    fetchData()
  }, [currentPage, itemsPerPage])

  if (error) {
    return <div>{error}</div>
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(searchProduct(event.target.value))
  }
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
  }

  const searchedProducts = searchTerm
    ? (products || []).filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products || []

  // const displayedProducts = searchedProducts.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // )

  console.log(pagination)
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

  console.log(buttonElements)

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
    <div className="wrapper" id="product-wraper">
      <div className="side-bar">
        <div className="search-container">
          <label htmlFor="search">Search for product</label>
          <input type="text" placeholder="Search.." name="search" onChange={handleSearch} />
        </div>
        <hr />
        <SortProducts />
      </div>
      <div className="main-content" style={{ overflowY: 'scroll' }}>
        <h2>Products</h2>
        <section className="products">
          {searchedProducts.length > 0 &&
            searchedProducts.map((product) => {
              return (
                <div className="product" key={product.slug}>
                  <div className="product-image">
                    <Link to={`/products/${product.slug}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid"
                        onError={(e) => {
                          console.log('Error loading image:', e)
                          console.log('Image src:', (e.target as HTMLImageElement).src)
                        }}
                      />
                    </Link>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="price">{product.price}</p>
                    <div className="buttons">
                      <Link to={`/products/${product.slug}`}>
                        <button>View Detailes</button>
                      </Link>

                      <button
                        onClick={() => {
                          handleAddToCart(product)
                        }}>
                        Add to cart
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
              <button
                onClick={handleNextPage}
                disabled={pagination.totalPages >= searchedProducts.length}>
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Products
