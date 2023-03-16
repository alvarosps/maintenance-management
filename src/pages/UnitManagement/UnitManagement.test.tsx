import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import UnitManagement from './UnitManagement';
import { Unit } from '../../types';
import { getUnits } from '../../api/units';

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

const mockUnits: Unit[] = [
    {
        companyId: 1,
        id: 1,
        name: 'Unit 1',
    },
    {
        companyId: 1,
        id: 2,
        name: 'Unit 2',
    },
];

const mockedErrorGetUnits = jest.fn().mockRejectedValue(new Error('No workorders were found! Maybe create one?'));
const mockedSuccessfulGetUnits = jest.fn().mockResolvedValue(mockUnits);

beforeAll(() => {
    (getUnits as jest.MockedFunction<typeof getUnits>).mockImplementation(mockedSuccessfulGetUnits);
});

afterAll(() => {
    jest.restoreAllMocks();
});

jest.mock('../../api/units', () => ({
    getUnits: jest.fn(),
}));

describe('UnitManagement component', () => {
    test('renders without crashing', () => {
        render(
            <RecoilRoot>
                <UnitManagement />
            </RecoilRoot>,
        );
    });

    test('displays an error message if an error occurs while fetching units', async () => {
        const mockErrorMessage = 'No units were found! Maybe create one?';
        (getUnits as jest.MockedFunction<typeof getUnits>).mockImplementation(mockedErrorGetUnits);
        render(
            <RecoilRoot>
                <UnitManagement />
            </RecoilRoot>,
        );

        const errorMessage = await screen.findByText(mockErrorMessage);
        expect(errorMessage).toBeInTheDocument();
    });

    test('displays units cards in the list', async () => {
        (getUnits as jest.MockedFunction<typeof getUnits>).mockImplementation(mockedSuccessfulGetUnits);
        render(
            <RecoilRoot>
                <UnitManagement />
            </RecoilRoot>,
        );

        const unitCards = await screen.findAllByTestId('unit-card');
        expect(unitCards.length).toBeGreaterThan(0);
    });
});
