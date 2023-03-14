import React, { useCallback } from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

interface Options {
    text: string;
    value: string;
}

type EditableFieldProps = {
    field: string;
    value: string;
    editing: boolean;
    onChange: (value: string) => void;
    options: Options[];
};

const EditableField: React.FC<EditableFieldProps> = (props: EditableFieldProps) => {
    const { field, value, editing, onChange, options } = props;

    const handleFieldChange = useCallback((value: string) => {
        onChange(value);
    }, []);

    return editing ? (
        field === 'status' ? (
            <Select value={value} onChange={handleFieldChange}>
                {options.map((option, index) => (
                    <Option key={`option-${index}`} value={option.value}>
                        {option.text}
                    </Option>
                ))}
            </Select>
        ) : (
            <Input value={value} onChange={(e) => handleFieldChange(e.target.value)} />
        )
    ) : (
        <span>{value}</span>
    );
};

export default React.memo(EditableField);
