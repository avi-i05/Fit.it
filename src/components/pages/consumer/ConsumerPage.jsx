import React, { useMemo } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import { useLoaderData } from 'react-router-dom'

function ConsumerPage() {
  const data = useLoaderData()

  // Memoized consumer
  const consumer = useMemo(() => {
    return data?.data || {}
  }, [data])

  const {
    displayName,
    email,
    phoneNumber,
    gender,
    createdAt,
  } = consumer

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar (mobile + desktop handled internally) */}
      <Sidebar />

      {/* ================= CONTENT ================= */}
      <div className="md:ml-64 p-4 md:p-6">

        {/* Header (standard admin header) */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-3 mb-4 border-b">
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Consumer Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Consumer details, order history, and analytics
          </p>
        </div>

        {/* ================= CONSUMER OVERVIEW ================= */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
            {displayName?.[0] || 'C'}
          </div>

          <div>
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">
              {email}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Joined on{' '}
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : '—'}
            </p>
          </div>
        </div>

        {/* ================= INFO + ANALYTICS ================= */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Basic Information
            </h3>

            <div className="space-y-2 text-sm">
              <p><b>Full Name:</b> {displayName}</p>
              <p><b>Email:</b> {email}</p>
              <p><b>Phone:</b> {phoneNumber}</p>
              <p className="capitalize">
                <b>Gender:</b> {gender}
              </p>
            </div>
          </div>

          {/* Analytics Summary (Future Data) */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Analytics Summary
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-gray-800">
                  0
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">
                  Total Spent
                </p>
                <p className="text-xl font-bold text-gray-800">
                  ₹0
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                <p className="text-xs text-gray-500">
                  Last Order
                </p>
                <p className="text-sm text-gray-800">
                  No orders yet
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              (Data will appear once orders are integrated)
            </p>
          </div>

        </div>

        {/* ================= ORDERS (FUTURE) ================= */}
        <div className="mt-4 bg-white rounded-xl shadow p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-3">
            Orders
          </h3>

          <div className="text-sm text-gray-400 text-center py-8">
            Order list will appear here once implemented
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="mt-4 bg-white rounded-xl shadow p-4 md:p-6 flex flex-col sm:flex-row gap-3">
          <button className="w-full sm:w-auto px-5 py-2 border rounded-lg hover:bg-gray-100">
            View Orders
          </button>

          <button className="w-full sm:w-auto px-5 py-2 bg-red-600 text-white rounded-lg">
            Block Consumer
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConsumerPage
