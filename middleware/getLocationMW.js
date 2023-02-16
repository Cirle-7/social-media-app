const axios = require('axios')
const logger = require('../utils/logger')
const IP = require('ip')

const getLocation = async (req,res,next) => {
    // GET REQ IP FROM EITHER HEADER OR SOCKET
    // const ipAddress = req.header('x-forwarded-for')??req.socket.remoteAddress
    // logger.info(`here's the request ip address: ${ipAddress}`)
    // req.ipAddress = ipAddress
    // const ipAddress = IP.address()
    const IPAddress = IP.address();
    // logger.info(`here's the request IPAddress: ${IPAddress}`)
    // QUERY IPAPI WITH IP FOR LOCATION DETAILS USING AXIOS
    const apiResponse = await axios.get(`https://ipapi.co/${IPAddress}/json/`)
    // LOCATION DETAILS FROM RESPONSE
    // const locationDeets = {
    //     ip: apiResponse.data.ip,
    //     city: apiResponse.data.city,
    //     country: apiResponse.data.country
    // }
    const location = apiResponse.data.country
    // ADD LOCATION TO REQ OBJECT
    req.location = location
    next()
}

module.exports = { getLocation }