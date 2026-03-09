export const ordersLoader = async({ request }) => {
    const url = new URL(request.url)

    const page = url.searchParams.get("page") || 1;
    const limit = url.searchParams.get("limit") || 20;
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");

    if (type) {
        if (status) {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/order?type=${type}&status=${status}&page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Failed to load orders");
            }
            return response.json();
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/order?type=${type}&page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Failed to load orders");
        }
        return response.json();
    }


    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/order?page=${page}&limit=${limit}`);
    if (!response.ok) {
        throw new Error("Failed to load orders");
    }   
    return response.json();
}

export const getOrderById = async ({ params }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/order/${params.id}`);
    if (!response.ok) {
        throw new Error("Failed to load order details");
    }
    return response.json();
}



