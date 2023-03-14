export type Asset = {
    id: number;
    assignedUserIds: number[];
    healthHistory: HealthHistory[];
    name: string;
    image: string;
    healthscore: number;
    status: string;
    sensors: string[];
    metrics: Metric[];
    specifications: {
        maxTemp: number;
        power: number;
        rpm: number;
    };
    unitId: number;
    companyId: number;
};

interface HealthHistory {
    status: string;
    timestamp: string;
}

interface Metric {
    timestamp: string;
    temperature: number;
    humidity: number;
    rpm: number;
}

export type User = {
    companyId: number;
    email: string;
    id: number;
    name: string;
    unitId: number;
};

export type Unit = {
    companyId: number;
    id: number;
    name: string;
};

export type Company = {
    id: number;
    name: string;
};
