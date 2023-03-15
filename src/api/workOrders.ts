import axios from 'axios';
import { WorkOrder } from '../types';

const API_URL = 'https://my-json-server.typicode.com/tractian/fake-api';

export const getWorkOrders = async (): Promise<WorkOrder[]> => {
    const response = await axios.get(`${API_URL}/workorders`);
    return response.data;
};

export const createWorkOrder = async (workOrder: Omit<WorkOrder, 'id'>): Promise<WorkOrder> => {
    const response = await axios.post(`${API_URL}/workorders`, workOrder);
    return response.data;
};

export const updateWorkOrder = async (id: number, workOrder: Partial<WorkOrder>): Promise<WorkOrder> => {
    const response = await axios.put(`${API_URL}/workorders/${id}`, workOrder);
    return response.data;
};

export const deleteWorkOrder = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/workorders/${id}`);
};
