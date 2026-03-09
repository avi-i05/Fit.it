import React from 'react'
import { useContext } from 'react'
import Orders from './Order/Order'
import DashboardLayout from './dashboard/DashboardLayout'
import AuthContext from '../../../context/Auth/authcontext'

function PartnerOrder() {
  const {user} = useContext(AuthContext)
  // console.log(user)
  return (
    <>
      <DashboardLayout>
        <Orders sellerId={user._id}/>
      </DashboardLayout>
    </>
  )
}

export default PartnerOrder