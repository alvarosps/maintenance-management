import { render, screen, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Dashboard from './Dashboard';
import { Asset } from '../../types';
import { getAssets } from '../../api/assets';

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

const mockAssets: Asset[] = [
    {
        id: 1,
        assignedUserIds: [1, 2],
        healthHistory: [
            {
                status: 'good',
                timestamp: '2022-03-14T14:00:00.000Z',
            },
            {
                status: 'warning',
                timestamp: '2022-03-13T14:00:00.000Z',
            },
            {
                status: 'bad',
                timestamp: '2022-03-12T14:00:00.000Z',
            },
        ],
        name: 'Asset 1',
        image: 'https://example.com/asset1.jpg',
        healthscore: 80,
        status: 'active',
        sensors: ['temperature', 'humidity', 'vibration'],
        metrics: [
            {
                timestamp: '2022-03-14T14:00:00.000Z',
                temperature: 23,
                humidity: 60,
                rpm: 1200,
            },
            {
                timestamp: '2022-03-14T13:00:00.000Z',
                temperature: 21,
                humidity: 55,
                rpm: 1300,
            },
            {
                timestamp: '2022-03-14T12:00:00.000Z',
                temperature: 20,
                humidity: 52,
                rpm: 1250,
            },
        ],
        specifications: {
            maxTemp: 30,
            power: 1200,
            rpm: 1500,
        },
        unitId: 1,
        companyId: 1,
    },
    {
        id: 2,
        assignedUserIds: [3],
        healthHistory: [
            {
                status: 'good',
                timestamp: '2022-03-14T14:00:00.000Z',
            },
            {
                status: 'good',
                timestamp: '2022-03-13T14:00:00.000Z',
            },
            {
                status: 'good',
                timestamp: '2022-03-12T14:00:00.000Z',
            },
        ],
        name: 'Asset 2',
        image: 'https://example.com/asset2.jpg',
        healthscore: 100,
        status: 'active',
        sensors: ['temperature', 'humidity'],
        metrics: [
            {
                timestamp: '2022-03-14T14:00:00.000Z',
                temperature: 22,
                humidity: 65,
                rpm: 1100,
            },
            {
                timestamp: '2022-03-14T13:00:00.000Z',
                temperature: 20,
                humidity: 60,
                rpm: 1000,
            },
            {
                timestamp: '2022-03-14T12:00:00.000Z',
                temperature: 19,
                humidity: 58,
                rpm: 1050,
            },
        ],
        specifications: {
            maxTemp: 35,
            power: 800,
            rpm: 1200,
        },
        unitId: 2,
        companyId: 1,
    },
];

const mockedErrorGetAssets = jest.fn().mockRejectedValue(new Error('No workorders were found! Maybe create one?'));
const mockedSuccessfulGetAssets = jest.fn().mockResolvedValue(mockAssets);

beforeAll(() => {
    (getAssets as jest.MockedFunction<typeof getAssets>).mockImplementation(mockedSuccessfulGetAssets);
});

afterAll(() => {
    jest.restoreAllMocks();
});

jest.mock('../../api/assets', () => ({
    getAssets: jest.fn(),
}));

describe('Dashboard component', () => {
    test('renders without crashing', () => {
        act(() => {
            render(
                <RecoilRoot>
                    <Dashboard />
                </RecoilRoot>,
            );
        });
    });

    test('displays an error message if an error occurs while fetching assets', async () => {
        const mockErrorMessage = 'An error occurred while fetching assets. For more details, check the logs.';
        (getAssets as jest.MockedFunction<typeof getAssets>).mockImplementation(mockedErrorGetAssets);
        act(() => {
            render(
                <RecoilRoot>
                    <Dashboard />
                </RecoilRoot>,
            );
        });

        const errorMessage = await screen.findByText(mockErrorMessage);
        expect(errorMessage).toBeInTheDocument();
    });

    test('displays assets cards in the list', async () => {
        (getAssets as jest.MockedFunction<typeof getAssets>).mockImplementation(mockedSuccessfulGetAssets);
        act(() => {
            render(
                <RecoilRoot>
                    <Dashboard />
                </RecoilRoot>,
            );
        });

        const assetCards = await screen.findAllByTestId('asset-card');
        expect(assetCards.length).toBeGreaterThan(0);
    });
});
