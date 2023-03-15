import React, { useState } from 'react';
import { User } from '../../types';
import { Button, Form, Input, Select } from 'antd';
import DataCard from '../DataCard/DataCard';
import { DeleteOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import { companyListState, unitListState } from '../../recoil/atoms';

const { Option } = Select;

interface UserCardProps {
    user: User;
    onUpdate: (data: User) => void;
    onDelete: (data: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onUpdate, onDelete }) => {
    const [form] = Form.useForm();
    const [editable, setEditable] = useState(false);
    const companies = useRecoilValue(companyListState);
    const units = useRecoilValue(unitListState);

    const handleSave = () => {
        form.validateFields().then((values) => {
            const updatedUser: User = {
                ...user,
                name: values.name,
                companyId: values.companyId,
                unitId: values.unitId,
                email: values.email,
            };

            onUpdate(updatedUser);
            setEditable(false);
        });
    };

    const handleDelete = () => {
        onDelete(user);
        setEditable(false);
    };

    return (
        <DataCard
            data={user}
            titleKey="name"
            renderContent={(user: User) => (
                <div className="card-data">
                    {!editable && (
                        <>
                            <div>
                                <strong>Name:</strong> {user.name}
                            </div>
                            <div>
                                <strong>Email:</strong> {user.email}
                            </div>
                            <div>
                                <strong>Company:</strong>{' '}
                                {companies.find((company) => company.id === user.companyId)?.name}
                            </div>
                            <div>
                                <strong>Unit:</strong> {units.find((unit) => unit.id === user.unitId)?.name}
                            </div>
                        </>
                    )}
                    {editable && (
                        <Form
                            form={form}
                            initialValues={{
                                name: user.name,
                                email: user.email,
                                companyId: user.companyId,
                                unitId: user.unitId,
                            }}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input a name' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Company"
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
                                label="Unit"
                                name="unitId"
                                rules={[{ required: true, message: 'Please select a unit' }]}
                            >
                                <Select>
                                    {units.map((unit) => (
                                        <Option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input a valid email' }]}
                            >
                                <Input type="email" />
                            </Form.Item>
                        </Form>
                    )}
                    <div className="card-buttons">
                        {!editable && (
                            <Button type="primary" onClick={() => setEditable(true)}>
                                Edit
                            </Button>
                        )}
                        {editable && (
                            <>
                                <Button type="primary" onClick={handleSave}>
                                    Save
                                </Button>
                                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                                    Delete
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => setEditable(false)}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        />
    );
};

export default React.memo(UserCard);
