import { useRecoilState, useRecoilValue } from 'recoil';
import { assetListState } from '../atoms';
import { fetchAssetList } from '../selectors';
import { useMemo } from 'react';

export const useAssetList = () => {
    const assetList = useRecoilValue(fetchAssetList);

    return assetList;
};

export const useAssetById = (id: number) => {
    const assetList = useAssetList();

    const asset = useMemo(() => {
        return assetList.find((asset) => asset.id === id);
    }, [assetList, id]);

    return asset;
};
