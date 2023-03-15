import React, { useEffect, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Router from './routes';
import AppHeader from './components/AppHeader/AppHeader';
import { companyListState, unitListState, userListState } from './recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { getCompanies } from './api/companies';
import { getUnits } from './api/units';
import { getUsers } from './api/users';

const { Content, Footer } = Layout;

const App: React.FC = () => {
    // Will load the Companies, Units and Users data from API to the Recoil State (used in many different pages)
    const setUserList = useSetRecoilState(userListState);
    const setUnitList = useSetRecoilState(unitListState);
    const setCompanyList = useSetRecoilState(companyListState);

    useEffect(() => {
        const fetchData = async () => {
            const [companies, units, users] = await Promise.all([getCompanies(), getUnits(), getUsers()]);

            setCompanyList(companies);
            setUnitList(units);
            setUserList(users);
        };

        fetchData();
    }, [setCompanyList, setUnitList, setUserList]);

    return (
        <BrowserRouter>
            <Layout className="layout">
                <AppHeader />
                <Content className="app-content">
                    <Suspense fallback={<Spin size='large' style={{ justifyContent: 'center'}} />}>
                        <Router />
                    </Suspense>
                </Content>
                <Footer>Created by Alvaro Silva ©2023</Footer>
            </Layout>
        </BrowserRouter>
    );
};

export default App;
