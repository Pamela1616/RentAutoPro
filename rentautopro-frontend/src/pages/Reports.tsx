import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Wrench, Car, Calendar } from 'lucide-react';

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [incomeYear, setIncomeYear] = useState(currentYear);
  const [incomeMonth, setIncomeMonth] = useState(currentMonth);
  const [maintenanceYear, setMaintenanceYear] = useState(currentYear);
  const [maintenanceMonth, setMaintenanceMonth] = useState(currentMonth);

  // Reporte de Ingresos
  const { data: incomeData, isLoading: incomeLoading } = useQuery({
    queryKey: ['reports', 'income', incomeYear, incomeMonth],
    queryFn: async () => {
      const response = await reportsApi.getIncome({ year: incomeYear, month: incomeMonth });
      return response.data;
    },
  });

  // Reporte de Costos de Mantenimiento
  const { data: maintenanceData, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['reports', 'maintenance', maintenanceYear, maintenanceMonth],
    queryFn: async () => {
      const response = await reportsApi.getMaintenanceCosts({ year: maintenanceYear, month: maintenanceMonth });
      return response.data;
    },
  });

  // Reporte de Disponibilidad de Flota
  const { data: fleetData, isLoading: fleetLoading } = useQuery({
    queryKey: ['reports', 'fleet'],
    queryFn: async () => {
      const response = await reportsApi.getFleetAvailability();
      return response.data;
    },
  });

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="mt-1 text-gray-500">Análisis financiero y operativo de la flota</p>
      </div>

      {/* Reporte de Ingresos */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ingresos por Alquileres</h2>
              <p className="text-sm text-gray-500">Análisis de ingresos mensuales</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={incomeMonth}
              onChange={(e) => setIncomeMonth(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              title="Seleccionar mes"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              value={incomeYear}
              onChange={(e) => setIncomeYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              title="Seleccionar año"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {incomeLoading ? (
          <div className="flex justify-center items-center h-64">Cargando...</div>
        ) : incomeData?.data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-700">S/. {incomeData.data.total_income.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-1">Total Alquileres</p>
                <p className="text-2xl font-bold text-blue-700">{incomeData.data.total_rentals}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 mb-1">Ingreso Promedio</p>
                <p className="text-2xl font-bold text-purple-700">
                  S/. {(incomeData.data.total_income / (incomeData.data.total_rentals || 1)).toFixed(2)}
                </p>
              </div>
            </div>

            {incomeData.data.rentals && incomeData.data.rentals.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Ingresos por Día</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incomeData.data.rentals.map((r: any) => ({
                    fecha: new Date(r.start_date).toLocaleDateString(),
                    monto: r.total_cost,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="monto" fill="#10b981" name="Ingresos (S/.)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
        )}
      </div>

      {/* Reporte de Costos de Mantenimiento */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench size={24} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Costos de Mantenimiento</h2>
              <p className="text-sm text-gray-500">Análisis de gastos en mantenimiento</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={maintenanceMonth}
              onChange={(e) => setMaintenanceMonth(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              title="Seleccionar mes"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              value={maintenanceYear}
              onChange={(e) => setMaintenanceYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              title="Seleccionar año"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {maintenanceLoading ? (
          <div className="flex justify-center items-center h-64">Cargando...</div>
        ) : maintenanceData?.data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-600 mb-1">Costo Total</p>
                <p className="text-2xl font-bold text-red-700">S/. {maintenanceData.data.total_cost.toFixed(2)}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-600 mb-1">Total Mantenimientos</p>
                <p className="text-2xl font-bold text-orange-700">{maintenanceData.data.total_maintenances}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-600 mb-1">Costo Promedio</p>
                <p className="text-2xl font-bold text-yellow-700">
                  S/. {(maintenanceData.data.total_cost / (maintenanceData.data.total_maintenances || 1)).toFixed(2)}
                </p>
              </div>
            </div>

            {maintenanceData.data.by_type && Object.keys(maintenanceData.data.by_type).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Costos por Tipo de Mantenimiento</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(maintenanceData.data.by_type).map(([type, cost]) => ({
                    tipo: type,
                    costo: cost,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="costo" fill="#f59e0b" name="Costo (S/.)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
        )}
      </div>

      {/* Reporte de Disponibilidad de Flota */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Car size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Disponibilidad de Flota</h2>
            <p className="text-sm text-gray-500">Estado actual de los vehículos</p>
          </div>
        </div>

        {fleetLoading ? (
          <div className="flex justify-center items-center h-64">Cargando...</div>
        ) : fleetData?.data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Distribución por Estado</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Disponibles', value: fleetData.data.available },
                      { name: 'Alquilados', value: fleetData.data.rented },
                      { name: 'Mantenimiento', value: fleetData.data.maintenance },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600">Vehículos Disponibles</p>
                    <p className="text-2xl font-bold text-green-700">{fleetData.data.available}</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Car size={32} className="text-green-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600">Vehículos Alquilados</p>
                    <p className="text-2xl font-bold text-blue-700">{fleetData.data.rented}</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={32} className="text-blue-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-yellow-600">En Mantenimiento</p>
                    <p className="text-2xl font-bold text-yellow-700">{fleetData.data.maintenance}</p>
                  </div>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Wrench size={32} className="text-yellow-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total de Vehículos</p>
                    <p className="text-2xl font-bold text-gray-900">{fleetData.data.total}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Tasa de utilización: {((fleetData.data.rented / fleetData.data.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
