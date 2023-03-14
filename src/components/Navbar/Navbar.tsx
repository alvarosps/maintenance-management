import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, Layout, Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Sider } = Layout;

type NavbarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
    const { isOpen, onClose } = props;
    const { pathname } = useLocation();

    return (
        <Drawer title="Menu" placement="left" closable={true} onClose={onClose} open={isOpen} width={250}>
            <Menu selectedKeys={[pathname]} mode="inline" theme="light">
                <Menu.Item key="/" icon={<HomeOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Menu.Item>
            </Menu>
        </Drawer>
    );
};

export default React.memo(Navbar);
