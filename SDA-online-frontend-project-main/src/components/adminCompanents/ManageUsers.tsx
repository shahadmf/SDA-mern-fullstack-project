import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  banUser,
  deleteUser,
  fetchUsers,
  unbanUser,
  updateUserRole
} from '../../redux/slices/users/userSlice'
import { AppDispatch, RootState } from '../../redux/store'
import AdminSideBar from '../../pages/admin/AdminSideBar'

const ManageUsers = () => {
  const dispatch: AppDispatch = useDispatch()
  const { users, error } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  if (error) {
    return <div>{error}</div>
  }
  const handleBan = (id: string, isBanned: boolean) => {
    try {
      isBanned ? dispatch(unbanUser(id)) : dispatch(banUser(id))
    } catch (error) {
      console.log(error)
    }
  }
  const handleDelete = (id: string) => {
    dispatch(deleteUser(id))
  }

  const handleChangeRole = (id: string) => {
    dispatch(updateUserRole(id))
    dispatch(fetchUsers())
  }

  return (
    <div className="wrapper">
      <AdminSideBar />
      <div className="main-content">
        <h2>Users</h2>
        <section className="products">
          {users.length > 0 &&
            users.map((user) => {
              if (!user.isAdmin) {
                return (
                  <div className="product" key={user._id}>
                    <div className="product-info">
                      <img
                        src={user.image}
                        alt={user.firstName}
                        style={{ width: '50px', height: '50px' }}
                      />
                      <p>
                        <span>Name:</span> {user.firstName} {user.lastName}
                      </p>
                      <p>
                        <span>Email:</span> {user.email}
                      </p>
                      <p>
                        <span>Phone:</span> {user.phone}
                      </p>
                      <div className="buttons">
                        <button onClick={() => handleBan(user._id, user.isBanned)}>
                          {user.isBanned ? 'unban' : 'ban'}
                        </button>
                        <button onClick={() => handleDelete(user._id)}>delete</button>
                        <button onClick={() => handleChangeRole(user._id)}>Change to Admin</button>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
        </section>
      </div>
    </div>
  )
}

export default ManageUsers
