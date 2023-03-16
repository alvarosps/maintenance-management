import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Company, Unit, User } from '../../types';
import CreateDataModal from './CreateDataModal';

beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
});

describe('CreateDataModal', () => {
    const renderCreateDataModal = (
        dataType: 'company' | 'unit' | 'user',
        onSave: (data: Company | Unit | User) => void,
        visible = true,
    ) => {
        return render(
            <RecoilRoot>
                <CreateDataModal dataType={dataType} visible={visible} onCancel={() => {}} onSave={onSave} />
            </RecoilRoot>,
        );
    };

    test('calls onSave with the new company when clicking save button', async () => {
        const mockOnSave = jest.fn();
        const { getByText, getByLabelText } = renderCreateDataModal('company', mockOnSave);

        fireEvent.input(getByLabelText('Name'), { target: { value: 'New Company' } });

        fireEvent.click(getByText('Save'));

        await waitFor(() => expect(mockOnSave).toHaveBeenCalledTimes(1));
        const expectedCompany: Partial<Company> = {
            name: 'New Company',
        };
        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining(expectedCompany));
    });

    test('calls onCancel when clicking cancel button', () => {
        const mockOnCancel = jest.fn();
        const { getByText } = render(
            <RecoilRoot>
                <CreateDataModal dataType="unit" visible onCancel={mockOnCancel} onSave={() => {}} />
            </RecoilRoot>,
        );

        fireEvent.click(getByText('Cancel'));

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
