// Supressing deprecation warnings because API data has duplicate keys
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Company } from '../../types';
import CompanyManagement from './CompanyManagement';
import { companyListState, pageTitleState } from '../../recoil/atoms';
import { getCompanies, createCompany, updateCompany } from '../../api/companies';

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

jest.mock('../../api/companies', () => ({
    getCompanies: jest.fn(),
    createCompany: jest.fn(),
    updateCompany: jest.fn(),
}));

const mockCompanies: Company[] = [
    {
        id: 1,
        name: 'Company A',
    },
    {
        id: 2,
        name: 'Company B',
    },
];

describe('CompanyManagement', () => {
    const renderCompanyManagement = () => {
        return render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(companyListState, mockCompanies);
                    set(pageTitleState, 'Company Management');
                }}
            >
                <CompanyManagement />
            </RecoilRoot>,
        );
    };

    beforeEach(() => {
        (getCompanies as jest.Mock).mockResolvedValue(mockCompanies);
        (createCompany as jest.Mock).mockResolvedValue({ id: 3, name: 'New Company' });
        (updateCompany as jest.Mock).mockResolvedValue({ id: 3, name: 'Updated Company' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders company cards for existing companies', () => {
        const { getAllByText } = renderCompanyManagement();

        expect(getAllByText('Company A').length).toBeGreaterThan(0);
        expect(getAllByText('Company B').length).toBeGreaterThan(0);
    });

    it('opens and closes the create company modal', async () => {
        const { getByText, queryByRole } = renderCompanyManagement();

        fireEvent.click(getByText('Create User'));
        expect(getByText('Create new company')).toBeInTheDocument();

        fireEvent.click(getByText('Cancel'));
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('creates, updates a company', async () => {
        const { getByText, getAllByText, getByLabelText, findAllByText } = renderCompanyManagement();

        // Create a company
        fireEvent.click(getByText('Create User'));
        fireEvent.input(getByLabelText('Name'), { target: { value: 'New Company' } });
        fireEvent.click(getByText('Save'));

        await waitFor(async () => {
            const newCompanies = await findAllByText('New Company');
            expect(newCompanies.length).toBeGreaterThan(0);
        });

        // Update the company
        const editButtons = getAllByText('Edit');
        fireEvent.click(editButtons[0]);
        fireEvent.input(getByLabelText('Name'), { target: { value: 'Updated Company' } });
        const saveButtons = getAllByText('Save');
        fireEvent.click(saveButtons[0]);

        await waitFor(async () => {
            const updatedCompanies = await findAllByText('Updated Company');
            expect(updatedCompanies.length).toBeGreaterThan(0);
        });
    });
});
