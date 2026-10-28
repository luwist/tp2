import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { parse } from 'node:path';

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  upload(file: Express.Multer.File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'images',
          public_id: parse(file.originalname).name,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(new Error('No se pudo subir la foto a Cloudinary'));
          } else if (!result?.secure_url) {
            reject(new Error('Cloudinary no devolvió la URL de la foto'));
          } else {
            resolve(result.secure_url);
          }
        },
      );

      stream.on('error', () => {
        reject(new Error('No se pudo enviar la foto a Cloudinary'));
      });

      stream.end(file.buffer);
    });
  }
}
