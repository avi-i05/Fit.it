export const Sellerloader = async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;
    const limit = url.searchParams.get("limit") || 10;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/partners/all-sellers?page=${page}&limit=${limit}`);
    if (!response) {
        throw new Error("Failed to load sellers");
    }
    return response.json();
}

export const getSellerById = async ({ params }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/partners/seller/${params.id}`);
    if (!response.ok) {
        throw new Error("Failed to load seller details");
    }
    return response.json();
}
