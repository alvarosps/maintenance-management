import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useRecoilValue } from 'recoil';
import { Asset } from '../../types';
import { companyListState, unitListState, userListState } from '../../recoil/atoms';

const { Option } = Select;

type CreateAssetModalProps = {
    visible: boolean;
    onCancel: () => void;
    onSave: (asset: Asset) => void;
};

const assetOptions = [
    { value: 'inOperation', text: 'In Operation' },
    { value: 'inDowntime', text: 'In Downtime' },
    { value: 'inAlert', text: 'In Alert' },
    { value: 'unplannedStop', text: 'Unplanned Stop' },
    { value: 'plannedStop', text: 'Planned Stop' },
];

const CreateAssetModal: React.FC<CreateAssetModalProps> = (props: CreateAssetModalProps) => {
    const { visible, onSave, onCancel } = props;
    const [form] = Form.useForm();
    const users = useRecoilValue(userListState);
    const companies = useRecoilValue(companyListState);
    const units = useRecoilValue(unitListState);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const newAsset: Asset = {
                ...values,
                sensors: values.sensors.split(','),
                healthHistory: [
                    {
                        status: values.status,
                        timestamp: new Date().toISOString(),
                    },
                ],
            };
            onSave(newAsset);
            form.resetFields();
        });
    };

    return (
        <Modal open={visible} title="Create Asset" onCancel={onCancel} onOk={handleSubmit} okText="Save">
            <Form form={form} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Assigned User IDs"
                    name="assignedUserIds"
                    rules={[{ required: true, message: 'Please select user(s)' }]}
                >
                    <Select mode="multiple">
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Company ID"
                    name="companyId"
                    rules={[{ required: true, message: 'Please select a company' }]}
                >
                    <Select>
                        {companies.map((company) => (
                            <Option key={company.id} value={company.id}>
                                {company.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Health Score"
                    name="healthscore"
                    rules={[{ required: true, message: 'Please input a health score' }]}
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a status' }]}>
                    <Select>
                        {assetOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.text}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Unit ID" name="unitId" rules={[{ required: true, message: 'Please select a unit' }]}>
                    <Select>
                        {units.map((unit) => (
                            <Option key={unit.id} value={unit.id}>
                                {unit.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Sensors" name="sensors">
                    <Input placeholder="Enter sensor IDs separated by commas" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default React.memo(CreateAssetModal);
