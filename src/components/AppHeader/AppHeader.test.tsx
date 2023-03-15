import { render } from '@testing-library/react';
import AppHeader from './AppHeader';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

describe('AppHeader', () => {
    test('renders AppHeader', () => {
        render(
          <RecoilRoot>
            <Router>
              <AppHeader />
            </Router>
          </RecoilRoot>
        );
    });
});