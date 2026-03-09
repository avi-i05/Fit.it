import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import LandingPage from './components/page/landing/LandingPage.jsx';
import Login from './components/page/login/LoginPage.jsx';
import Register from './components/page/register/RegisterPage.jsx';
import PartnerDashboard from './components/page/partnerDashboard/PartnerDashboard.jsx';
import ProtectedRoute from './routes/ProtectedRoutes.jsx';
import PartnerOrders from './components/page/partnerDashboard/PartnerOrder.jsx';
import OrderDetails from './components/page/partnerDashboard/Order/OrderDetails.jsx';
import ProductsPage from './components/page/partnerDashboard/product/ProductsPage.jsx';
import AddProduct from './components/page/partnerDashboard/product/AddProduct.jsx';
import ProductDetails from './components/page/partnerDashboard/product/ProductDetailPage.jsx';
import EditProduct from './components/page/partnerDashboard/product/ProductEdit.jsx';
import PartnerProfile from './components/page/profile/ProfilePage.jsx';

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>} >
      <Route path='' element={<LandingPage/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route path='partner'>
          <Route path='dashboard' element={<PartnerDashboard/>}/>
          <Route path='orders' element={<PartnerOrders/>}/>
          <Route path='orders/:orderId' element={<OrderDetails/>}/>
          <Route path='products' element={<ProductsPage/>}/>
          <Route path='products/:productId' element={<ProductDetails/>}/>
          <Route path='products/new' element={<AddProduct/>}/>
          <Route path='products/edit/:productId' element={<EditProduct/>}/>
          <Route path='profile'element={<PartnerProfile/>}/>
        </Route>
      </Route>
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider 
      router={route}
      hydrateFallbackElement={<div>loading.....</div>}
    />
  </StrictMode>,
)
