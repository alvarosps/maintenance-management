import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { companyListState, pageTitleState } from '../../recoil/atoms';
import { createCompany, deleteCompany, getCompanies, updateCompany } from '../../api/companies';
import { Button, Col, Row, Typography } from 'antd';
import CompanyCard from '../../components/CompanyCard/CompanyCard';
import CreateDataModal from '../../components/CreateDataModal/CreateDataModal';
import { Company } from '../../types';

const { Text } = Typography;

const CompanyManagement: React.FC = () => {
    const setPageTitle = useSetRecoilState(pageTitleState);

    useEffect(() => {
        setPageTitle('Company Management');
    }, []);

    const [companies, setCompanies] = useRecoilState(companyListState);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [companyWasDeleted, setCompanyWasDeleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (companies.length === 0 && !companyWasDeleted) {
            (async () => {
                try {
                    const fetchedCompanies = await getCompanies();
                    setCompanies(fetchedCompanies);
                } catch (e) {
                    setError('An eror occurred while fetching companies.');
                    console.warn('Error fetching companies', e);
                }
            })();
        }
    }, [companies, setCompanies]);

    const handleCreateCompany = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const onCancelCreate = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const onSave = useCallback(async (newCompany: Company) => {
        try {
            const createdCompany = await createCompany(newCompany);
            setCompanies((oldCompaniesList) => [...oldCompaniesList, createdCompany]);
            setIsCreateModalOpen(false);
        } catch (e) {
            setError('An error occurred while creating a new company. For more details, check the logs.');
            console.warn('Error while creating new company', e);
        }
    }, []);

    const onUpdate = useCallback(async (updatedCompany: Company) => {
        try {
            const updatedData = await updateCompany(updatedCompany.id, updatedCompany);
            setCompanies((oldCompanies) =>
                oldCompanies.map((company) => (company.id === updatedCompany.id ? updatedData : company)),
            );
        } catch (e) {
            setError('An error occurred while updating a company. For more details, check the logs.');
            console.warn('Error while updating a company', e);
        }
    }, []);

    const onDelete = useCallback(
        async (companyToDelete: Company) => {
            try {
                setCompanyWasDeleted(true);
                await deleteCompany(companyToDelete.id);
                setCompanies(companies.filter((company) => company.id !== companyToDelete.id));
            } catch (e) {
                setError('An error occurred while deleting a company. For more details, check the logs.');
                console.warn('Error while deleting company', e);
            }
        },
        [companies],
    );

    return (
        <div className="component-content" style={{ justifyContent: 'center' }}>
            {error && (
                <div className="error-message">
                    <Text type="danger">{error}</Text>
                </div>
            )}
            <div className="create-data-button">
                <Button type="primary" onClick={handleCreateCompany}>
                    Create User
                </Button>
            </div>
            {companies.length > 0 && (
                <Row gutter={[16, 16]} justify="center">
                    {companies.map((company) => (
                        <Col key={company.id} xs={24} sm={12} md={8} lg={6} xl={4} data-testid="company-card">
                            <CompanyCard company={company} onUpdate={onUpdate} onDelete={onDelete} />
                        </Col>
                    ))}
                </Row>
            )}
            {companies.length === 0 && (
                <h3 style={{ textAlign: 'center' }}>No companies were found! Maybe create one?</h3>
            )}
            <CreateDataModal dataType="company" visible={isCreateModalOpen} onCancel={onCancelCreate} onSave={onSave} />
        </div>
    );
};

export default CompanyManagement;
