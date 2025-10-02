import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { Car, DollarSign, Wrench, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { data: kpisData, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const response = await dashboardApi.getKPIs();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const kpis = kpisData;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Resumen general del sistema RentAutoPro</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Vehículos Totales</p>
              <p className="text-4xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {kpis?.vehicles.total || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Car className="text-white" size={28} />
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-emerald-600 font-medium">
              {kpis?.vehicles.available || 0} disponibles
            </span>
          </div>
        </div>

        <div className="card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ingresos del Mes</p>
              <p className="text-4xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                ${(kpis?.financials.month_revenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="text-white" size={28} />
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            <span className="font-medium">Ganancia neta:</span> ${(kpis?.financials.net_profit || 0).toLocaleString()}
          </div>
        </div>

        <div className="card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Alquileres Activos</p>
              <p className="text-4xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                {kpis?.rentals.active || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="text-white" size={28} />
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-600 font-medium">
              {kpis?.rentals.reserved || 0} reservados
            </span>
          </div>
        </div>

        <div className="card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Mantenimientos Pendientes</p>
              <p className="text-4xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                {kpis?.maintenance.pending || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Wrench className="text-white" size={28} />
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-orange-600 font-medium">Requieren atención</span>
          </div>
        </div>
      </div>

      {/* Recent Rentals */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Alquileres Recientes</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        </div>
        {kpis?.rentals.recent && kpis.rentals.recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Costo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kpis.rentals.recent.map((rental: any) => (
                  <tr key={rental.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.client?.full_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.vehicle ? `${rental.vehicle.brand} ${rental.vehicle.model}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(rental.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        rental.status === 'activo' ? 'status-active' :
                        rental.status === 'reservado' ? 'status-pending' :
                        rental.status === 'completado' ? 'status-completed' :
                        'status-cancelled'
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${rental.total_cost?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay alquileres recientes</p>
        )}
      </div>

      {/* Fleet Utilization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Estado de la Flota</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disponibles</span>
              <span className="text-sm font-medium text-green-600">
                {kpis?.vehicles.available || 0} unidades
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alquilados</span>
              <span className="text-sm font-medium text-blue-600">
                {kpis?.vehicles.rented || 0} unidades
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En Mantenimiento</span>
              <span className="text-sm font-medium text-orange-600">
                {kpis?.vehicles.maintenance || 0} unidades
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Tasa de Utilización</span>
              <span className="text-lg font-bold text-primary-600">
                {kpis?.vehicles.utilization_rate || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Resumen Financiero</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ingresos del Mes</span>
              <span className="text-sm font-medium text-green-600">
                ${(kpis?.financials.month_revenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Costos de Mantenimiento</span>
              <span className="text-sm font-medium text-red-600">
                ${(kpis?.financials.month_maintenance_cost || 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Ganancia Neta</span>
              <span className="text-lg font-bold text-primary-600">
                ${(kpis?.financials.net_profit || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
