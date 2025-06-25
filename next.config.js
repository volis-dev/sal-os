/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Add this to force client-side rendering for auth pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig