import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from '../../types';
import { Button, Form, Modal } from 'antd';
import EditableField from '../EditableField/EditableField';

type AssetModalProps = {
    visible: boolean;
    asset: Asset | undefined;
    onCancel: () => void;
    onSave: (asset: Asset) => void;
};

const AssetModal: React.FC<AssetModalProps> = (props: AssetModalProps) => {
    const { visible, asset, onCancel, onSave } = props;

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

    return (
        <>
            {asset && (
                <Modal open={visible} title="Asset Details" onCancel={onCancel} footer={null}>
                    <Form layout="vertical">
                        <Form.Item label="Name">{asset.name}</Form.Item>
                        <Form.Item label="Status">
                            <EditableField
                                field="status"
                                value={status}
                                editing={editing}
                                onChange={(value) => setStatus(value)}
                                options={assetOptions}
                            />
                        </Form.Item>
                        <Form.Item label="Health Score">{asset.healthscore}</Form.Item>
                        <Form.Item label="Assigned Users">{asset.assignedUserIds.join(', ')}</Form.Item>
                        <Form.Item label="Health History">
                            <ul>
                                {asset.healthHistory.map((historyItem) => (
                                    <li key={historyItem.timestamp}>
                                        {new Date(historyItem.timestamp).toDateString()} - {historyItem.status}
                                    </li>
                                ))}
                            </ul>
                        </Form.Item>
                    </Form>
                    {editing ? (
                        <div>
                            <Button type="primary" onClick={handleSave}>
                                Save
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button type="primary" onClick={() => setEditing(true)}>
                            Edit
                        </Button>
                    )}
                </Modal>
            )}
        </>
    );
};

export default React.memo(AssetModal);
