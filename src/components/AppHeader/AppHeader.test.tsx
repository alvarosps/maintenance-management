// Supressing deprecation warnings from Ant Design (one feature is deprecated, but the solution is not implemented anymore in the library)
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot, atom } from 'recoil';
import AppHeader from './AppHeader';

const pageTitleState = atom({
    key: 'pageTitleState',
    default: 'Test Page Title',
});

describe('AppHeader', () => {
    const renderAppHeader = () => {
        return render(
            <RecoilRoot initializeState={({ set }) => set(pageTitleState, 'Test Page Title')}>
                <Router>
                    <AppHeader />
                </Router>
            </RecoilRoot>,
        );
    };

    test('renders AppHeader with the correct page title', () => {
        const { getByText } = renderAppHeader();

        expect(getByText('Test Page Title')).toBeInTheDocument();
    });
});
