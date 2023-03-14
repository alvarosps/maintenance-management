import axios from 'axios';
import { Asset } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getAssets = async (): Promise<Asset[]> => {
    const response = await axios.get<Asset[]>(`${API_URL}/assets`);

    return response.data;
};

// export const getCompanies = async () => {
//   const { companies } = await getApiResponse();
//   return companies;
// };

// export const getUsers = async () => {
//   const { users } = await getApiResponse();
//   return users;
// };

// export const getCompanyById = async (companyId: number) => {
//   const { companies } = await getApiResponse();
//   return companies.find((company) => company.id === companyId);
// };

// export const getUserById = async (userId: number) => {
//   const { users } = await getApiResponse();
//   return users.find((user) => user.id === userId);
// };
