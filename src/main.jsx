import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

// Pages
import Layout from './Layout.jsx'
import Home from './Components/Home/Home.jsx'
import NewOrder from './Components/NewOrders/NewOrders.jsx'
import OrderCompletion from './Components/OrderCompletion/OrderCompletion.jsx'
import OrderStatus from './Components/OrderStatus/OrderStatus.jsx'
import PolicySupport from './Components/PolicySupport/PolicySupport.jsx'
import Profile from './Components/Profile/Profile.jsx'
import StockedPage from './Components/StockedPage/StockedPage.jsx'
import StockForm from './Components/StockForm/StockForm.jsx'

// Router setup
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path="NewOrders" element={<NewOrder />} />
      <Route path="OrderCompletion" element={<OrderCompletion />} />
      <Route path="OrderStatus" element={<OrderStatus />} />
      <Route path="PolicySupport" element={<PolicySupport />} />
      <Route path="Profile" element={<Profile />} />
      <Route path="StockedPage" element={<StockedPage />} />
      <Route path="StockForm" element={<StockForm />} /> 
    </Route>
  )
)

// Render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
