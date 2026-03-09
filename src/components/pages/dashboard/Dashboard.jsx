import React from 'react'
import Sidebar from '../../sidebar/Sidebar'

function Dashboard() {
  return (
    <>
    <div className='flex'>
        <Sidebar/>
        <div className='flex-1 bg-gray-200 m-4 p-4 h-128'>
            <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
            <p>Welcome to the dashboard! Here you can manage your application.</p>
        </div>
    </div>
    </>
  )
}

export default Dashboard