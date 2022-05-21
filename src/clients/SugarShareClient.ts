import axios, { AxiosInstance } from 'axios';

import settings from '../settings';
import Auth, { AuthenticationError } from 'libs/auth';
import { Callback } from 'libs/types';

interface PresignedUrlBody {
  filename: string;
  fileType: string;
  fileSizeBytes: number;
}

interface PresignedUrlResponse {
  uuid: string;
  presignedUrl: string;
  shareableLink: string;
}

class SugarShareClient {
  private readonly client: AxiosInstance;
  private readonly auth: Auth;
  private readonly abortController: AbortController;

  constructor() {
    this.abortController = new AbortController();
    this.auth = new Auth();
    this.client = axios.create({
      baseURL: `https://${settings.apiDomainName}`,
      signal: this.abortController.signal,
    });
  }

  /**
   * Initiate upload by fetching a presigned S3 PUT URL
   */
  private async getPresignedUrl(file: File): Promise<PresignedUrlResponse> {
    const body: PresignedUrlBody = {
      filename: file.name,
      fileType: file.type,
      fileSizeBytes: file.size,
    };

    let authorizationToken = '';
    try {
      await this.auth.load();
      authorizationToken = await this.auth.getAuthorizationToken();
    } catch (error) {
      if (error instanceof AuthenticationError && error.message.match(/Cannot find tokens in storage/i)) {
        // Skip and a 401 will be returned from the API and displayed
      } else {
        throw error;
      }
    }

    return (await this.client.post(
      '/init',
      body,
      {
        headers: {
          ...(authorizationToken.length && { Authorization: `Bearer ${authorizationToken}` }),
        },
      },
    )).data;
  }

  /**
   * PUT file into bucket using a presigned URL
   */
  private async putFile(file: File, presignedUrl: PresignedUrlResponse['presignedUrl'], handleProgress: Callback<number>) {
    await this.client.put(presignedUrl, file, {
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded * 100) / event.total);
        handleProgress(progress);
      },
      headers: {
        'Content-Type': file.type,
        'x-amz-meta-filename': file.name,
        'x-amz-meta-username': this.auth.email,
      },
    });
  }

  /**
   * Upload file and return a shareable link
   */
  public async upload(file: File, handleProgress: Callback<number>): Promise<string> {
    const { presignedUrl, shareableLink } = await this.getPresignedUrl(file);
    await this.putFile(file, presignedUrl, handleProgress);

    if (shareableLink) {
      return shareableLink;
    }

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

const SugarShare = new SugarShareClient();

export default SugarShare;
