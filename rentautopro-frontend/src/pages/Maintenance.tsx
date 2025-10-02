import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenancesApi } from '../api/maintenances';
import { vehiclesApi } from '../api/vehicles';
import { Plus, Edit, Trash2, Wrench, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import type { Maintenance } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MaintenancePage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | undefined>();
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['maintenances', page, filterType, filterStatus],
    queryFn: async () => {
      const response = await maintenancesApi.getAll({ page, type: filterType, status: filterStatus });
      return response.data;
    },
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await vehiclesApi.getAll({ per_page: 100 });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: maintenancesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setIsModalOpen(false);
      setSelectedMaintenance(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => maintenancesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setIsModalOpen(false);
      setSelectedMaintenance(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: maintenancesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
    },
  });

  const handleSubmit = async (formData: any) => {
    if (selectedMaintenance) {
      await updateMutation.mutateAsync({ id: selectedMaintenance.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este mantenimiento?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      preventivo: 'bg-blue-100 text-blue-800',
      correctivo: 'bg-red-100 text-red-800',
      predictivo: 'bg-purple-100 text-purple-800',
      programado: 'bg-green-100 text-green-800',
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  const maintenances = data?.data || [];
  const vehicles = vehiclesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mantenimientos</h1>
          <p className="mt-1 text-gray-500">Gestión de mantenimientos de la flota</p>
        </div>
        <button
          onClick={() => {
            setSelectedMaintenance(undefined);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Mantenimiento</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              title="Boton"
            >
              <option value="">Todos los tipos</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
              <option value="predictivo">Predictivo</option>
              <option value="programado">Programado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              title='Boton'
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Mantenimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {maintenances.map((maintenance: Maintenance) => {
          const vehicle = vehicles.find((v) => v.id === maintenance.vehicle_id);
          return (
            <div key={maintenance.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Wrench size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehículo N/A'}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle?.license_plate}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadge(maintenance.type)}`}>
                  {maintenance.type}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-700">{maintenance.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Programada</p>
                      <p className="font-medium">{format(new Date(maintenance.scheduled_date), 'dd MMM yyyy', { locale: es })}</p>
                    </div>
                  </div>

                  {maintenance.completed_date && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle size={16} className="text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Completada</p>
                        <p className="font-medium">{format(new Date(maintenance.completed_date), 'dd MMM yyyy', { locale: es })}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Costo</p>
                      <p className="font-medium">S/. {maintenance.cost}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Kilometraje</p>
                      <p className="font-medium">{maintenance.km_at_maintenance.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {getStatusBadge(maintenance.status)}
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(maintenance)}
                  className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-1"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(maintenance.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {maintenances.length === 0 && (
        <div className="card text-center py-12">
          <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay mantenimientos</h3>
          <p className="text-gray-500">Comienza agregando un mantenimiento</p>
        </div>
      )}

      {/* Paginación */}
      {data && data.last_page > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Página {data.current_page} de {data.last_page}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
              disabled={page === data.last_page}
              className="btn-secondary disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMaintenance(undefined);
        }}
        title={selectedMaintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
        size="lg"
      >
        <MaintenanceForm
          maintenance={selectedMaintenance}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMaintenance(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default MaintenancePage;
