import React, { useMemo } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import {
  useLoaderData,
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

function Consumer() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const consumers = useMemo(() => {
    return data?.data?.data || []
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
      {/* Sidebar (mobile header + desktop sidebar handled internally) */}
      <Sidebar />

      {/* ================= CONTENT ================= */}
      <div className="md:ml-64 p-4 md:p-6">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-3 mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Consumer Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            View all registered consumers
          </p>
        </div>

        {/* ================= MOBILE LIST ================= */}
        <div className="md:hidden bg-white rounded-xl shadow divide-y">
          {consumers.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No consumers found
            </p>
          )}

          {consumers.map((consumer) => (
            <div
              key={consumer._id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {consumer.displayName}
                </p>
                <p className="text-xs text-gray-500">
                  {consumer.email}
                </p>
              </div>

              <Link
                to={`/consumer/${consumer._id}`}
                className="text-xs text-blue-600 font-medium"
              >
                View
              </Link>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Consumer ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>

            <tbody>
              {consumers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-400"
                  >
                    No consumers found
                  </td>
                </tr>
              )}

              {consumers.map((consumer) => (
                <tr
                  key={consumer._id}
                  className="border-t text-sm hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-blue-600">
                    <Link
                      to={`/consumer/${consumer._id}`}
                      className="hover:underline"
                    >
                      {consumer._id}
                    </Link>
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {consumer.displayName}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {consumer.email}
                  </td>

                  <td className="px-4 py-3">
                    {consumer.phoneNumber}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {consumer.gender}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {consumer.createdAt
                      ? new Date(consumer.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center mt-4 text-sm">
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
  )
}

export default Consumer
