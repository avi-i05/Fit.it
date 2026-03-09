export const ConsumerLoader = async ({ request }) => {
  const url = new URL(request.url);

  const page =url.searchParams.get('page') || 1;
  const limit = url.searchParams.get('limit') || 20;

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/consumers/all-consumers?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to load consumers");
  }

  return response.json();
};
export const getConsumerById = async ({ params }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/consumers/consumer/${params.id}`);
  if (!response.ok) {
    throw new Error("Failed to load consumer details");
  }

  return response.json();
};
