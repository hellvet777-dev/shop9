const axios = require('axios');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const api = axios.create({
  baseURL: process.env.BASE_URL,
});

const woo = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: 'wc/v3',
});

/* 
api.interceptors.request.use(
  async (config) => {
    config.headers = await getHeaders(config);
    return config;
  },

  (error) => Promise.reject(error)
);
*/

module.exports = { api, woo };
