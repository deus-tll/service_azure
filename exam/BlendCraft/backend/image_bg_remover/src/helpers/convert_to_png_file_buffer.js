import axios from 'axios';
import sharp from 'sharp';


const convertToPngFileBuffer = async (photoFrontUrlNoBg) => {
  try {
    const response = await axios({
      method: 'get',
      url: photoFrontUrlNoBg,
      responseType: 'arraybuffer'
    });

    return await sharp(response.data).png().toBuffer();
  }
  catch (error) {
    console.error("Error converting photo from url to file.", error);
  }
}

export default convertToPngFileBuffer;