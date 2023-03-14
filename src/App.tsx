import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from 'antd';
import Router from './routes';
import AppHeader from './components/AppHeader/AppHeader';

const { Content, Footer } = Layout;

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout className="layout">
                <AppHeader />
                <Content className="app-content">
                    <Router />
                </Content>
                <Footer>Created by Alvaro Silva ©2023</Footer>
            </Layout>
        </BrowserRouter>
    );
};

export default App;
