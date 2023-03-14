import React, { useState } from 'react';
import { pagetTitleState } from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';
import { Button, Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './AppHeader.scss';
import Navbar from '../Navbar/Navbar';

const { Header } = Layout;

const AppHeader: React.FC = () => {
    const pageTitle = useRecoilValue(pagetTitleState);

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
