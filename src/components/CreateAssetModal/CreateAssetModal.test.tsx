import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import CreateAssetModal from './CreateAssetModal';
import { Asset, Company, Unit, User } from '../../types';
import { companyListState, unitListState, userListState } from '../../recoil/atoms';

const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

const mockUsers: User[] = [
    { id: 1, name: 'User 1', email: 'user1@example.com', unitId: 1, companyId: 1 },
    { id: 2, name: 'User 2', email: 'user2@example.com', unitId: 2, companyId: 1 },
];

const mockCompanies: Company[] = [
    { id: 1, name: 'Company 1' },
    { id: 2, name: 'Company 2' },
];

const mockUnits: Unit[] = [
    { id: 1, name: 'Unit 1', companyId: 1 },
    { id: 2, name: 'Unit 2', companyId: 2 },
];

const renderCreateAssetModal = (visible: boolean) => {
    return render(
        <RecoilRoot
            initializeState={({ set }) => {
                set(userListState, mockUsers);
                set(companyListState, mockCompanies);
                set(unitListState, mockUnits);
            }}
        >
            <CreateAssetModal visible={visible} onCancel={mockOnCancel} onSave={mockOnSave} />
        </RecoilRoot>,
    );
};

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

describe('CreateAssetModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders CreateAssetModal', () => {
        const { getByText } = renderCreateAssetModal(true);
        expect(getByText('Create Asset')).toBeInTheDocument();
    });

    it('does not render CreateAssetModal when not visible', () => {
        const { queryByText } = renderCreateAssetModal(false);
        expect(queryByText('Create Asset')).not.toBeInTheDocument();
    });

    it('displays all form fields and populates dropdowns with values', async () => {
        const { getByLabelText, getByText } = renderCreateAssetModal(true);

        // Checking for form fields
        expect(getByLabelText('Name')).toBeInTheDocument();
        expect(getByLabelText('Assigned User IDs')).toBeInTheDocument();
        expect(getByLabelText('Company ID')).toBeInTheDocument();
        expect(getByLabelText('Health Score')).toBeInTheDocument();
        expect(getByLabelText('Status')).toBeInTheDocument();
        expect(getByLabelText('Unit ID')).toBeInTheDocument();
        expect(getByLabelText('Sensors')).toBeInTheDocument();

        // Checking for dropdown values
        await act(async () => {
            fireEvent.mouseDown(getByLabelText('Assigned User IDs'));
        });
        expect(getByText('User 1')).toBeInTheDocument();
        expect(getByText('User 2')).toBeInTheDocument();

        await act(async () => {
            fireEvent.mouseDown(getByLabelText('Company ID'));
        });
        expect(getByText('Company 1')).toBeInTheDocument();
        expect(getByText('Company 2')).toBeInTheDocument();

        await act(async () => {
            fireEvent.mouseDown(getByLabelText('Unit ID'));
        });
        expect(getByText('Unit 1')).toBeInTheDocument();
        expect(getByText('Unit 2')).toBeInTheDocument();
    });

    it('calls onCancel when clicking cancel button', async () => {
        const { getByText } = renderCreateAssetModal(true);
        await act(async () => {
            fireEvent.click(getByText('Cancel'));
        });
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onSave with the new asset when clicking save button', async () => {
        const { getByText, getByLabelText, findByText } = renderCreateAssetModal(true);

        fireEvent.input(getByLabelText('Name'), { target: { value: 'New Asset' } });
        fireEvent.mouseDown(getByLabelText('Assigned User IDs'));
        const user1 = await findByText('User 1');
        const user2 = await findByText('User 2');
        fireEvent.click(user1);
        fireEvent.click(user2);
        fireEvent.mouseDown(getByLabelText('Company ID'));
        fireEvent.click(await findByText('Company 1'));
        fireEvent.input(getByLabelText('Health Score'), { target: { value: 85 } });
        fireEvent.mouseDown(getByLabelText('Status'));
        fireEvent.click(await findByText('In Operation'));
        fireEvent.mouseDown(getByLabelText('Unit ID'));
        fireEvent.click(await findByText('Unit 1'));
        fireEvent.input(getByLabelText('Sensors'), { target: { value: 'sensor1,sensor2,sensor3' } });

        fireEvent.click(getByText('Save'));

        await waitFor(() => expect(mockOnSave).toHaveBeenCalledTimes(1));
        const expectedAsset: Partial<Asset> = {
            name: 'New Asset',
            assignedUserIds: [1, 2],
            companyId: 1,
            healthscore: 85,
            status: 'inOperation',
            unitId: 1,
            sensors: ['sensor1', 'sensor2', 'sensor3'],
        };
        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining(expectedAsset));
    });
});
