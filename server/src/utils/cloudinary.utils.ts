import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

@Injectable()
export class CloudinaryUtils {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  getStorage() {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'recipes',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => file.originalname,
      } as any, // Type assertion to bypass the folder property issue
    });
  }

  async deleteImage(imageUrl: string) {
    try {
      // Extract public_id from Cloudinary URL
      const publicId = this.extractPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      const segments = url.split('/');
      const lastSegment = segments[segments.length - 1];
      return lastSegment.split('.')[0]; // Remove file extension
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
}