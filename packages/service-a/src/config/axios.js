const axios = require('axios')

const { API_SERVICE_B } = process.env

const apiServiceB = axios.create({
    baseURL: API_SERVICE_B,
    timeout: 5000
})

module.exports = { apiServiceB }