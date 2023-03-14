import React, { useCallback, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsAnnotations from 'highcharts/modules/annotations';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { Button, Card, Col, Row, Spin } from 'antd';
import { Asset } from '../../types';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import './Dashboard.scss';
import AssetModal from '../../components/AssetModal/AssetModal';
import { assetListState, companyListState, pageTitleState, unitListState, userListState } from '../../recoil/atoms';
import { createAsset, deleteAsset, getAssets, updateAsset } from '../../api/assets';
import { getCompanies } from '../../api/companies';
import { getUnits } from '../../api/units';
import { getUsers } from '../../api/users';
import CreateAssetModal from '../../components/CreateAssetModal/CreateAssetModal';

highchartsMore(Highcharts);
highchartsAnnotations(Highcharts);
highchartsAccessibility(Highcharts);

const Dashboard = () => {
    const setPageTitle = useSetRecoilState(pageTitleState);

    useEffect(() => {
        setPageTitle('Assets Dashboard');
    });

    // Will load the Companies, Units and Users data from API to the Recoil State
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

    const [assetList, setAssetList] = useRecoilState(assetListState);
    const assetListLoadable = useRecoilValueLoadable(assetListState);

    useEffect(() => {
        if (assetListLoadable.state === 'hasValue' && assetListLoadable.contents.length === 0) {
            const loadAssets = async () => {
                const assets = await getAssets();
                setAssetList(assets);
            };
            loadAssets();
        }
    }, [assetListLoadable, setAssetList]);

    // Charts data control
    const [healthScoreChartOptions, setHealthScoreChartOptions] = useState<Highcharts.Options>();
    const [healthLevelChartOptions, setHealthLevelChartOptions] = useState<Highcharts.Options>();
    const [switchChecked, setSwitchChecked] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);

    const healthLevelCategories = ['inAlert', 'inDowntime', 'unplannedStop', 'plannedStop', 'inOperation'];

    const [areGraphsOptionsLoaded, setAreGraphsOptionsLoaded] = useState(false);

    useEffect(() => {
        const assetsHealthScoreData = assetList.map((asset) => ({
            name: asset.name,
            y: asset.healthscore,
        }));

        setHealthScoreChartOptions({
            chart: {
                type: 'column',
            },
            title: {
                text: 'Assets Health Score',
            },
            xAxis: {
                type: 'category',
                categories: assetList.map((asset: Asset) => asset.name),
                title: {
                    text: 'Asset name',
                },
            },
            yAxis: {
                title: {
                    text: 'Health Score',
                },
            },
            series: [
                {
                    type: 'bar',
                    name: 'Assets Health Score',
                    data: assetsHealthScoreData,
                },
            ],
        });
    }, [assetList]);

    useEffect(() => {
        const assetsHealthLevelsHistory = assetList.map((asset) => ({
            name: asset.name,
            healthHistory: asset.healthHistory,
        }));

        setHealthLevelChartOptions({
            title: {
                text: 'Assets Health Level History',
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                },
            },
            yAxis: {
                title: {
                    text: 'Status',
                },
                categories: healthLevelCategories,
            },
            legend: {
                enabled: true,
            },
            series: assetsHealthLevelsHistory.map(({ name, healthHistory }) => ({
                type: 'line',
                name,
                data: healthHistory.map(({ timestamp, status }) => {
                    const categoryIndex = healthLevelCategories.indexOf(status);
                    return [new Date(timestamp).getTime(), categoryIndex];
                }),
            })),
        });
    }, [assetList]);

    useEffect(() => {
        if (healthLevelChartOptions && healthScoreChartOptions) {
            setAreGraphsOptionsLoaded(true);
        }
    }, [healthLevelChartOptions, healthScoreChartOptions]);

    const handleSwitchChange = useCallback((checked: boolean) => {
        setSwitchChecked(checked);
    }, []);

    const onModalCancel = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const onModalSave = useCallback(async (updatedAsset: Asset) => {
        const updatedData = await updateAsset(updatedAsset.id, updatedAsset);
        setAssetList((oldAssetList) =>
            oldAssetList.map((asset) => (asset.id === updatedAsset.id ? updatedData : asset)),
        );
        setSelectedAsset(updatedData);
    }, []);

    const onModalDelete = useCallback(
        async (assetToDelete: Asset) => {
            setAssetList(assetList.filter((asset) => asset.id !== assetToDelete.id));
            setSelectedAsset(undefined);
            setIsModalOpen(false);
            await deleteAsset(assetToDelete.id);
        },
        [assetList],
    );

    // Creation of asset control
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const handleCreateAsset = useCallback(async (newAsset: Asset) => {
        const createdAsset = await createAsset(newAsset);
        setAssetList((oldAssetList) => [...oldAssetList, createdAsset]);
        setIsCreateModalOpen(false);
    }, []);

    const onCreateCancel = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    return (
        <div className="component-content">
            {!areGraphsOptionsLoaded && (
                <div className="loading-spinner">
                    <Spin size="large" tip="Loading Assets" />
                </div>
            )}
            {areGraphsOptionsLoaded && (
                <>
                    <Card className="assets-graphs">
                        <ToggleSwitch
                            checked={switchChecked}
                            handleChange={handleSwitchChange}
                            leftText="Health Score Chart"
                            rightText="Health Levels Chart"
                        />
                        {switchChecked && <HighchartsReact highcharts={Highcharts} options={healthLevelChartOptions} />}
                        {!switchChecked && (
                            <HighchartsReact highcharts={Highcharts} options={healthScoreChartOptions} />
                        )}
                    </Card>
                    <div className="assets-details">
                        <div className="assets-details-header">
                            <h3>Click on the Asset for Details</h3>
                            <Button type="primary" onClick={openCreateModal}>
                                Create new Asset
                            </Button>
                        </div>
                        <Row gutter={[16, 16]} className="details-list">
                            {assetList.map((asset, index) => (
                                <Col xs={8} md={4} key={`asset-${index}`}>
                                    <Card
                                        className="asset-detail"
                                        onClick={() => {
                                            setSelectedAsset(asset);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        {asset.name}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <AssetModal
                            visible={isModalOpen}
                            asset={selectedAsset}
                            onCancel={onModalCancel}
                            onSave={onModalSave}
                            onDelete={onModalDelete}
                        />
                        <CreateAssetModal
                            visible={isCreateModalOpen}
                            onSave={handleCreateAsset}
                            onCancel={onCreateCancel}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
