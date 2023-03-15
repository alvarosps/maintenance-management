import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { pageTitleState, unitListState } from '../../recoil/atoms';
import { createUnit, deleteUnit, getUnits, updateUnit } from '../../api/units';
import { Button, Col, Row, Typography } from 'antd';
import UnitCard from '../../components/UnitCard/UnitCard';
import CreateDataModal from '../../components/CreateDataModal/CreateDataModal';
import { Unit } from '../../types';

const { Text } = Typography;

const UnitManagement: React.FC = () => {
    const setPageTitle = useSetRecoilState(pageTitleState);

    useEffect(() => {
        setPageTitle('Unit Management');
    }, []);

    const [units, setUnits] = useRecoilState(unitListState);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [unitWasDeleted, setUnitWasDeleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (units.length === 0 && !unitWasDeleted) {
            (async () => {
                try {
                    const fetchedUsers = await getUnits();
                    setUnits(fetchedUsers);
                } catch (e) {
                    setError('An eror occurred while fetching units.');
                    console.warn('Error fetching units', e);
                }
            })();
        }
    }, [units, setUnits]);

    const handleCreateUnit = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const onCancelCreate = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const onSave = useCallback(async (newUnit: Unit) => {
        try {
            const createdUnit = await createUnit(newUnit);
            setUnits((oldUnitList) => [...oldUnitList, createdUnit]);
            setIsCreateModalOpen(false);
        } catch (e) {
            setError('An error occurred while creating a new unit. For more details, check the logs.');
            console.warn('Error while creating new unit', e);
        }
    }, []);

    const onUpdate = useCallback(async (updatedUnit: Unit) => {
        try {
            const updatedData = await updateUnit(updatedUnit.id, updatedUnit);
            setUnits((oldUnits) => oldUnits.map((unit) => (unit.id === updatedUnit.id ? updatedData : unit)));
        } catch (e) {
            setError('An error occurred while updating an user. For more details, check the logs.');
            console.warn('Error while updating user', e);
        }
    }, []);

    const onDelete = useCallback(
        async (unitToDelete: Unit) => {
            try {
                setUnitWasDeleted(true);
                await deleteUnit(unitToDelete.id);
                setUnits(units.filter((unit) => unit.id !== unitToDelete.id));
            } catch (e) {
                setError('An error occurred while deleting an unit. For more details, check the logs.');
                console.warn('Error while deleting unit', e);
            }
        },
        [units],
    );

    return (
        <div className="component-content" style={{ justifyContent: 'center' }}>
            {error && (
                <div className="error-message">
                    <Text type="danger">{error}</Text>
                </div>
            )}
            <div className="create-data-button">
                <Button type="primary" onClick={handleCreateUnit}>
                    Create User
                </Button>
            </div>
            {units.length > 0 && (
                <Row gutter={[16, 16]} justify="center">
                    {units.map((unit) => (
                        <Col key={unit.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                            <UnitCard unit={unit} onUpdate={onUpdate} onDelete={onDelete} />
                        </Col>
                    ))}
                </Row>
            )}
            {units.length === 0 && <h3 style={{ textAlign: 'center' }}>No units were found! Maybe create one?</h3>}
            <CreateDataModal dataType="unit" visible={isCreateModalOpen} onCancel={onCancelCreate} onSave={onSave} />
        </div>
    );
};

export default UnitManagement;
