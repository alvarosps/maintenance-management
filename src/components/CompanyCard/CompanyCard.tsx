import React, { useState } from 'react';
import { Company } from '../../types';
import { Button, Form, Input } from 'antd';
import DataCard from '../DataCard/DataCard';
import { DeleteOutlined } from '@ant-design/icons';

interface CompanyCardProps {
    company: Company;
    onUpdate: (data: Company) => void;
    onDelete: (data: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onUpdate, onDelete }) => {
    const [form] = Form.useForm();
    const [editable, setEditable] = useState(false);

    const handleSave = () => {
        form.validateFields().then((values) => {
            const updatedCompany: Company = {
                ...company,
                name: values.name,
            };

            onUpdate(updatedCompany);
            setEditable(false);
        });
    };

    const handleDelete = () => {
        onDelete(company);
        setEditable(false);
    };

    return (
        <DataCard
            data={company}
            titleKey="name"
            renderContent={(company: Company) => (
                <div className="card-data">
                    {!editable && (
                        <span>
                            <strong>Name:</strong> {company.name}
                        </span>
                    )}
                    {editable && (
                        <Form form={form} initialValues={{ name: company.name }}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input a name' }]}
                            >
                                <Input />
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

export default React.memo(CompanyCard);
