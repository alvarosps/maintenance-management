import React, { useState } from 'react';
import { pageTitleState } from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';
import { Button, Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Navbar from '../Navbar/Navbar';
import './AppHeader.scss';

const { Header } = Layout;

const AppHeader: React.FC = () => {
    const pageTitle = useRecoilValue(pageTitleState);

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    return (
        <Header>
            <Button ghost type="primary" onClick={handleDrawerToggle} icon={<MenuOutlined />} />
            <h1 className="title">{pageTitle}</h1>
            <Navbar isOpen={isNavbarOpen} onClose={handleDrawerToggle} />
        </Header>
    );
};

export default AppHeader;
