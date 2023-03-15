// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import '@testing-library/jest-dom/extend-expect';
import CreateWorkOrderModal from './CreateWorkOrderModal';
import { assetListState, userListState } from '../../recoil/atoms';
import { Asset, User } from '../../types';

const mockUsers: User[] = [
    { id: 1, name: 'User 1', email: 'user1@example.com', unitId: 1, companyId: 1 },
    { id: 2, name: 'User 2', email: 'user2@example.com', unitId: 2, companyId: 1 },
];

const mockAssets: Asset[] = [
    {
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
    },
];

const mockUseRecoilValue = jest.fn();

jest.mock('recoil', () => ({
    ...jest.requireActual('recoil'),
    useRecoilValue: () => mockUseRecoilValue(),
}));

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

describe('CreateWorkOrderModal', () => {
    beforeEach(() => {
        mockUseRecoilValue.mockImplementation((recoilState) => {
            if (recoilState === assetListState) return mockAssets;
            if (recoilState === userListState) return mockUsers;
            return [];
        });
    });

    test('renders the CreateWorkOrderModal component', () => {
        const { getByText } = render(
            <RecoilRoot>
                <CreateWorkOrderModal visible={true} onCancel={jest.fn()} onSave={jest.fn()} />
            </RecoilRoot>,
        );

        expect(getByText('Create new work order')).toBeInTheDocument();
    });

    //   it('creates a new work order', async () => {
    //     const onSave = jest.fn();

    //     render(
    //       <RecoilRoot>
    //         <CreateWorkOrderModal visible={true} onCancel={jest.fn()} onSave={onSave} />
    //       </RecoilRoot>,
    //     );

    //     fireEvent.change(screen.getByTestId('title'), { target: { value: 'Test Work Order' } });
    //     fireEvent.change(screen.getByTestId('description'), { target: { value: 'Test Description' } });
    //     fireEvent.mouseDown(screen.getByTestId('status'));
    //     fireEvent.click(screen.getByTestId('completed'));
    //     fireEvent.mouseDown(screen.getByTestId('priority'));
    //     fireEvent.click(screen.getByTestId('high'));
    //     fireEvent.mouseDown(screen.getByTestId('assignedUsers'));
    //     fireEvent.click(screen.getByTestId('user-1'));
    //     fireEvent.mouseDown(screen.getByTestId('assetId'));
    //     fireEvent.click(screen.getByTestId('asset-1'));

    //     fireEvent.click(screen.getByTestId('addTask'));
    //     fireEvent.change(screen.getByTestId('taskName'), { target: { value: 'Test Task' } });
    //     fireEvent.click(screen.getByTestId('taskCompleted'));

    //     fireEvent.click(screen.getByText(/Save/i));

    //     await waitFor(() => {
    //       expect(onSave).toHaveBeenCalled();
    //     });
    //   });
});
