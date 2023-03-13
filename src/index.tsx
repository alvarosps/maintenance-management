import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from 'antd';

import './index.scss';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
            </Header>
            <Content style={{ padding: '50px' }}>
                <div id="container" />
            </Content>
            <Footer style={{ textAlign: 'center' }}>Created by Alvaro Silva ©2023</Footer>
        </Layout>
    );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error('Could not find root element');
}