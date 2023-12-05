import axios from 'axios';
import sharp from 'sharp';


export async function convertToFile(photoFrontUrlNoBg, fileName, type) {
  try {
    const response = await axios({
      method: 'get',
      url: photoFrontUrlNoBg,
      responseType: 'arraybuffer'
    });

    const buffer = await sharp(response.data).toBuffer();
    return new File([buffer], `${fileName}.${type}`, { type: `image/${type}` });
  }
  catch (error) {
    console.error("Error converting photo from url to file.");
  }
}