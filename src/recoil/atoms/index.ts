import { atom } from 'recoil';
import { Asset } from '../../types';

export const pagetTitleState = atom<string>({
    key: 'pageTitleState',
    default: 'Maintenance Management',
});

export const assetListState = atom<Asset[]>({
    key: 'assetList',
    default: [],
});
