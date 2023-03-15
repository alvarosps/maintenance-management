import { render, fireEvent, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { userListState, companyListState, unitListState } from '../../recoil/atoms';
import AssetModal, { AssetModalProps } from './AssetModal';
import { Asset, Company, Unit, User } from '../../types';

const mockAsset: Asset = {
    id: 1,
    assignedUserIds: [1],
    healthHistory: [{ status: 'inOperation', timestamp: '2022-01-01T12:00:00Z' }],
    name: 'Test Asset',
    image: 'https://example.com/test.jpg',
    healthscore: 85,
    status: 'inOperation',
    sensors: ['sensor1', 'sensor2'],
    metrics: [{ timestamp: '2022-01-01T12:00:00Z', temperature: 25, humidity: 45, rpm: 1500 }],
    specifications: {
        maxTemp: 50,
        power: 1000,
        rpm: 2000,
    },
    unitId: 1,
    companyId: 1,
};

const mockUser: User = {
    companyId: 1,
    email: 'user@example.com',
    id: 1,
    name: 'User',
    unitId: 1,
};

const mockUnit: Unit = {
    companyId: 1,
    id: 1,
    name: 'Unit',
};

const mockCompany: Company = {
    id: 1,
    name: 'Company',
};

const renderAssetModal = (props: Partial<AssetModalProps> = {}) => {
    const defaultProps: AssetModalProps = {
        visible: true,
        asset: mockAsset,
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onDelete: jest.fn(),
        ...props,
    };

    return render(
        <RecoilRoot
            initializeState={({ set }) => {
                set(userListState, [mockUser]);
                set(companyListState, [mockCompany]);
                set(unitListState, [mockUnit]);
            }}
        >
            <AssetModal {...defaultProps} />
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

describe('AssetModal', () => {
    it('renders the AssetModal with correct asset details', () => {
        renderAssetModal();

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Asset Details')).toBeInTheDocument();
        expect(screen.getByText('Name:')).toBeInTheDocument();
        expect(screen.getByText(mockAsset.name)).toBeInTheDocument();
        expect(screen.getByText('Health Score:')).toBeInTheDocument();
        expect(screen.getByText(mockAsset.healthscore.toString())).toBeInTheDocument();
        expect(screen.getByText('Assigned Users:')).toBeInTheDocument();

        expect(screen.queryByText(new RegExp(mockUser.name))).toBeInTheDocument();

        expect(screen.getByText('Company:')).toBeInTheDocument();
        expect(screen.getByText(mockCompany.name)).toBeInTheDocument();
        expect(screen.getByText('Sensors:')).toBeInTheDocument();
        expect(screen.getByText(mockAsset.sensors.join(', '))).toBeInTheDocument();
        expect(screen.getByText('Specifications:')).toBeInTheDocument();
        expect(screen.getByText('Units:')).toBeInTheDocument();
        expect(screen.getByText(mockUnit.name)).toBeInTheDocument();
        expect(screen.getByText('Health History:')).toBeInTheDocument();
        expect(screen.getByText(mockAsset.healthHistory[0].status)).toBeInTheDocument();

        const updateButton = screen.getByText('Update Status');
        expect(updateButton).toBeInTheDocument();
    });

    it('updates the status when Update Status button is clicked and Save is clicked', () => {
        const onSave = jest.fn();
        renderAssetModal({ onSave });

        fireEvent.click(screen.getByText('Update Status'));

        const statusSelect = screen.getByRole('combobox');
        fireEvent.change(statusSelect, { target: { value: 'inAlert' } });

        fireEvent.click(screen.getByText('Save'));
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('does not update the status when Update Status button is clicked and Cancel is clicked', () => {
        const onSave = jest.fn();
        renderAssetModal({ onSave });

        fireEvent.click(screen.getByText('Update Status'));

        const statusSelect = screen.getByRole('combobox');
        fireEvent.change(statusSelect, { target: { value: 'inAlert' } });

        fireEvent.click(screen.getByText('Cancel'));
        expect(onSave).toHaveBeenCalledTimes(0);
    });

    it('calls onDelete when Delete button is clicked', () => {
        const onDelete = jest.fn();
        renderAssetModal({ onDelete });

        fireEvent.click(screen.getByText('Update Status'));
        fireEvent.click(screen.getByText('Delete'));
        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
