import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalsApi } from '../api/rentals';
import { Plus, Edit, Trash2, Car, User, Calendar, DollarSign, FileText, CheckCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import RentalForm from '../components/rentals/RentalForm';
import type { Rental } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Rentals = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>();
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['rentals', page, filterStatus],
    queryFn: async () => {
      const response = await rentalsApi.getAll({ page, status: filterStatus });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: rentalsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
      setSelectedRental(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => rentalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
      setSelectedRental(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: rentalsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, end_km }: { id: string; end_km: number }) =>
      rentalsApi.complete(id, end_km),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleSubmit = async (formData: any) => {
    if (selectedRental) {
      await updateMutation.mutateAsync({ id: selectedRental.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (rental: Rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este alquiler?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleComplete = async (rental: Rental) => {
    const endKm = prompt(`Ingrese el kilometraje final (actual: ${rental.start_km} km):`);
    if (endKm && !isNaN(Number(endKm))) {
      const kmValue = Number(endKm);
      if (kmValue >= rental.start_km) {
        await completeMutation.mutateAsync({ id: rental.id, end_km: kmValue });
      } else {
        alert('El kilometraje final debe ser mayor o igual al inicial');
      }
    }
  };

 const handleDownloadPDF = async (id: string) => {
  try {
    const blob = await rentalsApi.generatePDF(id); // 👈 aquí ya es un Blob
    console.log("Blob recibido:", blob);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrato-alquiler-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert('Error al generar el PDF');
    console.error(error);
  }
};



  const getStatusBadge = (status: string) => {
    const badges = {
      reservado: 'bg-blue-100 text-blue-800',
      activo: 'bg-green-100 text-green-800',
      completado: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    const labels = {
      reservado: 'Reservado',
      activo: 'Activo',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  const rentals = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alquileres</h1>
          <p className="mt-1 text-gray-500">Gestión de alquileres de vehículos</p>
        </div>
        <button
          onClick={() => {
            setSelectedRental(undefined);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Alquiler</span>
        </button>
      </div>

      {/* Filtro por Estado */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Estado:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            title="Filtrar por estado"
          >
            <option value="">Todos</option>
            <option value="reservado">Reservado</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Cards de Alquileres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rentals.map((rental: Rental) => (
          <div key={rental.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Car size={20} className="text-primary-600" />
                  <h3 className="font-bold text-gray-900">
                    {rental.vehicle?.brand} {rental.vehicle?.model}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User size={16} className="text-gray-400" />
                  <span>{rental.client?.full_name}</span>
                </div>
              </div>
              {getStatusBadge(rental.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2 text-sm mb-1">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Inicio</span>
                </div>
                <p className="font-medium">{format(new Date(rental.start_date), 'dd MMM yyyy', { locale: es })}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm mb-1">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Fin</span>
                </div>
                <p className="font-medium">{format(new Date(rental.end_date), 'dd MMM yyyy', { locale: es })}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">KM Inicial</p>
                <p className="font-medium">{rental.start_km.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">KM Final</p>
                <p className="font-medium">
                  {rental.end_km ? `${rental.end_km.toLocaleString()} km` : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign size={20} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Costo Total</p>
                  <p className="text-lg font-bold text-gray-900">S/. {rental.total_cost}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEdit(rental)}
                className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-1"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>

              {rental.status === 'activo' && (
                <button
                  onClick={() => handleComplete(rental)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
                >
                  <CheckCircle size={16} />
                  <span>Completar</span>
                </button>
              )}

              <button
                onClick={() => handleDownloadPDF(rental.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                title="Descargar PDF"
              >
                <FileText size={16} />
                <span>PDF</span>
              </button>

              <button
                onClick={() => handleDelete(rental.id)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {rentals.length === 0 && (
        <div className="card text-center py-12">
          <Car size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alquileres</h3>
          <p className="text-gray-500">Comienza creando un nuevo alquiler</p>
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
          setSelectedRental(undefined);
        }}
        title={selectedRental ? 'Editar Alquiler' : 'Nuevo Alquiler'}
        size="lg"
      >
        <RentalForm
          rental={selectedRental}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedRental(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default Rentals;
