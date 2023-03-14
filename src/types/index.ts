export type Asset = {
    id: number;
    assignedUserIds: number[];
    healthHistory: HealthHistory[];
    name: string;
    image: string;
    healthscore: number;
    status: string;
    metrics: Metric[];
    specifications: {
        maxTemp: number;
        power: number;
        rpm: number;
    };
    unitId: number;
    companyId: number;
};

type HealthHistory = {
    status: string;
    timestamp: string;
};

type Metric = {
    timestamp: string;
    temperature: number;
    humidity: number;
    rpm: number;
};

type AssetsApiResponse = {
    assets: Asset[];
};
