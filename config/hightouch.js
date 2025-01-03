const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const url = process.env.HIGHTOUCH_URL;
const api_key = process.env.HIGHTOUCH_KEY;

async function syncDataByHighTouch(){
    try {
        const response = await axios.post(
            url,
            {}, // Add payload if required
            {
                headers: {
                    Authorization: 'Bearer' + api_key,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Sync triggered successfully:', response.data);
        return response.data; // Return response for use elsewhere    
    } catch (error) {
        console.error('Error triggering sync:', error.response?.data || error.message);
        throw error; // Rethrow the error for further handling
    }
}

module.exports = { syncDataByHighTouch };