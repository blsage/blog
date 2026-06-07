import createMDX from "@next/mdx";

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: false,
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      ["rehype-pretty-code", { theme: "github-light", keepBackground: false }],
    ],
  },
});

export default withMDX(nextConfig);
