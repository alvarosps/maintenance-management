import React from 'react';
import { Card } from 'antd';
import './DataCard.scss';

interface DataCardProps<T> {
    data: T;
    titleKey: keyof T;
    renderContent: (data: T) => React.ReactNode;
}

const DataCard = <T,>(props: DataCardProps<T>) => {
    const { data, titleKey, renderContent } = props;

    return <Card title={String(data[titleKey])}>{renderContent(data)}</Card>;
};

export default DataCard;
