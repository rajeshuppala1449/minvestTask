const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "cpnb841r01qtggbb21egcpnb841r01qtggbb21f0";
const finnhubClient = new finnhub.DefaultApi();

export default finnhubClient;

