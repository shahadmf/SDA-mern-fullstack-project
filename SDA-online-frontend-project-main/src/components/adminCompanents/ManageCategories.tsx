import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import AdminSideBar from '../../pages/admin/AdminSideBar'
import { AppDispatch } from '../../redux/store'

import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from '../../redux/slices/categories/categorySlice'
import useCategoryState from '../../hooks/useCategoryState'
import { toast } from 'react-toastify'

const ManageCategories = () => {
  const { categories, isLoading, error } = useCategoryState()
  const [categoryTitle, setCategoryTitle] = useState('')
  const [isEdited, setIsEdit] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [categoryNameError, setCategoryNameError] = useState('')
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error}</div>
  }

  const handleDelete = (id: string) => {
    dispatch(deleteCategory(id))
    toast.success('Category deleted successfully!')
  }

  const handleEdit = (id: string, title: string) => {
    setCategoryId(id)
    setIsEdit(!isEdited)
    console.log('is edited:', isEdited)
    setCategoryTitle(title)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newCategoryTitle = event.target.value
    setCategoryTitle(newCategoryTitle)

    if (newCategoryTitle.trim() === '') {
      setCategoryNameError('Category name is required')
    } else {
      setCategoryNameError('')
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (categoryTitle.trim() === '') {
      setCategoryNameError('Category name is required')
      return
    }
    if (!isEdited) {
      // const newCategory = { id: new Date().getTime(), name: categoryName }
      dispatch(createCategory(categoryTitle))
      toast.success('Category is created successfully!')
    } else {
      // const updateCategoryData = { id: categoryId, name: categoryTitle }
      dispatch(updateCategory({ _id: categoryId, title: categoryTitle }))
      toast.success('Category updated successfully!')
      setIsEdit(!isEdited)
    }

    setCategoryTitle('')
  }

  return (
    <div className="wrapper">
      <AdminSideBar />
      <div className="main-content" style={{ overflowY: 'scroll' }}>
        <h2>Categories</h2>
        <div className="add-form">
          <h3>Add Category</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={categoryTitle}
              onChange={handleChange}
            />
            <button>{isEdited ? 'Update' : 'Create'}</button>
            {categoryNameError && (
              <p className="error-message" style={{ marginLeft: '2%' }}>
                {categoryNameError}
              </p>
            )}
          </form>
        </div>
        <section className="products">
          {categories.length > 0 &&
            categories.map((category) => {
              return (
                <div className="product" key={category._id}>
                  <div className="product-info">
                    <h4>{category.title}</h4>
                    <div className="buttons">
                      <button onClick={() => handleDelete(category._id)}>delete</button>
                      <button
                        onClick={() => {
                          handleEdit(category._id, category.title)
                        }}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
        </section>
      </div>
    </div>
  )
}

export default ManageCategories
