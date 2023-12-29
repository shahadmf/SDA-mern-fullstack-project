import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../redux/store'
import ShoppingCart from './ShoppingCart'
import '../styles/NavBar.scss'
import { signOutUsers } from '../redux/slices/users/userSlice'

const NavBar = () => {
  const { isSignedin, userData } = useSelector((state: RootState) => state.users)
  const { cartItems } = useSelector((state: RootState) => state.cart)

  const dispatch: AppDispatch = useDispatch()

  const handleSignout = () => {
    console.log('I am here')
    dispatch(signOutUsers())
  }

  return (
    <nav>
      <div className="logo">
        <h2>Electro Shop</h2>
      </div>
      <div className="nav-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isSignedin && (
            <>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>

              <li>
                <Link to="/SignUp">Sign Up</Link>
              </li>
            </>
          )}

          {isSignedin && (
            <>
              <li>
                <Link to="/signout" onClick={handleSignout}>
                  Sign Out
                </Link>
              </li>
              {userData?.isAdmin == true && (
                <li>
                  <Link to={`/dashboard/${userData?.isAdmin ? 'admin' : 'user'}`}>Dashboard</Link>
                </li>
              )}
              {userData?.isAdmin == false && (
                <>
                  <li>
                    <Link to={`/dashboard/${userData?.isAdmin ? 'admin' : 'user'}`}>Profile</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/user/cart">
                      <ShoppingCart value={cartItems.length > 0 ? cartItems.length : 0} />
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
