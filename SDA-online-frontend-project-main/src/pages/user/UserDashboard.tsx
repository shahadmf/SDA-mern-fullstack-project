import { IoIosClose } from 'react-icons/io'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../../redux/store'
import { fetchUsers, updateUserProfile } from '../../redux/slices/users/userSlice'
import '../../styles/Dashboard.scss'
import '../../styles/Profile.scss'

// type UserEditType = {
//   firstName: string
//   lastName: string
//   email: string
//   image: File | undefined | string
//   phone: string
//   address: string
// }

const UserDashboard = () => {
  const { userData } = useSelector((state: RootState) => state.users)

  const dispatch: AppDispatch = useDispatch()

  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  const [user, setUser] = useState({
    _id: userData?._id,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    address: userData?.address
  })
  // const [user, setUser] = useState<UserEditType>({
  //   firstName: userData?.firstName || '',
  //   lastName: userData?.lastName || '',
  //   email: userData?.email || '',
  //   image: undefined,
  //   phone: userData?.phone || '',
  //   address: userData?.address || ''
  // })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target
    // if (type === 'file') {
    //   const fileInput = (event.target as HTMLInputElement) || ''
    //   const file = fileInput.files?.[0]
    //   setUser((prevUsers) => {
    //     return { ...prevUsers, [name]: file }
    //   })
    // } else {
    setUser((prevUser) => {
      return { ...prevUser, [name]: value }
    })
    // }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // try {
    //   if (!user.firstName || !user.lastName) {
    //     alert('Both fields are required')
    //     return
    //   }

    //   if (user.firstName.length < 2 || user.lastName.length < 2) {
    //     alert('First and Last name must be at least 2 characters long')
    //     return
    //   }
    //   const editUserData = new FormData()

    //   editUserData.append('firstName', user.firstName)
    //   editUserData.append('email', user.email)
    //   editUserData.append('image', user.image as unknown as Blob)
    //   editUserData.append('phone', user.phone)
    //   editUserData.append('address', user.address)

    //   if (userData && userData._id) {
    //     dispatch(updateUserProfile({ updatedUser: editUserData, id: userData._id }))
    //     toast('Updated successfully')
    //   }
    // } catch (error) {
    //   toast.error(`Something went wrong: ${error.toString()}`)
    // }

    // _id: user._id,
    // firtName: user.firstName,
    // lastName: user.lastName,
    // address: user.address
    const editUserData = { ...user, _id: userData?._id }
    // It's updating only in the backend
    dispatch(updateUserProfile(editUserData))
    setIsFormOpen(false)
  }

  const handleFormOpen = () => {
    setIsFormOpen(!isFormOpen)
  }
  return (
    <div className="profile-wrapper">
      <h2>Profile</h2>
      <div className="container">
        {userData && (
          <div>
            <div key={userData._id} className="user-info">
              <div className="user-image">
                <img src={userData.image} alt={user.firstName} />
              </div>
              <div className="user-data">
                <p>
                  <span>First name:</span> {userData.firstName}
                </p>
                <p>
                  <span>Last name:</span> {userData.lastName}
                </p>
                <p>
                  <span>Email:</span> {userData.email}
                </p>
                <p>
                  <span>Phone:</span> {userData.phone}
                </p>
                <p>
                  <span>Adress:</span> {userData.address}
                </p>
              </div>
            </div>
            <button className="btn" onClick={handleFormOpen}>
              {isFormOpen ? <IoIosClose /> : 'Edit'}
            </button>

            <div className="edit-form">
              {isFormOpen && (
                <form onSubmit={handleSubmit}>
                  <div className="first-name">
                    <label htmlFor="firstName">First Name: </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="last-name">
                    <label htmlFor="lastName">Last Name: </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="image">
                    <label htmlFor="image">Image: </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      // value={user.image}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="address">
                    <label htmlFor="address">Address: </label>
                    <textarea
                      name="address"
                      id="address"
                      value={userData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <button className="btn" type="submit">
                    Save
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
