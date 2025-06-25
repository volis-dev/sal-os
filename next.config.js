/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable middleware
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable prerendering of error pages to avoid SSR context issues
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true
}

module.exports = nextConfig 