import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehicles';
import { Plus, Edit, Trash2, Eye, History } from 'lucide-react';
import Modal from '../components/common/Modal';
import VehicleForm from '../components/vehicles/VehicleForm';
import type { Vehicle } from '../types';

const Vehicles = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page],
    queryFn: async () => {
      const response = await vehiclesApi.getAll({ page });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: vehiclesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setSelectedVehicle(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => vehiclesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setSelectedVehicle(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vehiclesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleSubmit = async (formData: any) => {
    if (selectedVehicle) {
      await updateMutation.mutateAsync({ id: selectedVehicle.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este vehículo?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setDetailVehicle(vehicle);
    setViewMode('detail');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      disponible: 'bg-green-100 text-green-800',
      alquilado: 'bg-blue-100 text-blue-800',
      mantenimiento: 'bg-yellow-100 text-yellow-800',
    };
    const labels = {
      disponible: 'Disponible',
      alquilado: 'Alquilado',
      mantenimiento: 'Mantenimiento',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 bg-blue-100">Cargando...</div>;
  }

  const vehicles = data?.data || [];

  if (viewMode === 'detail' && detailVehicle) {
    return (
      <div className="space-y-6 min-h-screen p-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => setViewMode('list')} className="btn-secondary bg-blue-200 text-blue-800">
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-blue-900">
            {detailVehicle.brand} {detailVehicle.model}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card  border border-blue-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Información del Vehículo</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">Marca</p>
                <p className="font-semibold text-blue-900">{detailVehicle.brand}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Modelo</p>
                <p className="font-semibold text-blue-900">{detailVehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Año</p>
                <p className="font-semibold text-blue-900">{detailVehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Placa</p>
                <p className="font-semibold text-blue-900">{detailVehicle.license_plate}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Combustible</p>
                <p className="font-semibold text-blue-900">{detailVehicle.fuel_type}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Kilometraje</p>
                <p className="font-semibold text-blue-900">{detailVehicle.current_km.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Tarifa Diaria</p>
                <p className="font-semibold text-blue-900">S/. {detailVehicle.daily_rate}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Estado</p>
                {getStatusBadge(detailVehicle.status)}
              </div>
            </div>
          </div>

          <div className="card bg-blue-50 border border-blue-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Acciones</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleEdit(detailVehicle)}
                className="w-full btn-primary flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit size={18} />
                <span>Editar Vehículo</span>
              </button>
              <button
                onClick={() => handleDelete(detailVehicle.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Eliminar Vehículo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-blue-50 border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <History size={24} />
            <span>Historial del Vehículo</span>
          </h2>
          <p className="text-blue-600">
            Aquí se mostrará el historial de mantenimientos, alquileres y registros de combustible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-blue-100 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Vehículos</h1>
          <p className="mt-1 text-blue-600">Gestión de la flota de vehículos</p>
        </div>
        <button
          onClick={() => {
            setSelectedVehicle(undefined);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} />
          <span>Nuevo Vehículo</span>
        </button>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Combustible
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Kilometraje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Tarifa/Día
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {vehicles.map((vehicle: Vehicle) => (
                <tr key={vehicle.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-900">
                      {vehicle.brand} {vehicle.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                    {vehicle.license_plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600">{vehicle.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                    {vehicle.fuel_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                    {vehicle.current_km.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-semibold">
                    S/. {vehicle.daily_rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(vehicle.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="text-blue-700 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-blue-200">
            <div className="text-sm text-blue-600">
              Página {data.current_page} de {data.last_page}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50 bg-blue-200 text-blue-800"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                disabled={page === data.last_page}
                className="btn-secondary disabled:opacity-50 bg-blue-200 text-blue-800"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(undefined);
        }}
        title={selectedVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        size="lg"
      >
        <VehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedVehicle(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default Vehicles;
