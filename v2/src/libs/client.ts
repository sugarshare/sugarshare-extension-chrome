import axios, { AxiosInstance } from 'axios';
import { PresignedUrlBody, PresignedUrlResponse, ProgressHandler } from './types';

export default class Client {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.sugarshare.me',
    });
  }

  private async getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
    const body: PresignedUrlBody = {
      title: file.name,
      fileType: file.type,
      sizeBytes: file.size,
      // sizeBytes: 10000000000,
    };

    try {
      const result = await this.client.post('/init', body);
      return result.data;
    } catch (error) {
      alert(error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  private async putFile(file: File, presignedUrl: PresignedUrlResponse['presignedUrl'], handleProgress: ProgressHandler) {
    await this.client.put(presignedUrl, file, {
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded * 100) / event.total);
        handleProgress(progress);
      },
      headers: {
        'Content-Type': file.type,
      },
    });
  }

  public async upload(file: File, handleProgress: ProgressHandler) {
    const { presignedUrl } = await this.getPresignedUrl(file);
    await this.putFile(file, presignedUrl, handleProgress);

    // const url = new URL(presignedUrl);
    // alert(`${url.hostname}${url.pathname}`);
  }
}
