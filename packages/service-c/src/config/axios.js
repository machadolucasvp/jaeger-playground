const axios = require('axios')

const { API_SERVICE_D } = process.env

const apiServiceD = axios.create({
    baseURL: API_SERVICE_D,
    timeout: 5000
})

module.exports = { apiServiceD }