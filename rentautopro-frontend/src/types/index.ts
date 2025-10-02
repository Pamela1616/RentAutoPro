// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'gestor' | 'cliente';
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status: 'disponible' | 'alquilado' | 'mantenimiento';
  current_km: number;
  fuel_type: string;
  daily_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Maintenance {
  id: string;
  vehicle_id: string;
  type: 'preventivo' | 'correctivo' | 'predictivo' | 'programado';
  description: string;
  cost: number;
  km_at_maintenance: number;
  scheduled_date: string;
  completed_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface MaintenanceAlert {
  id: string;
  vehicle_id: string;
  alert_type: 'km' | 'tiempo';
  threshold_value: number;
  last_alert_date: string | null;
  is_active: boolean;
  created_at: string;
  vehicle?: Vehicle;
}

export interface Client {
  id: string;
  full_name: string;
  document_id: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  vehicle_id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  start_km: number;
  end_km: number | null;
  total_cost: number;
  status: 'reservado' | 'activo' | 'completado' | 'cancelado';
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  client?: Client;
}

export interface FuelLog {
  id: string;
  vehicle_id: string;
  date: string;
  km: number;
  liters: number;
  cost: number;
  fuel_station: string;
  created_at: string;
  vehicle?: Vehicle;
}

export interface DashboardKPIs {
  vehicles: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
    utilization_rate: number;
  };
  rentals: {
    active: number;
    reserved: number;
    recent: Rental[];
  };
  clients: {
    total: number;
  };
  financials: {
    month_revenue: number;
    month_maintenance_cost: number;
    net_profit: number;
  };
  maintenance: {
    pending: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'admin' | 'gestor' | 'cliente';
}
