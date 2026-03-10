/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A key NUNCA vai pro bundle do cliente - fica so no servidor
  serverRuntimeConfig: {
    googlePlacesKey: process.env.GOOGLE_PLACES_API_KEY,
  },
}
module.exports = nextConfig
