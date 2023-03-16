import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { pageTitleState, workOrderListState } from '../../recoil/atoms';
import { createWorkOrder, deleteWorkOrder, getWorkOrders, updateWorkOrder } from '../../api/workOrders';
import { Button, Col, Row, Typography } from 'antd';
import { WorkOrder } from '../../types';
import CreateWorkOrderModal from '../../components/CreateWorkOrderModal/CreateWorkOrderModal';
import WorkorderCard from '../../components/WorkorderCard/WorkorderCard';

const { Text } = Typography;

const WorkOrders: React.FC = () => {
    const setPageTitle = useSetRecoilState(pageTitleState);

    useEffect(() => {
        setPageTitle('Work Orders');
    }, []);

    const [workOrders, setWorkOrders] = useRecoilState(workOrderListState);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [workOrderWasDeleted, setWorkOrderWasDeleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (workOrders.length === 0 && !workOrderWasDeleted) {
            (async () => {
                try {
                    const fetchedWorkOrders = await getWorkOrders();
                    setWorkOrders(fetchedWorkOrders);
                } catch (e) {
                    setError('An error occurred while fetching work orders.');
                    console.warn('Error fetching work orders', e);
                }
            })();
        }
    }, [workOrders, setWorkOrders]);

    const handleCreateWorkOrder = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const onCancelCreate = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const onSave = useCallback(async (newWorkOrder: WorkOrder) => {
        try {
            const createdWorkOrder = await createWorkOrder(newWorkOrder);
            setWorkOrders((oldWorkOrdersList) => [...oldWorkOrdersList, createdWorkOrder]);
            setIsCreateModalOpen(false);
        } catch (e) {
            setError('An error occurred while creating a new work order. For more details, check the logs.');
            console.warn('Error while creating new work order', e);
        }
    }, []);

    // When Updating and Deleting a Workorder, a bug might happen where you update or delete 2 of the items from API, that happens because they have the same id.
    const onUpdate = useCallback(async (updatedWorkOrder: WorkOrder) => {
        try {
            const updatedData = await updateWorkOrder(updatedWorkOrder.id, updatedWorkOrder);
            setWorkOrders((oldWorkOrders) =>
                oldWorkOrders.map((workOrder) => (workOrder.id === updatedWorkOrder.id ? updatedData : workOrder)),
            );
        } catch (e) {
            setError('An error occurred while updating a work order. For more details, check the logs.');
            console.warn('Error while updating a work order', e);
        }
    }, []);

    const onDelete = useCallback(
        async (workOrderToDelete: WorkOrder) => {
            try {
                setWorkOrderWasDeleted(true);
                await deleteWorkOrder(workOrderToDelete.id);
                setWorkOrders(workOrders.filter((workOrder) => workOrder.id !== workOrderToDelete.id));
            } catch (e) {
                setError('An error occurred while deleting a work order. For more details, check the logs.');
                console.warn('Error while deleting work order', e);
            }
        },
        [workOrders],
    );

    return (
        <div className="component-content" style={{ justifyContent: 'center' }}>
            {error && (
                <div className="error-message">
                    <Text type="danger">{error}</Text>
                </div>
            )}
            <div className="create-data-button">
                <Button type="primary" onClick={handleCreateWorkOrder}>
                    Create Work Order
                </Button>
            </div>
            {workOrders.length > 0 && (
                <Row gutter={[16, 16]} justify="center">
                    {workOrders.map((workOrder) => (
                        <Col key={workOrder.title} xs={24} sm={12} md={8} lg={6} xl={4} data-testid="workorder-card">
                            <WorkorderCard workOrder={workOrder} onUpdate={onUpdate} onDelete={onDelete} />
                        </Col>
                    ))}
                </Row>
            )}
            {workOrders.length === 0 && (
                <h3 style={{ textAlign: 'center' }}>No workorders were found! Maybe create one?</h3>
            )}
            <CreateWorkOrderModal visible={isCreateModalOpen} onCancel={onCancelCreate} onSave={onSave} />
        </div>
    );
};

export default WorkOrders;
