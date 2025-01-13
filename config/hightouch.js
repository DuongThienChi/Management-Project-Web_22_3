const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const url = process.env.HIGHTOUCH_URL;
const api_key = process.env.HIGHTOUCH_KEY;

async function syncDataByHighTouch() {
    try {
        const response = await axios.post(
            url,
            {}, // Add payload if required
            {
                headers: {
                    Authorization: "Bearer " + api_key,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = { syncDataByHighTouch };
