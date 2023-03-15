import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import UnitCard from './UnitCard';
import { Unit, Company } from '../../types';
import { companyListState } from '../../recoil/atoms';

const mockUnit: Unit = {
    id: 1,
    name: 'Unit 1',
    companyId: 1,
};

const mockCompanies: Company[] = [
    { id: 1, name: 'Company 1' },
    { id: 2, name: 'Company 2' },
];

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

describe('UnitCard', () => {
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    const renderUnitCard = (unit: Unit) =>
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(companyListState, mockCompanies);
                }}
            >
                <UnitCard unit={unit} onUpdate={onUpdate} onDelete={onDelete} />
            </RecoilRoot>,
        );

    test('renders unit data', () => {
        const { container } = renderUnitCard(mockUnit);

        const nameDiv = container.querySelector('div.card-data > div:nth-child(1)');
        const companyDiv = container.querySelector('div.card-data > div:nth-child(2)');

        expect(nameDiv).toHaveTextContent('Name: Unit 1');
        expect(companyDiv).toHaveTextContent('Company: Company 1');
    });

    test('enters edit mode when the Edit button is clicked', () => {
        const { getByText, getByRole } = renderUnitCard(mockUnit);

        fireEvent.click(getByText('Edit'));

        expect(getByRole('textbox')).toBeInTheDocument();
        expect(getByRole('combobox')).toBeInTheDocument();
    });

    test('calls onUpdate when Save button is clicked', async () => {
        const { getByText, getByRole } = renderUnitCard(mockUnit);

        fireEvent.click(getByText('Edit'));
        fireEvent.change(getByRole('textbox'), { target: { value: 'New Unit Name' } });
        fireEvent.click(getByText('Save'));

        await waitFor(() =>
            expect(onUpdate).toHaveBeenCalledWith({
                ...mockUnit,
                name: 'New Unit Name',
            }),
        );
    });

    test('calls onDelete when Delete button is clicked', () => {
        const { getByText } = renderUnitCard(mockUnit);

        fireEvent.click(getByText('Edit'));
        fireEvent.click(getByText('Delete'));

        expect(onDelete).toHaveBeenCalledWith(mockUnit);
    });

    test('exits edit mode when Cancel button is clicked', () => {
        const { getByText, container } = renderUnitCard(mockUnit);

        fireEvent.click(getByText('Edit'));
        fireEvent.click(getByText('Cancel'));

        const nameDiv = container.querySelector('div.card-data > div:nth-child(1)');
        const companyDiv = container.querySelector('div.card-data > div:nth-child(2)');

        expect(nameDiv).toHaveTextContent('Name: Unit 1');
        expect(companyDiv).toHaveTextContent('Company: Company 1');
    });
});
