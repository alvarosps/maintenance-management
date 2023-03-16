import { render, screen } from '@testing-library/react';
import UsersManagement from './UsersManagement';
import { RecoilRoot } from 'recoil';
import { getUsers } from '../../api/users';
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
const mockUsers = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@example.com',
    },
];

const mockedErrorGetUsers = jest.fn().mockRejectedValue(new Error('No users were found! Maybe create one?'));
const mockedSuccessfulGetUsers = jest.fn().mockResolvedValue(mockUsers);

beforeAll(() => {
    (getUsers as jest.MockedFunction<typeof getUsers>).mockImplementation(mockedSuccessfulGetUsers);
});

afterAll(() => {
    jest.restoreAllMocks();
});

jest.mock('../../api/users', () => ({
    getUsers: jest.fn(),
}));

describe('UsersManagement component', () => {
    beforeAll(() => {
        Object.defineProperty(global, 'fetch', {
            value: jest.fn().mockResolvedValue({
                json: () => Promise.resolve(mockUsers),
            }),
            writable: true,
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('renders without crashing', () => {
        render(
            <RecoilRoot>
                <UsersManagement />
            </RecoilRoot>,
        );
    });

    test('displays an error message if an error occurs while fetching users', async () => {
        const mockErrorMessage = 'No users were found! Maybe create one?';
        (getUsers as jest.MockedFunction<typeof getUsers>).mockImplementation(mockedErrorGetUsers);
        render(
            <RecoilRoot>
                <UsersManagement />
            </RecoilRoot>,
        );

        const errorMessage = await screen.findByText(mockErrorMessage);
        expect(errorMessage).toBeInTheDocument();
    });

    test('displays user cards in the list', async () => {
        (getUsers as jest.MockedFunction<typeof getUsers>).mockImplementation(mockedSuccessfulGetUsers);
        render(
            <RecoilRoot>
                <UsersManagement />
            </RecoilRoot>,
        );

        const userCards = await screen.findAllByTestId('user-card');
        expect(userCards.length).toBeGreaterThan(0);
    });
});
