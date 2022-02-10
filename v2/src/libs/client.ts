import axios, { AxiosInstance } from 'axios';
import { PresignedUrlBody, PresignedUrlResponse, Callback } from './types';

export default class APIClient {
  private readonly client: AxiosInstance;
  private readonly abortController: AbortController;

  constructor() {
    this.abortController = new AbortController();
    this.client = axios.create({
      baseURL: 'https://api.sugarshare.me',
      signal: this.abortController.signal,
    });
  }

  /**
   * Initiate upload by fetching a presigned S3 PUT URL
   */
  private async getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
    const body: PresignedUrlBody = {
      title: file.name,
      fileType: file.type,
      sizeBytes: file.size,
      // sizeBytes: 10000000000,
    };

    // TODO: Error handling https://axios-http.com/docs/handling_errors
    return (await this.client.post('/init', body)).data;
  }

  /**
   * PUT file into bucket using a presigned URL
   */
  private async putFile(file: File, presignedUrl: PresignedUrlResponse['presignedUrl'], handleProgress: Callback<number>) {
    // TODO: Error handling https://axios-http.com/docs/handling_errors

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

  /**
   * Upload file and return a shareable link
   */
  public async upload(file: File, handleProgress: Callback<number>): Promise<string> {
    const { presignedUrl } = await this.getPresignedUrl(file);
    await this.putFile(file, presignedUrl, handleProgress);

    const url = new URL(presignedUrl);
    return `${url.hostname}${url.pathname}`;
  }

  /**
   * Cancel all HTTP(s) requests performed by the client
   */
  public cancel(): void {
    this.abortController.abort();
  }
}
