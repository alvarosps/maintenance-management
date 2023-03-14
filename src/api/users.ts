import axios from 'axios';
import { User } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${id}`, user);
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
};
