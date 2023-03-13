import axios from 'axios';
import { ApiResponse } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getApiResponse = async (): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(`${API_URL}/db`);
  return response.data;
};

export const getCompanies = async () => {
  const { companies } = await getApiResponse();
  return companies;
};

export const getUsers = async () => {
  const { users } = await getApiResponse();
  return users;
};

export const getCompanyById = async (companyId: number) => {
  const { companies } = await getApiResponse();
  return companies.find((company) => company.id === companyId);
};

export const getUserById = async (userId: number) => {
  const { users } = await getApiResponse();
  return users.find((user) => user.id === userId);
};
