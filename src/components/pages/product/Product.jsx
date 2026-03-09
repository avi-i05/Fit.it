import React, { useMemo } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import {
  useLoaderData,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

function Product() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const products = useMemo(() => {
    return data?.data?.items || []
  }, [data])

  const pagination = useMemo(() => {
    return data?.data?.pagination || {}
  }, [data])

  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const limit = pagination.limit || 20

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
        <div className="sticky top-0 z-10 bg-gray-100 pb-3 mb-4 border-b">
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Product Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            View and monitor all products listed by sellers
          </p>
        </div>

        {/* mobile table */}
        <div className="md:hidden bg-white rounded-xl shadow divide-y">
          {products.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No products found
            </p>
          )}

          {products.map((product) => {
            const totalStock = product.variants?.reduce(
              (sum, v) => sum + v.stock,
              0
            )
            const isActive = product.variants?.some(v => v.isActive)

            return (
              <div
                key={product._id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {product.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Variants: {product.variants?.length || 0} • Stock: {totalStock}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            )
          })}
        </div>

          {/* desktop table */}
        <div className="hidden md:block bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-4 py-3">Product ID</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Variants</th>
                  <th className="px-4 py-3">Total Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-400"
                    >
                      No products found
                    </td>
                  </tr>
                )}

                {products.map((product) => {
                  const totalStock = product.variants?.reduce(
                    (sum, v) => sum + v.stock,
                    0
                  )
                  const isActive = product.variants?.some(v => v.isActive)

                  return (
                    <tr
                      key={product._id}
                      className="border-t text-sm hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">
                        {product._id}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {product.productName}
                      </td>

                      <td className="px-4 py-3">
                        {product.variants?.length || 0}
                      </td>

                      <td className="px-4 py-3">
                        {totalStock}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* pagination */}
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

export default Product
