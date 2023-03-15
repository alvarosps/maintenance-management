import { render } from '@testing-library/react';
import WorkorderCard from './WorkorderCard';
import { WorkOrder, User, Asset } from '../../types';
import { RecoilRoot } from 'recoil';
import { assetListState, userListState } from '../../recoil/atoms';

const mockWorkOrder: WorkOrder = {
    assetId: 1,
    assignedUserIds: [1],
    checklist: [
        { completed: false, task: 'Task 1' },
        { completed: true, task: 'Task 2' },
    ],
    description: 'Test work order description',
    id: 1,
    priority: 'medium',
    status: 'in_progress',
    title: 'Test work order',
};

const mockAsset: Asset = {
    id: 1,
    assignedUserIds: [1],
    healthHistory: [],
    name: 'Test Asset',
    image: '',
    healthscore: 85,
    status: 'active',
    sensors: [],
    metrics: [],
    specifications: {
        maxTemp: 100,
        power: 10,
        rpm: 3000,
    },
    unitId: 1,
    companyId: 1,
};

const mockUser: User = {
    companyId: 1,
    email: 'test@example.com',
    id: 1,
    name: 'Test User',
    unitId: 1,
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

describe('WorkorderCard', () => {
    afterEach(() => {
        onUpdate.mockClear();
        onDelete.mockClear();
    });

    const renderWorkorderCard = (workOrder: WorkOrder) =>
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(assetListState, [mockAsset]);
                    set(userListState, [mockUser]);
                }}
            >
                <WorkorderCard workOrder={workOrder} onUpdate={onUpdate} onDelete={onDelete} />
            </RecoilRoot>,
        );

    test('renders work order data', () => {
        const { getByText, getAllByText } = renderWorkorderCard(mockWorkOrder);
        expect(getByText('Title:')).toBeInTheDocument();
        const titleElements = getAllByText('Test work order');
        expect(titleElements.length).toBe(2);
        expect(titleElements[1]).toBeInTheDocument();
        expect(getByText('Description:')).toBeInTheDocument();
        expect(getByText('Test work order description')).toBeInTheDocument();
    });

    test('renders work order status correctly', () => {
        const workOrderWithStatus = {
            ...mockWorkOrder,
            status: 'completed',
        };
        const { getByText } = renderWorkorderCard(workOrderWithStatus);
        expect(getByText('Status:')).toBeInTheDocument();
        expect(getByText('completed')).toBeInTheDocument();
    });

    test('renders work order card with no assigned users', () => {
        const workOrderWithNoUsers: WorkOrder = {
            id: 1,
            title: 'Test work order',
            description: 'Test work order description',
            status: 'in_progress',
            priority: 'medium',
            assetId: 1,
            assignedUserIds: [],
            checklist: [
                { completed: false, task: 'Task 1' },
                { completed: true, task: 'Task 2' },
            ],
        };

        const { getByText } = renderWorkorderCard(workOrderWithNoUsers);
        expect(getByText('Assigned Users:')).toBeInTheDocument();
        expect(getByText(/Assigned Users:$/)).toBeInTheDocument(); // Checks for an empty list of assigned users
    });
});
