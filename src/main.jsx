import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./components/pages/dashboard/Dashboard.jsx";
import Seller from "./components/pages/seller/Seller.jsx";
import Consumer from "./components/pages/consumer/Consumer.jsx";
import Order from "./components/pages/order/Order.jsx";
import Settings from "./components/pages/settings/Settings.jsx";
import Product from "./components/pages/product/Product.jsx";
import {
  Sellerloader,
  getSellerById,
} from "./components/pages/seller/sellerLoader.js";
import SellerPage from "./components/pages/seller/SellerPage.jsx";
import { ConsumerLoader } from "./components/pages/consumer/consumerLoader.js";
import ConsumerPage from "./components/pages/consumer/ConsumerPage.jsx";
import { getConsumerById } from "./components/pages/consumer/consumerLoader.js";
import { productLoader } from "./components/pages/product/productsLoader.js";
import { ordersLoader } from "./components/pages/order/orderLoader.js";
import OrderPage from "./components/pages/order/OrderPage.jsx";
import { getOrderById } from "./components/pages/order/orderLoader.js";
import AdminLogin from "./components/pages/login/Login.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import AllCategories from "./components/pages/category/AllCategory.jsx";
import { withAuth } from "./utils/withAuth";
import AddCategory from "./components/pages/category/AddCategories.jsx";
import EditCategory from "./components/pages/category/EditCategory.jsx";

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* public routes */}
      <Route path="login" element={<AdminLogin />} />

      {/* authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} loader={withAuth()} />

        <Route
          path="consumer"
          element={<Consumer />}
          loader={withAuth(ConsumerLoader)}
        />

        <Route
          path="consumer/:id"
          element={<ConsumerPage />}
          loader={withAuth(getConsumerById)}
        />
        
        <Route
          path="categories"
          element={<AllCategories />}
        />
        <Route
          path="categories/add"
          element={<AddCategory />}
        />
        <Route 
          path="categories/edit/:id"
          element={<EditCategory />}
        />

        <Route
          path="order"
          element={<Order />}
          loader={withAuth(ordersLoader)}
        />

        <Route
          path="order/:id"
          element={<OrderPage />}
          loader={withAuth(getOrderById)}
        />

        <Route path="settings" element={<Settings />} loader={withAuth()} />

        <Route
          path="seller"
          element={<Seller />}
          loader={withAuth(Sellerloader)}
        />

        <Route
          path="seller/:id"
          element={<SellerPage />}
          loader={withAuth(getSellerById)}
        />

        <Route
          path="product"
          element={<Product />}
          loader={withAuth(productLoader)}
        />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider
      router={route}
      hydrateFallbackElement={<div>Loading...</div>}
    />
  </StrictMode>
);
