import React, { useCallback, useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsAnnotations from 'highcharts/modules/annotations';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { Card, Col, Row, Spin } from 'antd';
import { Asset } from '../../types';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import './Dashboard.scss';
import AssetModal from '../../components/AssetModal/AssetModal';
import { assetListState, pagetTitleState } from '../../recoil/atoms';
import { getAssets } from '../../api';

highchartsMore(Highcharts);
highchartsAnnotations(Highcharts);
highchartsAccessibility(Highcharts);

const Dashboard = () => {
    const setPageTitle = useSetRecoilState(pagetTitleState);

    useEffect(() => {
        setPageTitle('Maintenance Management Dashboard');
    });

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

    const onModalSave = useCallback((updatedAsset: Asset) => {
        setAssetList((oldAssetList) =>
            oldAssetList.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset)),
        );
        setSelectedAsset(updatedAsset);
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
                        <h3>Click on the Asset for Details</h3>
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
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
