import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminSideBar from '../../pages/admin/AdminSideBar'
import { AppDispatch, RootState } from '../../redux/store'
import { deleteOrder, fetchOrders } from '../../redux/slices/orders/ordersSlice'

const ManageOrders = () => {
  const { orders, error } = useSelector((state: RootState) => state.orders)

  const dispatch: AppDispatch = useDispatch()

  console.log(orders)
  useEffect(() => {
    dispatch(fetchOrders())
  }, [])

  const handleDeleteOrder = (id: string) => {
    dispatch(deleteOrder(id))
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="wrapper">
      <AdminSideBar />
      <div className="main-content" style={{ overflowY: 'scroll' }}>
        <h2>Orders</h2>
        <section className="products">
          {orders &&
            orders.map((order) => {
              const { _id, orderItems, createdAt, status, totalAmount } = order
              return (
                <div className="product" key={_id}>
                  <div className="product-info">
                    <h4> Order Id: {_id} </h4>
                    <p>Products No: {orderItems.length} </p>
                    <p>User Id: {orderItems[0]._id} </p>
                    {/* <p>
                      Products:
                      {orderItems.map((item, index) => (
                        <span key={index}>
                          {item.product}
                          {index < orderItems.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p> */}
                    <p>Status: {status}</p>
                    <p>Total Amount: {totalAmount} SAR</p>
                    <p>Purchase time: {createdAt ? createdAt.toString() : ''} </p>

                    <div className="buttons">
                      <button
                        className="btn"
                        onClick={() => {
                          handleDeleteOrder(_id)
                        }}>
                        Cancel
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

export default ManageOrders
