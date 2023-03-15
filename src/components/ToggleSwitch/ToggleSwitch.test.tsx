import { render, fireEvent } from '@testing-library/react';
import ToggleSwitch, { ToggleSwitchProps } from './ToggleSwitch';

describe('ToggleSwitch', () => {
    const handleChange = jest.fn();

    const renderToggleSwitch = (props: Partial<ToggleSwitchProps> = {}) => {
        const defaultProps: ToggleSwitchProps = {
            checked: false,
            handleChange,
            leftText: 'Off',
            rightText: 'On',
            ...props,
        };

        return render(<ToggleSwitch {...defaultProps} />);
    };

    test('renders the component with given props', () => {
        const { getByText } = renderToggleSwitch({
            leftText: 'Inactive',
            rightText: 'Active',
        });

        expect(getByText('Inactive')).toBeInTheDocument();
        expect(getByText('Active')).toBeInTheDocument();
    });

    test('calls handleChange when the switch is toggled', () => {
        const { getByRole } = renderToggleSwitch();

        fireEvent.click(getByRole('switch'));
        expect(handleChange).toHaveBeenCalled();
    });

    test('renders with the keep-bg-color class when canBeDisabled is false or not provided', () => {
        const { container } = renderToggleSwitch();
        expect(container.querySelector('.keep-bg-color')).toBeInTheDocument();

        const { container: container2 } = renderToggleSwitch({ canBeDisabled: false });
        expect(container2.querySelector('.keep-bg-color')).toBeInTheDocument();
    });

    test('renders without the keep-bg-color class when canBeDisabled is true', () => {
        const { container } = renderToggleSwitch({ canBeDisabled: true });
        expect(container.querySelector('.keep-bg-color')).not.toBeInTheDocument();
    });
});
