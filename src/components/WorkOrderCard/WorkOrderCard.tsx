import React, { useState, useEffect } from 'react';
import { WorkOrder, ChecklistItem } from '../../types';
import { Button, Form, Input, Select, Checkbox } from 'antd';
import DataCard from '../DataCard/DataCard';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { assetListState, userListState } from '../../recoil/atoms';
import { getAssets } from '../../api/assets';

interface WorkOrderCardProps {
    workOrder: WorkOrder;
    onUpdate: (data: WorkOrder) => void;
    onDelete: (data: WorkOrder) => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onUpdate, onDelete }) => {
    const setAssetList = useSetRecoilState(assetListState);

    useEffect(() => {
        const fetchAssets = async () => {
            const response = await getAssets();
            setAssetList(response);
        };
        fetchAssets();
    }, [setAssetList]);

    const [form] = Form.useForm();
    const [editable, setEditable] = useState(false);
    const assets = useRecoilValue(assetListState);
    const users = useRecoilValue(userListState);
    const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>(workOrder.checklist);

    const handleSave = () => {
        form.validateFields().then((values) => {
            const updatedWorkOrder: WorkOrder = {
                ...workOrder,
                ...values,
                checklist: localChecklist,
            };

            onUpdate(updatedWorkOrder);
            setEditable(false);
        });
    };

    const handleDelete = () => {
        onDelete(workOrder);
        setEditable(false);
    };

    const handleChecklistChange = (index: number, checked: boolean) => {
        const updatedChecklist = localChecklist.map((item, i) => {
            if (i === index) {
                return { ...item, completed: checked };
            }
            return item;
        });
        setLocalChecklist(updatedChecklist);
    };

    const handleDeleteChecklistItem = (index: number) => {
        const updatedChecklist = workOrder.checklist.filter((_, i) => i !== index);
        onUpdate({ ...workOrder, checklist: updatedChecklist });
    };

    const handleAddChecklistItem = () => {
        const newChecklistItem: ChecklistItem = { completed: false, task: '' };
        onUpdate({ ...workOrder, checklist: [...workOrder.checklist, newChecklistItem] });
    };

    return (
        <DataCard
            data={workOrder}
            titleKey="title"
            renderContent={(workOrder: WorkOrder) => (
                <div className="card-data">
                    {!editable && (
                        <div className="work-order-data">
                            <div>
                                <strong>Title:</strong> {workOrder.title}
                            </div>
                            <div>
                                <strong>Description:</strong> {workOrder.description}
                            </div>
                            <div>
                                <strong>Status:</strong> {workOrder.status}
                            </div>
                            <div>
                                <strong>Priority:</strong> {workOrder.priority}
                            </div>
                            <div>
                                <strong>Assigned Users:</strong>{' '}
                                {workOrder.assignedUserIds
                                    .map((id) => {
                                        const user = users.find((u) => u.id === id);
                                        return user ? `${user.name}` : 'User not found';
                                    })
                                    .join(', ')}
                            </div>
                            <div>
                                <strong>Asset ID:</strong>{' '}
                                {assets.find((asset) => asset.id === workOrder.assetId)?.name}
                            </div>
                            <div>
                                <strong>Checklist:</strong>
                                <ul>
                                    {workOrder.checklist.map((item, index) => (
                                        <li key={index}>{item.completed ? <s>{item.task}</s> : item.task}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {editable && (
                        <Form form={form} initialValues={workOrder}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Please input a title' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: 'Please input a description' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true, message: 'Please select a status' }]}
                            >
                                <Select>
                                    <Select.Option value="completed">Completed</Select.Option>
                                    <Select.Option value="in_progress">In Progress</Select.Option>
                                    <Select.Option value="pending">Pending</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Priority"
                                name="priority"
                                rules={[{ required: true, message: 'Please select a priority' }]}
                            >
                                <Select>
                                    <Select.Option value="low">Low</Select.Option>
                                    <Select.Option value="medium">Medium</Select.Option>
                                    <Select.Option value="high">High</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Assigned Users"
                                name="assignedUserIds"
                                rules={[{ required: true, message: 'Please select at least one user' }]}
                            >
                                <Select mode="multiple">
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Asset ID"
                                name="assetId"
                                rules={[{ required: true, message: 'Please select an asset' }]}
                            >
                                <Select>
                                    {assets.map((asset) => (
                                        <Select.Option key={asset.id} value={asset.id}>
                                            {asset.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.List name="checklist">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item key={field.key} label={`Task ${index + 1}`} required={false}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'completed']}
                                                    valuePropName="checked"
                                                    noStyle
                                                >
                                                    <Checkbox
                                                        checked={localChecklist[index]?.completed}
                                                        onChange={(e) => handleChecklistChange(index, e.target.checked)}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'task']}
                                                    rules={[
                                                        { required: true, message: 'Please input a task description' },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input style={{ width: '60%' }} />
                                                </Form.Item>
                                                <Button
                                                    style={{ marginLeft: 8 }}
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteChecklistItem(index)}
                                                />
                                            </Form.Item>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => handleAddChecklistItem()}
                                                icon={<PlusOutlined />}
                                            >
                                                Add Task
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
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

export default React.memo(WorkOrderCard);
