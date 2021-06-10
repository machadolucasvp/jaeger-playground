const axios = require('axios')

const { API_SERVICE_B, API_SERVICE_C } = process.env

const apiServiceB = axios.create({
    baseURL: API_SERVICE_B,
    timeout: 5000
})

const apiServiceC = axios.create({
    baseURL: API_SERVICE_C,
    timeout: 5000
})

module.exports = { apiServiceB, apiServiceC }