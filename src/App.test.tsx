import { render, act, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import App from './App';

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

describe('App component', () => {
    test('renders without crashing', async () => {
        await act(async () => {
            const { container } = render(
                <RecoilRoot>
                    <App />
                </RecoilRoot>,
            );
            await waitFor(() => container);
        });
    });
});
