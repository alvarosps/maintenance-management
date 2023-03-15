import { atom } from 'recoil';
import { Asset, Company, Unit, User, WorkOrder } from '../../types';

export const pageTitleState = atom<string>({
    key: 'pageTitleState',
    default: 'Maintenance Management',
});

export const assetListState = atom<Asset[]>({
    key: 'assetList',
    default: [],
});

export const userListState = atom<User[]>({
    key: 'userList',
    default: [],
});

export const unitListState = atom<Unit[]>({
    key: 'unitList',
    default: [],
});

export const companyListState = atom<Company[]>({
    key: 'companyList',
    default: [],
});

export const workOrderListState = atom<WorkOrder[]>({
    key: 'workOrderList',
    default: [],
});
