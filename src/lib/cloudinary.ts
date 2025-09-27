import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File, folder: string = 'team-logos'): Promise<string> {
  try {
    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set different transformations based on folder
    const transformations = folder === 'player-photos'
      ? [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' }
        ]
      : [
          { width: 200, height: 200, crop: 'fill' },
          { quality: 'auto' }
        ];

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `volleyball-tournament/${folder}`,
          transformation: transformations
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export default cloudinary;