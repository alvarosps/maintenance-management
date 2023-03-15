import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from '../../types';
import { Button, Form, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import EditableField from '../EditableField/EditableField';
import './AssetModal.scss';
import { useRecoilValue } from 'recoil';
import { companyListState, unitListState, userListState } from '../../recoil/atoms';

export type AssetModalProps = {
    visible: boolean;
    asset: Asset | undefined;
    onCancel: () => void;
    onSave: (asset: Asset) => void;
    onDelete: (assetToDelete: Asset) => void;
};

const AssetModal: React.FC<AssetModalProps> = (props: AssetModalProps) => {
    const { visible, asset, onCancel, onSave, onDelete } = props;

    const users = useRecoilValue(userListState);
    const companies = useRecoilValue(companyListState);
    const units = useRecoilValue(unitListState);

    const assetOptions = [
        { value: 'inOperation', text: 'In Operation' },
        { value: 'inDowntime', text: 'In Downtime' },
        { value: 'inAlert', text: 'In Alert' },
        { value: 'unplannedStop', text: 'Unplanned Stop' },
        { value: 'plannedStop', text: 'Planned Stop' },
    ];

    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (asset) setStatus(asset.status);
    }, [asset]);

    const handleSave = useCallback(() => {
        if (asset) {
            onSave({
                ...asset,
                status,
                healthHistory: [...asset.healthHistory, { status, timestamp: new Date().toISOString() }],
                // should have some calculation to change the healtscore attribute
            });
        }
        setEditing(false);
    }, [onSave, asset, status]);

    const handleDelete = useCallback(() => {
        if (asset) onDelete(asset);
    }, [asset]);

    const showUserNames = useCallback(() => {
        if (asset) {
            const userNames = users
                .filter((user) => {
                    if (user.id in asset.assignedUserIds) return true;
                    else return false;
                })
                .map((user) => user.name);
            return userNames.join(', ');
        }
        return '';
    }, [asset]);

    const showCompanyName = useCallback(() => {
        if (asset) {
            const company = companies.find((company) => company.id === asset.companyId);
            return company?.name;
        }
        return '';
    }, [asset]);

    const showUnitsNames = useCallback(() => {
        if (asset) {
            const unit = units.find((unit) => unit.id === asset.unitId);
            return unit?.name;
        }
        return '';
    }, [asset]);

    return (
        <>
            {asset && (
                <Modal open={visible} title="Asset Details" onCancel={onCancel} footer={null}>
                    <Form layout="vertical">
                        <Form.Item label="Name:">{asset.name}</Form.Item>
                        <Form.Item label="Status:">
                            <EditableField
                                field="status"
                                value={status}
                                editing={editing}
                                onChange={(value) => setStatus(value)}
                                options={assetOptions}
                            />
                        </Form.Item>
                        <Form.Item label="Health Score:">{asset.healthscore}</Form.Item>
                        <Form.Item label="Assigned Users:">{showUserNames()}</Form.Item>
                        <Form.Item label="Company:">{showCompanyName()}</Form.Item>
                        <Form.Item label="Sensors:">{asset.sensors.join(', ')}</Form.Item>
                        {Object.keys(asset.specifications).length > 0 && (
                            <Form.Item label="Specifications:">
                                <ul>
                                    {asset.specifications.maxTemp !== undefined && (
                                        <li>Max Temp: {asset.specifications.maxTemp}</li>
                                    )}
                                    {asset.specifications.power !== undefined && (
                                        <li>Power: {asset.specifications.power}</li>
                                    )}
                                    {asset.specifications.rpm !== undefined && <li>RPM: {asset.specifications.rpm}</li>}
                                </ul>
                            </Form.Item>
                        )}
                        <Form.Item label="Units:">{showUnitsNames()}</Form.Item>
                        <Form.Item label="Health History:">
                            <ul>
                                {asset.healthHistory.map((historyItem) => (
                                    <li key={historyItem.timestamp}>
                                        {new Date(historyItem.timestamp).toDateString()} - {historyItem.status}
                                    </li>
                                ))}
                            </ul>
                        </Form.Item>
                    </Form>
                    <div className="modal-buttons">
                        {editing ? (
                            <>
                                <Button type="primary" onClick={handleSave}>
                                    Save
                                </Button>
                                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                                    Delete
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => setEditing(true)}>
                                Update Status
                            </Button>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default React.memo(AssetModal);
