const axios = require('axios')
const logger = require('../utils/logger')
const IP = require('ip')

const getLocation = async (req,res,next) => {
    
    const IPAddress = IP.address();
    // QUERY IPAPI WITH IP FOR LOCATION DETAILS USING AXIOS
    const apiResponse = await axios.get(`https://ipapi.co/${IPAddress}/json/`)
    
    const location = apiResponse.data.country
    // ADD LOCATION TO REQ OBJECT
    req.location = location
    next()
}

module.exports = { getLocation }