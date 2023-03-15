// Supressing deprecation warnings from Ant Design (one feature is deprecated, but the solution is not implemented anymore in the library)
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import { RecoilRoot } from 'recoil';

describe('Navbar', () => {
    const onClose = jest.fn();

    const renderNavbar = (isOpen: boolean) => {
        return render(
            <Router>
                <RecoilRoot>
                    <Navbar isOpen={isOpen} onClose={onClose} />
                </RecoilRoot>
            </Router>,
        );
    };

    test('renders Navbar with all menu items', () => {
        const { getByText } = renderNavbar(true);

        expect(getByText('Assets Dashboard')).toBeInTheDocument();
        expect(getByText('Workorders')).toBeInTheDocument();
        expect(getByText('Companies Management')).toBeInTheDocument();
        expect(getByText('Units Management')).toBeInTheDocument();
        expect(getByText('Users Management')).toBeInTheDocument();
    });

    test('invokes onClose when clicking on a menu item', () => {
        const { getByText } = renderNavbar(true);

        fireEvent.click(getByText('Workorders'));
        expect(onClose).toHaveBeenCalled();
    });

    test('navigates to correct routes on menu item click', () => {
        const { getByText } = renderNavbar(true);

        fireEvent.click(getByText('Assets Dashboard'));
        expect(window.location.pathname).toBe('/');

        fireEvent.click(getByText('Workorders'));
        expect(window.location.pathname).toBe('/workorders');

        fireEvent.click(getByText('Companies Management'));
        expect(window.location.pathname).toBe('/companies');

        fireEvent.click(getByText('Units Management'));
        expect(window.location.pathname).toBe('/units');

        fireEvent.click(getByText('Users Management'));
        expect(window.location.pathname).toBe('/users');
    });
});
