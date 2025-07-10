import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage, Params } from 'multer-storage-cloudinary';
import { Request } from 'express';

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
      cloudinary,
      params: {
        folder: 'recipes',
        format: () => 'png', // no need for async here
        public_id: (_req: Request, file: Express.Multer.File): string => {
          return file.originalname.split('.')[0]; // safer access
        },
      } as Params,
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
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
      return lastSegment.split('.')[0];
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
}
