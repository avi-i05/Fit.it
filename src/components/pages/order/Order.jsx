import React, { useMemo } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import {
  useLoaderData,
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

function Orders() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // console.log('Orders loader data:', data)

  const orders = useMemo(() => {
    return data?.data?.data || []
  }, [data])
  // console.log(orders);
  

  const pagination = useMemo(() => {
    return data?.data?.pagination || {}
  }, [data])

  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const limit = pagination.limit || 10

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage)
    params.set('limit', limit)
    navigate(`?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="md:ml-64 p-4 md:p-6">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-3 mb-4 border-b">
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Order Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            View and track all orders
          </p>
        </div>

        {/* mobile table */}
        <div className="md:hidden bg-white rounded-xl shadow divide-y">
          {orders.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No orders found
            </p>
          )}

          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">
                  ₹{order.totalAmount}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {order.orderType} • {order.OrderStatus}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="text-xs text-blue-600 font-medium">
                View
              </span>
            </Link>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Consumer</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">
                      No orders found
                    </td>
                  </tr>
                )}

                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t text-sm hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono text-blue-600">
                      <Link to={`/order/${order._id}`}>
                        {order._id}
                      </Link>
                    </td>

                    <td className="px-4 py-3">
                      {order.consumer?.displayName || '—'}
                    </td>

                    <td className="px-4 py-3">
                      {order.seller?.brandName || '—'}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      {order.orderType}
                    </td>

                    <td className="px-4 py-3">
                      ₹{order.totalAmount}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.OrderStatus === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.OrderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.OrderStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t px-4 py-3 flex justify-between items-center text-sm">
            <p className="text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Orders
