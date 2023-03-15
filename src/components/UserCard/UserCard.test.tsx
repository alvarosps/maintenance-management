import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import UserCard from './UserCard';
import { User, Company, Unit } from '../../types';
import { companyListState, unitListState } from '../../recoil/atoms';

const mockUser: User = {
    id: 1,
    name: 'User 1',
    companyId: 1,
    unitId: 1,
    email: 'user1@example.com',
};

const mockCompanies: Company[] = [
    { id: 1, name: 'Company 1' },
    { id: 2, name: 'Company 2' },
];

const mockUnits: Unit[] = [
    { id: 1, name: 'Unit 1', companyId: 1 },
    { id: 2, name: 'Unit 2', companyId: 2 },
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

describe('UserCard', () => {
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    const renderUserCard = (user: User) =>
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(companyListState, mockCompanies);
                    set(unitListState, mockUnits);
                }}
            >
                <UserCard user={user} onUpdate={onUpdate} onDelete={onDelete} />
            </RecoilRoot>,
        );

    test('renders user data', () => {
        const { container } = renderUserCard(mockUser);

        const nameDiv = container.querySelector('div.card-data > div:nth-child(1)');
        const emailDiv = container.querySelector('div.card-data > div:nth-child(2)');
        const companyDiv = container.querySelector('div.card-data > div:nth-child(3)');
        const unitDiv = container.querySelector('div.card-data > div:nth-child(4)');

        expect(nameDiv).toHaveTextContent('Name: User 1');
        expect(emailDiv).toHaveTextContent('Email: user1@example.com');
        expect(companyDiv).toHaveTextContent('Company: Company 1');
        expect(unitDiv).toHaveTextContent('Unit: Unit 1');
    });

    test('enters edit mode when the Edit button is clicked', () => {
        const { getByTestId } = renderUserCard(mockUser);

        // The edit button should be visible initially
        expect(getByTestId('edit-button')).toBeInTheDocument();

        // Click the edit button to enter the edit mode
        fireEvent.click(getByTestId('edit-button'));

        // Verify that the save, delete, and cancel buttons are visible in edit mode
        expect(getByTestId('save-button')).toBeInTheDocument();
        expect(getByTestId('delete-button')).toBeInTheDocument();
        expect(getByTestId('cancel-button')).toBeInTheDocument();
    });

    test('calls onUpdate when Save button is clicked', async () => {
        const { getByText, getByTestId } = renderUserCard(mockUser);

        fireEvent.click(getByText('Edit'));
        fireEvent.change(getByTestId('name-input'), { target: { value: 'New User Name' } });
        fireEvent.click(getByText('Save'));

        await waitFor(() =>
            expect(onUpdate).toHaveBeenCalledWith({
                ...mockUser,
                name: 'New User Name',
            }),
        );
    });

    test('calls onDelete when Delete button is clicked', () => {
        const { getByText } = renderUserCard(mockUser);

        fireEvent.click(getByText('Edit'));
        fireEvent.click(getByText('Delete'));

        expect(onDelete).toHaveBeenCalledWith(mockUser);
    });

    test('exits edit mode when Cancel button is clicked', () => {
        const { getByText, container } = renderUserCard(mockUser);

        fireEvent.click(getByText('Edit'));
        fireEvent.click(getByText('Cancel'));

        const nameDiv = container.querySelector('div.card-data > div:nth-child(1)');
        const emailDiv = container.querySelector('div.card-data > div:nth-child(2)');
        const companyDiv = container.querySelector('div.card-data > div:nth-child(3)');
        const unitDiv = container.querySelector('div.card-data > div:nth-child(4)');

        expect(nameDiv).toHaveTextContent('Name: User 1');
        expect(emailDiv).toHaveTextContent('Email: user1@example.com');
        expect(companyDiv).toHaveTextContent('Company: Company 1');
        expect(unitDiv).toHaveTextContent('Unit: Unit 1');
    });
});
