import axios from 'axios';
import { Unit } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getUnits = async (): Promise<Unit[]> => {
    const response = await axios.get(`${API_URL}/units`);
    return response.data;
};

export const createUnit = async (unit: Omit<Unit, 'id'>): Promise<Unit> => {
    const response = await axios.post(`${API_URL}/units`, unit);
    return response.data;
};

export const updateUnit = async (id: number, unit: Partial<Unit>): Promise<Unit> => {
    const response = await axios.put(`${API_URL}/units/${id}`, unit);
    return response.data;
};

export const deleteUnit = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/units/${id}`);
};
