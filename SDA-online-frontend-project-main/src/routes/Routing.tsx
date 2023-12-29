import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Cart from '../pages/user/Cart'
import UserRouting from './UserRouting'
import AdminRouting from './AdminRouting'
import NavBar from '../components/NavBar'
import Products from '../components/product/Products'
import UserDashboard from '../pages/user/UserDashboard'
import ManageOrders from '../components/adminCompanents/ManageOrders'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageCategories from '../components/adminCompanents/ManageCategories'
import ManageUsers from '../components/adminCompanents/ManageUsers'
import ProductDetails from '../components/product/ProductDetails'
import ManageProducts from '../components/adminCompanents/ManageProducts'
import ActivatePage from '../pages/ActivatePage'
import ForgetPassword from '../pages/ForgetPassword'
import ResetPassword from '../pages/ResetPassword'

const Routing = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn pathName={''} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<Home />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="users/reset-password/:token" element={<ResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="users/activate/:token" element={<ActivatePage />} />

        <Route path="dashboard" element={<UserRouting />}>
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/cart" element={<Cart />} />
        </Route>

        <Route path="dashboard" element={<AdminRouting />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/category" element={<ManageCategories />} />
          <Route path="admin/users" element={<ManageUsers />} />
          <Route path="admin/products" element={<ManageProducts />} />
          <Route path="admin/orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
