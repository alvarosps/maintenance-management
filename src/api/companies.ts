import axios from 'axios';
import { Company } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getCompanies = async (): Promise<Company[]> => {
    const response = await axios.get(`${API_URL}/companies`);
    return response.data;
};

export const createCompany = async (company: Omit<Company, 'id'>): Promise<Company> => {
    const response = await axios.post(`${API_URL}/companies`, company);
    return response.data;
};

export const updateCompany = async (id: number, company: Partial<Company>): Promise<Company> => {
    const response = await axios.put(`${API_URL}/companies/${id}`, company);
    return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/companies/${id}`);
};
