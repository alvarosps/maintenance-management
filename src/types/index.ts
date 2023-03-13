export interface Asset {
    id: number;
    name: string;
    model: string;
    healthscore: number;
    status: string;
  }
  
  export interface Company {
    id: number;
    name: string;
    unit: string;
    assets: Asset[];
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface ApiResponse {
    companies: Company[];
    users: User[];
  }
  