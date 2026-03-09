export const productLoader = async ({ request }) => {
  const url = new URL(request.url)

  const page = url.searchParams.get('page') || 1
  const limit = url.searchParams.get('limit') || 20

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/products/all?page=${page}&limit=${limit}`
  )

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  return res.json()
}
