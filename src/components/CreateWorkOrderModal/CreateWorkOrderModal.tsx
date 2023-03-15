import React from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { WorkOrder } from '../../types';
import { useRecoilValue } from 'recoil';
import { assetListState, userListState } from '../../recoil/atoms';

const { Option } = Select;

interface CreateWorkOrderModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (data: WorkOrder) => void;
}

const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({ visible, onCancel, onSave }) => {
    const [form] = Form.useForm();
    const assets = useRecoilValue(assetListState);
    const users = useRecoilValue(userListState);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const newWorkOrder: WorkOrder = {
                id: 0,
                title: values.title,
                description: values.description,
                status: values.status,
                priority: values.priority,
                assignedUserIds: values.assignedUserIds,
                assetId: values.assetId,
                checklist: values.checklist,
            };

            onSave(newWorkOrder);
            form.resetFields();
        });
    };

    return (
        <Modal open={visible} title="Create new work order" onCancel={onCancel} onOk={handleSubmit} okText="Save">
            <Form form={form} layout="vertical" data-testid="create-work-order-form">
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input a title' }]}>
                    <Input data-testid="title" />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input a description' }]}
                >
                    <Input.TextArea data-testid="description" />
                </Form.Item>
                <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a status' }]}>
                    <Select data-testid="status">
                        <Option value="completed" data-testid="completed">
                            Completed
                        </Option>
                        <Option value="in_progress" data-testid="inProgress">
                            In Progress
                        </Option>
                        <Option value="pending" data-testid="pending">
                            Pending
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[{ required: true, message: 'Please select a priority' }]}
                >
                    <Select data-testid="priority">
                        <Option value="low" data-testid="low">
                            Low
                        </Option>
                        <Option value="medium" data-testid="medium">
                            Medium
                        </Option>
                        <Option value="high" data-testid="high">
                            High
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Assigned Users"
                    name="assignedUserIds"
                    rules={[{ required: true, message: 'Please select at least one user' }]}
                >
                    <Select mode="multiple" data-testid="assignedUsers">
                        {users.map((user) => (
                            <Option key={user.id} value={user.id} data-testid={`user-${user.id}`}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Asset ID"
                    name="assetId"
                    rules={[{ required: true, message: 'Please select an asset' }]}
                >
                    <Select data-testid="assetId">
                        {assets.map((asset) => (
                            <Option key={asset.id} value={asset.id} data-testid={`asset-${asset.id}`}>
                                {asset.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.List name="checklist">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item key={field.key}>
                                    <Form.Item
                                        {...field}
                                        label={`Task ${index + 1}`}
                                        name={[field.name, 'task']}
                                        rules={[{ required: true, message: 'Please input a task name' }]}
                                    >
                                        <Input data-testid="taskName" />
                                    </Form.Item>
                                    <Form.Item name={[field.name, 'completed']} valuePropName="checked">
                                        <Checkbox data-testid="taskCompleted">Completed</Checkbox>
                                    </Form.Item>
                                    <Button type="link" onClick={() => remove(field.name)} data-testid="removeTask">
                                        Remove
                                    </Button>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block data-testid="addTask">
                                    Add Task
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default React.memo(CreateWorkOrderModal);
