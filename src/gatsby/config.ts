// Fix import order later
export default {
  siteMetadata: {
    title: `Click Entregas`,
    description: `Venda seus produtos online`,
    author: `MarcosDiniz`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-use-query-params`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-antd`,
    `gatsby-plugin-linaria`,
    {
      resolve: `gatsby-plugin-polyfill-io`,
      options: {
        features: [`IntersectionObserver`],
      },
    },
  ],
}
