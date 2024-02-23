import {v2 as cloudinary} from 'cloudinary';
import { load } from 'ts-dotenv';

const cloudEnv = load({
    CLOUDINARY_API_SECRET: String
});
          
cloudinary.config({ 
    cloud_name: 'passy', 
    api_key: '342671617396113', 
    api_secret: cloudEnv.CLOUDINARY_API_SECRET,
    secure: true
});