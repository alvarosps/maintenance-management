import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Workorders from './Workorders';
import { getWorkOrders } from '../../api/workOrders';
import { WorkOrder } from '../../types';

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

const mockWorkOrders: WorkOrder[] = [
    {
        assetId: 1,
        assignedUserIds: [1, 2],
        checklist: [
            {
                completed: true,
                task: 'Task 1',
            },
            {
                completed: false,
                task: 'Task 2',
            },
            {
                completed: true,
                task: 'Task 3',
            },
        ],
        description: 'Work order 1 description',
        id: 1,
        priority: 'high',
        status: 'In progress',
        title: 'Work order 1',
    },
    {
        assetId: 2,
        assignedUserIds: [3],
        checklist: [
            {
                completed: false,
                task: 'Task 1',
            },
            {
                completed: false,
                task: 'Task 2',
            },
        ],
        description: 'Work order 2 description',
        id: 2,
        priority: 'medium',
        status: 'Open',
        title: 'Work order 2',
    },
];

const mockedErrorGetWorkorders = jest.fn().mockRejectedValue(new Error('No workorders were found! Maybe create one?'));
const mockedSuccessfulGetWorkorders = jest.fn().mockResolvedValue(mockWorkOrders);

beforeAll(() => {
    (getWorkOrders as jest.MockedFunction<typeof getWorkOrders>).mockImplementation(mockedSuccessfulGetWorkorders);
});

afterAll(() => {
    jest.restoreAllMocks();
});

jest.mock('../../api/workOrders', () => ({
    getWorkOrders: jest.fn(),
}));

describe('Workorders component', () => {
    test('renders without crashing', () => {
        render(
            <RecoilRoot>
                <Workorders />
            </RecoilRoot>,
        );
    });

    test('displays the "Create Work Order" button', () => {
        const { getByRole } = render(
            <RecoilRoot>
                <Workorders />
            </RecoilRoot>,
        );

        expect(getByRole('button', { name: 'Create Work Order' })).toBeInTheDocument();
    });

    test('displays an error message if an error occurs while fetching workorders', async () => {
        const mockErrorMessage = 'No workorders were found! Maybe create one?';
        (getWorkOrders as jest.MockedFunction<typeof getWorkOrders>).mockImplementation(mockedErrorGetWorkorders);
        render(
            <RecoilRoot>
                <Workorders />
            </RecoilRoot>,
        );

        const errorMessage = await screen.findByText(mockErrorMessage);
        expect(errorMessage).toBeInTheDocument();
    });

    test('displays workorders cards in the list', async () => {
        (getWorkOrders as jest.MockedFunction<typeof getWorkOrders>).mockImplementation(mockedSuccessfulGetWorkorders);
        render(
            <RecoilRoot>
                <Workorders />
            </RecoilRoot>,
        );

        const workorderCards = await screen.findAllByTestId('workorder-card');
        expect(workorderCards.length).toBeGreaterThan(0);
    });
});
