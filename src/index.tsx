import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.scss';
import { RecoilRoot } from 'recoil';

const Root: React.FC = () => {
    return (
        <RecoilRoot>
            <App />
        </RecoilRoot>
    );
};

const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(<Root />);
} else {
    console.error('Could not find root element');
}
