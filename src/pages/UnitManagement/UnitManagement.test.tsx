import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import UnitManagement from './UnitManagement';

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

describe('UnitManagement component', () => {
    it('renders without crashing', () => {
        render(
            <RecoilRoot>
                <UnitManagement />
            </RecoilRoot>,
        );
    });
});
