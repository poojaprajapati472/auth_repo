// axios-manager.ts
import axios, { AxiosInstance } from 'axios';

export class AxiosManager {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
  async get(url: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
  }
  async post(url: string, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to post data to ${url}`);
    }
  }
  async patch(url: string, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.patch(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to patch data to ${url}`);
    }
  }
}
