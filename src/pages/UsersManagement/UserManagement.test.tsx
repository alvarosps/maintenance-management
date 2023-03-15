import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import UsersManagement from './UsersManagement';

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

describe('UsersManagement component', () => {
    it('renders without crashing', () => {
        render(
            <RecoilRoot>
                <UsersManagement />
            </RecoilRoot>,
        );
    });
});
