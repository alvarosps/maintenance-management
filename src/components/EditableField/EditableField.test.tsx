import { render, fireEvent, waitFor } from '@testing-library/react';
import EditableField, { Options, EditableFieldProps } from './EditableField';

const options: Options[] = [
    { text: 'Option 1', value: 'option1' },
    { text: 'Option 2', value: 'option2' },
];

describe('EditableField', () => {
    const renderEditableField = (props: Partial<EditableFieldProps> = {}) => {
        const defaultProps: EditableFieldProps = {
            field: 'name',
            value: 'Test Value',
            editing: false,
            onChange: jest.fn(),
            options,
            ...props,
        };

        return render(<EditableField {...defaultProps} />);
    };

    test('renders non-editing mode correctly', () => {
        const { getByText } = renderEditableField();

        expect(getByText('Test Value')).toBeInTheDocument();
    });

    test('renders Input when in editing mode and field is not status', () => {
        const { getByDisplayValue } = renderEditableField({ editing: true });

        expect(getByDisplayValue('Test Value')).toBeInTheDocument();
    });

    test('renders Select when in editing mode and field is status', () => {
        const { getByRole } = renderEditableField({ editing: true, field: 'status' });

        expect(getByRole('combobox')).toBeInTheDocument();
    });

    test('calls onChange when input value changes', () => {
        const onChange = jest.fn();
        const { getByDisplayValue } = renderEditableField({ editing: true, onChange });

        fireEvent.change(getByDisplayValue('Test Value'), { target: { value: 'New Value' } });

        expect(onChange).toHaveBeenCalledWith('New Value');
    });

    it('calls onChange when a Select option is chosen', async () => {
        const onChange = jest.fn();
        const { getByRole, getByText } = render(
            <EditableField field="status" value="option1" editing={true} onChange={onChange} options={options} />,
        );

        fireEvent.mouseDown(getByRole('combobox')); // Open the Select dropdown
        const option2Element = getByText('Option 2');
        fireEvent.click(option2Element); // Select the Option 2

        // Wait for the onChange function to be called
        await waitFor(() => expect(onChange).toHaveBeenCalledWith('option2'));
    });
});
