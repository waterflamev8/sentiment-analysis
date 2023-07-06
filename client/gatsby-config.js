/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `client`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [],
  proxy: {
    prefix: '/api',
    url: 'http://localhost:3000'
  }
}
