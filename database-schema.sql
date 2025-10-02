-- RentAutoPro - Script de Base de Datos para Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================
-- TABLA: user_profiles
-- Información adicional de usuarios vinculada con Supabase Auth
-- =======================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'gestor', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- TABLA: vehicles
-- Gestión de vehículos de la flota
-- =======================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'alquilado', 'mantenimiento')),
  current_km INTEGER DEFAULT 0,
  fuel_type VARCHAR(20),
  daily_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- TABLA: clients
-- Gestión de clientes
-- =======================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(200) NOT NULL,
  document_id VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- TABLA: rentals
-- Gestión de alquileres
-- =======================
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id),
  client_id UUID REFERENCES public.clients(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_km INTEGER,
  end_km INTEGER,
  total_cost DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'reservado' CHECK (status IN ('reservado', 'activo', 'completado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- TABLA: maintenances
-- Gestión de mantenimientos de vehículos
-- =======================
CREATE TABLE IF NOT EXISTS public.maintenances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('preventivo', 'correctivo', 'predictivo', 'programado')),
  description TEXT,
  cost DECIMAL(10,2),
  km_at_maintenance INTEGER,
  scheduled_date DATE,
  completed_date DATE,
  status VARCHAR(20) DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- TABLA: maintenance_alerts
-- Alertas de mantenimiento para vehículos
-- =======================
CREATE TABLE IF NOT EXISTS public.maintenance_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) CHECK (alert_type IN ('km', 'tiempo')),
  threshold_value INTEGER,
  last_alert_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- TABLA: fuel_logs
-- Registro de carga de combustible
-- =======================
CREATE TABLE IF NOT EXISTS public.fuel_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  km INTEGER NOT NULL,
  liters DECIMAL(10,2),
  cost DECIMAL(10,2),
  fuel_station VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- ÍNDICES para mejorar el rendimiento
-- =======================
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON public.vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_rentals_vehicle_id ON public.rentals(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_rentals_client_id ON public.rentals(client_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON public.rentals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_maintenances_vehicle_id ON public.maintenances(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_status ON public.maintenances(status);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_vehicle_id ON public.fuel_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_date ON public.fuel_logs(date);

-- =======================
-- FUNCIONES: Actualizar timestamp automáticamente
-- =======================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenances_updated_at BEFORE UPDATE ON public.maintenances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- ROW LEVEL SECURITY (RLS)
-- Habilitar seguridad a nivel de fila
-- =======================
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =======================
-- POLÍTICAS DE SEGURIDAD
-- =======================

-- Política para vehículos: Admins y gestores pueden ver y editar
CREATE POLICY "Admins y gestores pueden gestionar vehículos" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política para vehículos: Clientes solo pueden ver
CREATE POLICY "Clientes pueden ver vehículos" ON public.vehicles
  FOR SELECT USING (true);

-- Política para mantenimientos: Admins y gestores pueden gestionar
CREATE POLICY "Admins y gestores pueden gestionar mantenimientos" ON public.maintenances
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política para alertas: Admins y gestores pueden gestionar
CREATE POLICY "Admins y gestores pueden gestionar alertas" ON public.maintenance_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política para clientes: Admins y gestores pueden gestionar
CREATE POLICY "Admins y gestores pueden gestionar clientes" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política para alquileres: Admins y gestores pueden gestionar todos
CREATE POLICY "Admins y gestores pueden gestionar alquileres" ON public.rentals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política para fuel logs: Admins y gestores pueden gestionar
CREATE POLICY "Admins y gestores pueden gestionar fuel logs" ON public.fuel_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política para perfiles de usuario
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins pueden gestionar todos los perfiles" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =======================
-- DATOS DE PRUEBA (Opcional)
-- Descomentar para insertar datos de ejemplo
-- =======================

-- Vehículos de prueba
-- INSERT INTO public.vehicles (brand, model, year, license_plate, status, current_km, fuel_type, daily_rate) VALUES
-- ('Toyota', 'Corolla', 2023, 'ABC-123', 'disponible', 5000, 'Gasolina', 45.00),
-- ('Honda', 'Civic', 2022, 'DEF-456', 'disponible', 12000, 'Gasolina', 50.00),
-- ('Mazda', 'CX-5', 2023, 'GHI-789', 'alquilado', 8000, 'Diesel', 65.00);

-- Clientes de prueba
-- INSERT INTO public.clients (full_name, document_id, phone, email, address) VALUES
-- ('Juan Pérez', '12345678', '+51987654321', 'juan@example.com', 'Av. Principal 123'),
-- ('María García', '87654321', '+51912345678', 'maria@example.com', 'Jr. Secundaria 456');

-- =======================
-- VISTA: Resumen de vehículos
-- =======================
CREATE OR REPLACE VIEW public.vehicles_summary AS
SELECT 
  v.id,
  v.brand,
  v.model,
  v.year,
  v.license_plate,
  v.status,
  v.current_km,
  v.daily_rate,
  COUNT(DISTINCT r.id) as total_rentals,
  COUNT(DISTINCT m.id) as total_maintenances,
  COALESCE(SUM(r.total_cost), 0) as total_revenue
FROM public.vehicles v
LEFT JOIN public.rentals r ON v.id = r.vehicle_id
LEFT JOIN public.maintenances m ON v.id = m.vehicle_id
GROUP BY v.id;

-- =======================
-- Script completado exitosamente
-- =======================
COMMENT ON SCHEMA public IS 'RentAutoPro Database Schema - Version 1.0';
