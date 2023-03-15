import React, { useState } from 'react';
import { Unit } from '../../types';
import { Button, Form, Input, Select } from 'antd';
import DataCard from '../DataCard/DataCard';
import { DeleteOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import { companyListState } from '../../recoil/atoms';

const { Option } = Select;

interface UnitCardProps {
    unit: Unit;
    onUpdate: (data: Unit) => void;
    onDelete: (data: Unit) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, onUpdate, onDelete }) => {
    const [form] = Form.useForm();
    const [editable, setEditable] = useState(false);
    const companies = useRecoilValue(companyListState);

    const handleSave = () => {
        form.validateFields().then((values) => {
            const updatedUnit: Unit = {
                ...unit,
                name: values.name,
                companyId: values.companyId,
            };

            onUpdate(updatedUnit);
            setEditable(false);
        });
    };

    const handleDelete = () => {
        onDelete(unit);
        setEditable(false);
    };

    return (
        <DataCard
            data={unit}
            titleKey="name"
            renderContent={(unit: Unit) => (
                <div className="card-data">
                    {!editable && (
                        <>
                            <div>
                                <strong>Name:</strong> {unit.name}
                            </div>
                            <div>
                                <strong>Company:</strong>{' '}
                                {companies.find((company) => company.id === unit.companyId)?.name}
                            </div>
                        </>
                    )}
                    {editable && (
                        <Form form={form} initialValues={{ name: unit.name, companyId: unit.companyId }}>
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

export default React.memo(UnitCard);
