import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {

  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.royalcanin-weshare-online.io",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
