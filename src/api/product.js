import api from "./axios";

export const getProducts = (sellerId, page = 1, limit = 9) => {
  return api.get(
    `/api/v1/products/seller-products/${sellerId}?page=${page}&limit=${limit}`
  );
};

export const getProduct = (productId) => {
  return api.get(`/api/v1/products/product/${productId}`);
};


export const createProduct = (data) => {
  return api.post("/api/v1/products/register/single", data);
}

export const updateProduct = (productId, data) => {
  return api.patch(`/api/v1/products/update/full-product/${productId}`, data,
    {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  );
}