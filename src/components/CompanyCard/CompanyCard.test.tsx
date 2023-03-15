import { render, fireEvent, waitFor } from '@testing-library/react';
import CompanyCard from './CompanyCard';
import { Company } from '../../types';
import { RecoilRoot } from 'recoil';

const mockCompany: Company = {
    id: 1,
    name: 'Test Company',
};

const onUpdate = jest.fn();
const onDelete = jest.fn();

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

describe('CompanyCard', () => {
    afterEach(() => {
        onUpdate.mockClear();
        onDelete.mockClear();
    });

    const renderCompanyCard = (company: Company) =>
        render(
            <RecoilRoot>
                <CompanyCard company={company} onUpdate={onUpdate} onDelete={onDelete} />
            </RecoilRoot>,
        );

    test('renders company data', () => {
        const { getByText, container } = renderCompanyCard(mockCompany);
        expect(getByText('Name:')).toBeInTheDocument();
        const companyNameSpan = container.querySelector('.card-data span');
        expect(companyNameSpan).toHaveTextContent('Test Company');
    });

    test('edits company data', async () => {
        const { getByText, getByDisplayValue } = renderCompanyCard(mockCompany);

        fireEvent.click(getByText('Edit'));
        const input = getByDisplayValue('Test Company');
        fireEvent.change(input, { target: { value: 'Updated Company' } });
        fireEvent.click(getByText('Save'));

        await waitFor(() => expect(onUpdate).toHaveBeenCalledTimes(1));
        expect(onUpdate).toHaveBeenCalledWith({ ...mockCompany, name: 'Updated Company' });
    });

    test('cancels edit without saving', () => {
        const { getByText, getByDisplayValue } = renderCompanyCard(mockCompany);

        fireEvent.click(getByText('Edit'));
        const input = getByDisplayValue('Test Company');
        fireEvent.change(input, { target: { value: 'Updated Company' } });
        fireEvent.click(getByText('Cancel'));

        expect(onUpdate).toHaveBeenCalledTimes(0);
    });

    test('deletes company data', async () => {
        const { getByText } = renderCompanyCard(mockCompany);

        fireEvent.click(getByText('Edit'));
        fireEvent.click(getByText('Delete'));

        await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
        expect(onDelete).toHaveBeenCalledWith(mockCompany);
    });
});
