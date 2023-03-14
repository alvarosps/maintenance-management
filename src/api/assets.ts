import axios from 'axios';
import { Asset } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getAssets = async (): Promise<Asset[]> => {
    const response = await axios.get(`${API_URL}/assets`);
    return response.data;
};

export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
    const response = await axios.post(`${API_URL}/assets`, asset);
    return response.data;
};

export const updateAsset = async (id: number, asset: Partial<Asset>): Promise<Asset> => {
    const response = await axios.put(`${API_URL}/assets/${id}`, asset);
    return response.data;
};

export const deleteAsset = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/assets/${id}`);
};
