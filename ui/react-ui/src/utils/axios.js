// https://www.npmjs.com/package/axios

const axios = require('axios').default;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default axios;