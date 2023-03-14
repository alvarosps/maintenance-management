import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, Menu } from 'antd';
import { HomeOutlined, BankOutlined, ApartmentOutlined, TeamOutlined, FileSearchOutlined } from '@ant-design/icons';
import './Navbar.scss';

type NavbarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
    const { isOpen, onClose } = props;
    const { pathname } = useLocation();

    const handleMenuItemClick = () => {
        onClose();
    };

    return (
        <Drawer title="Menu" placement="left" closable={true} onClose={onClose} open={isOpen} width={250}>
            <Menu selectedKeys={[pathname]} mode="inline" theme="light" onClick={handleMenuItemClick}>
                <Menu.Item key="/" icon={<HomeOutlined />}>
                    <Link to="/">Assets Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="/workorders" icon={<FileSearchOutlined />}>
                    <Link to="/workorders">Workorders</Link>
                </Menu.Item>
                <Menu.Item key="/companies" icon={<BankOutlined />}>
                    <Link to="/companies">Companies Management</Link>
                </Menu.Item>
                <Menu.Item key="/units" icon={<ApartmentOutlined />}>
                    <Link to="/units">Units Management</Link>
                </Menu.Item>
                <Menu.Item key="/users" icon={<TeamOutlined />}>
                    <Link to="/users">Users Management</Link>
                </Menu.Item>
            </Menu>
        </Drawer>
    );
};

export default React.memo(Navbar);
