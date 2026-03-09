import React, { useMemo } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import {
  useLoaderData,
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

function Seller() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const sellers = useMemo(() => {
    return data?.data?.sellers || []
  }, [data])

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

        <div className="sticky top-0 z-10 bg-gray-100 pb-3 mb-4 border-b">
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Seller Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            View all registered sellers
          </p>
        </div>

        <div className="md:hidden bg-white rounded-xl shadow divide-y">
          {sellers.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No sellers found
            </p>
          )}

          {sellers.map((seller) => (
            <Link
              key={seller._id}
              to={`/seller/${seller._id}`}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {seller.brandName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {seller.email}
                  </p>

                  <p className="text-xs text-gray-400 capitalize">
                    {seller.sellerType}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium ${
                    seller.isVerified
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {seller.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden md:block bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-4 py-3">Seller ID</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {sellers.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-400"
                    >
                      No sellers found
                    </td>
                  </tr>
                )}

                {sellers.map((seller) => (
                  <tr
                    key={seller._id}
                    className="border-t text-sm hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono text-blue-600">
                      <Link
                        to={`/seller/${seller._id}`}
                        className="hover:underline"
                      >
                        {seller._id}
                      </Link>
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {seller.brandName}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {seller.email}
                    </td>

                    <td className="px-4 py-3">
                      {seller.phoneNumber}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      {seller.sellerType}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          seller.isVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {seller.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

export default Seller
