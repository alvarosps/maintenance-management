import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { pageTitleState, userListState } from '../../recoil/atoms';
import { createUser, deleteUser, getUsers, updateUser } from '../../api/users';
import { Button, Col, Row, Typography } from 'antd';
import UserCard from '../../components/UserCard/UserCard';
import CreateDataModal from '../../components/CreateDataModal/CreateDataModal';
import { User } from '../../types';

const { Text } = Typography;

const UsersManagement: React.FC = () => {
    const setPageTitle = useSetRecoilState(pageTitleState);

    useEffect(() => {
        setPageTitle('Users Management');
    }, []);

    const [users, setUsers] = useRecoilState(userListState);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userWasDeleted, setUserWasDeleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (users.length === 0 && !userWasDeleted) {
            (async () => {
                try {
                    const fetchedUsers = await getUsers();
                    setUsers(fetchedUsers);
                } catch (e) {
                    setError('An error occurred while fetching users.');
                    console.warn('Error fetching users', e);
                }
            })();
        }
    }, [users, setUsers]);

    const handleCreateUser = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const onCancelCreate = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const onSave = useCallback(async (newUser: User) => {
        try {
            const createdUser = await createUser(newUser);
            setUsers((oldUserList) => [...oldUserList, createdUser]);
            setIsCreateModalOpen(false);
        } catch (e) {
            setError('An error occurred while creating a new user. For more details, check the logs.');
            console.warn('Error while creating new user', e);
        }
    }, []);

    const onUpdate = useCallback(async (updatedUser: User) => {
        try {
            const updatedData = await updateUser(updatedUser.id, updatedUser);
            setUsers((oldUsers) => oldUsers.map((user) => (user.id === updatedUser.id ? updatedData : user)));
        } catch (e) {
            setError('An error occurred while updating an user. For more details, check the logs.');
            console.warn('Error while updating user', e);
        }
    }, []);

    const onDelete = useCallback(
        async (userToDelete: User) => {
            try {
                setUserWasDeleted(true);
                await deleteUser(userToDelete.id);
                setUsers(users.filter((user) => user.id !== userToDelete.id));
            } catch (error) {
                setError('An error occurred while deleting an user. For more details, check the logs.');
                console.warn('Error while deleting user', error);
            }
        },
        [users],
    );

    return (
        <div className="component-content" style={{ justifyContent: 'center' }}>
            {error && (
                <div className="error-message">
                    <Text type="danger">{error}</Text>
                </div>
            )}
            <div className="create-data-button">
                <Button type="primary" onClick={handleCreateUser}>
                    Create User
                </Button>
            </div>
            {users.length > 0 && (
                <Row gutter={[16, 16]} justify="center">
                    {users.map((user) => (
                        <Col key={user.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                            <UserCard user={user} onUpdate={onUpdate} onDelete={onDelete} />
                        </Col>
                    ))}
                </Row>
            )}
            {users.length === 0 && <h3 style={{ textAlign: 'center' }}>No users were found! Maybe create one?</h3>}
            <CreateDataModal dataType="user" visible={isCreateModalOpen} onCancel={onCancelCreate} onSave={onSave} />
        </div>
    );
};

export default UsersManagement;
