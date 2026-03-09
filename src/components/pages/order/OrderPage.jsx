import React, { useMemo, useState } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import { useLoaderData } from 'react-router-dom'

function OrderPage() {
  const loaderData = useLoaderData()

  const initialOrder = useMemo(() => {
    return loaderData?.data || null
  }, [loaderData])

  const [order, setOrder] = useState(initialOrder)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading order details...
      </div>
    )
  }

  const {
    _id,
    consumer,
    seller,
    items = [],
    totalAmount,
    orderType,
    OrderStatus,
    createdAt,
  } = order

  const updateOrderStatus = async (newStatus) => {
    setIsUpdating(true)
    setError(null)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/update-status/${_id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!res.ok) {
        throw new Error('Failed to update order status')
      }

      // Optimistic UI update
      setOrder((prev) => ({
        ...prev,
        OrderStatus: newStatus,
      }))
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    )
    if (confirmCancel) {
      updateOrderStatus('Cancelled')
    }
  }

  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="md:ml-64 p-4 md:p-6 space-y-4">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-3 border-b">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Order Details
          </h1>
          <p className="text-sm text-gray-600">
            View and manage order information
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 space-y-3">
          <p className="text-xs text-gray-500 font-mono">
            Order ID: {_id}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <p><b>Order Type:</b> {orderType}</p>

            <div className="flex items-center gap-2">
              <b>Status:</b>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusStyles[OrderStatus] || 'bg-gray-200 text-gray-700'
                }`}
              >
                {OrderStatus}
              </span>
            </div>

            <p><b>Total:</b> ₹{totalAmount}</p>
            <p>
              <b>Date:</b>{' '}
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : '—'}
            </p>
          </div>
        </div>

        {/* Consumer & Seller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-1">Consumer</h3>
            <p>{consumer?.displayName || '—'}</p>
            <p className="text-sm text-gray-500">{consumer?.email}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h3 className="font-semibold mb-1">Seller</h3>
            <p>{seller?.brandName || '—'}</p>
            <p className="text-sm text-gray-500">{seller?.email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <h3 className="font-semibold mb-3">Order Items</h3>

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">
                      {item.product?.productName || '—'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-wrap gap-3">
          <button
            disabled={OrderStatus === 'Shipped' || OrderStatus === 'Cancelled' || isUpdating}
            onClick={() => updateOrderStatus('Shipped')}
            className="px-5 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Mark Shipped
          </button>

          <button
            disabled={OrderStatus === 'Cancelled' || isUpdating}
            onClick={handleCancel}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Cancel Order
          </button>

          {isUpdating && (
            <span className="text-sm text-gray-500 self-center">
              Updating...
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

      </div>
    </div>
  )
}

export default OrderPage
