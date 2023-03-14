import React from 'react';
import { Company, Unit, User } from '../../types';
import { Form, Input, Modal, Select } from 'antd';
import { useRecoilValue } from 'recoil';
import { companyListState, unitListState } from '../../recoil/atoms';

const { Option } = Select;

interface BaseCreateDataModalProps {
    visible: boolean;
    onCancel: () => void;
  }
  
  interface CreateCompanyModalProps extends BaseCreateDataModalProps {
    dataType: 'company';
    onSave: (data: Company) => void;
  }
  
  interface CreateUnitModalProps extends BaseCreateDataModalProps {
    dataType: 'unit';
    onSave: (data: Unit) => void;
  }
  
  interface CreateUserModalProps extends BaseCreateDataModalProps {
    dataType: 'user';
    onSave: (data: User) => void;
  }
  
  type CreateDataModalProps = CreateCompanyModalProps | CreateUnitModalProps | CreateUserModalProps;
  

const CreateDataModal: React.FC<CreateDataModalProps> = (props: CreateDataModalProps) => {
    const { dataType, visible, onCancel, onSave } = props;
    const [form] = Form.useForm();
    const companies = useRecoilValue(companyListState);
    const units = useRecoilValue(unitListState);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            let newData: Company | Unit | User;
    
            if (dataType === 'company') {
                newData = { id: 0, name: values.name } as Company;
                onSave(newData as Company);
            } else if (dataType === 'unit') {
                newData = { id: 0, name: values.name, companyId: values.companyId } as Unit;
                onSave(newData as Unit);
            } else if (dataType === 'user') {
                newData = {
                    id: 0,
                    name: values.name,
                    companyId: values.companyId,
                    unitId: values.unitId,
                    email: values.email,
                } as User;
                onSave(newData as User);
            } else {
                throw new Error('Invalid data type');
            }
    
            form.resetFields();
        });
    };
    

    return (
        <Modal open={visible} title={`Create new ${dataType}`} onCancel={onCancel} onOk={handleSubmit} okText="Save">
            <Form form={form} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input a name' }]}>
                    <Input />
                </Form.Item>
                {(dataType === 'unit' || dataType === 'user') && (
                    <Form.Item label="Company ID" name="companyId" rules={[{ required: true, message: 'Please select a company' }]}>
                        <Select>
                            {companies.map((company) => (
                                <Option key={company.id} value={company.id}>
                                    {company.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
                {dataType === 'user' && (
                    <>
                        <Form.Item label="Unit ID" name="unitId" rules={[{ required: true, message: 'Please select a unit' }]}>
                            <Select>
                                {units.map((unit) => (
                                    <Option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input a email' }]}>
                            <Input type='email' />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    )
}

export default React.memo(CreateDataModal);