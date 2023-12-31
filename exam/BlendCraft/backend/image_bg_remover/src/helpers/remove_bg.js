import axios from 'axios';


const { API_REMOVE_BG_TOKEN } = process.env;
const apiUrl = 'https://api.ximilar.com/removebg/fast/removebg';


const removeBackground = async (imageUrl) => {
  try {
    const requestData = {
      records: [
        {
          _url: imageUrl,
          binary_mask: false,
          white_background: false
        }
      ]
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${API_REMOVE_BG_TOKEN}`
    };

    const response = await axios.post(apiUrl, requestData, { headers });
    return response.data.records;
  }
  catch (error) {
    console.error('Error occurred in removeBG API:', error.message);
    throw error;
  }
};

export default removeBackground;