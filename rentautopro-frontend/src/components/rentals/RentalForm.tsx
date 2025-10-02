import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '../../api/vehicles';
import { clientsApi } from '../../api/clients';
import type { Rental } from '../../types';

const rentalSchema = z
  .object({
    vehicle_id: z.string().min(1, 'Debe seleccionar un vehículo'),
    client_id: z.string().min(1, 'Debe seleccionar un cliente'),
    start_date: z.string().min(1, 'La fecha de inicio es requerida'),
    end_date: z.string().min(1, 'La fecha de fin es requerida'),
    start_km: z.number().min(0, 'El kilometraje inicial debe ser positivo'),
    end_km: z.number().min(0, 'El kilometraje final debe ser positivo').optional(),
    total_cost: z.number().min(0, 'El costo total debe ser positivo'),
    status: z.enum(['reservado', 'activo', 'completado', 'cancelado']),
  })
  .refine((data) => !data.end_km || data.end_km >= data.start_km, {
    message: 'El kilometraje final debe ser mayor o igual al inicial',
    path: ['end_km'],
  });

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  rental?: Rental;
  onSubmit: (data: RentalFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RentalForm: React.FC<RentalFormProps> = ({ rental, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: rental
      ? {
          vehicle_id: rental.vehicle_id,
          client_id: rental.client_id,
          start_date: rental.start_date.split('T')[0],
          end_date: rental.end_date.split('T')[0],
          start_km: rental.start_km,
          end_km: rental.end_km || undefined,
          total_cost: rental.total_cost,
          status: rental.status,
        }
      : {
          status: 'reservado',
          start_km: 0,
          total_cost: 0,
        },
  });

  // Obtener lista de vehículos disponibles
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: async () => {
      const response = await vehiclesApi.getAll({ per_page: 100, status: 'disponible' });
      return response.data;
    },
  });

  // Obtener lista de clientes
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.getAll({ per_page: 100 });
      return response.data;
    },
  });

  const vehicles = vehiclesData?.data || [];
  const clients = clientsData?.data || [];
  const selectedVehicleId = watch('vehicle_id');
  const startDate = watch('start_date');
  const endDate = watch('end_date');

  // Calcular costo total automáticamente
  React.useEffect(() => {
    if (selectedVehicleId && startDate && endDate) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (vehicle) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (days > 0) {
          const cost = days * vehicle.daily_rate;
          setValue('total_cost', cost);
        }
      }
    }
  }, [selectedVehicleId, startDate, endDate, vehicles, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehículo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehículo <span className="text-red-500">*</span>
          </label>
          <select
            {...register('vehicle_id')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={!!rental}
          >
            <option value="">Seleccione un vehículo...</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.license_plate} (S/. {vehicle.daily_rate}
                /día)
              </option>
            ))}
          </select>
          {errors.vehicle_id && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicle_id.message}</p>
          )}
        </div>

        {/* Cliente */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente <span className="text-red-500">*</span>
          </label>
          <select
            {...register('client_id')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccione un cliente...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name} - {client.document_id}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
          )}
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('start_date')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
          )}
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Fin <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('end_date')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>}
        </div>

        {/* Kilometraje Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kilometraje Inicial <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('start_km', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.start_km && <p className="mt-1 text-sm text-red-600">{errors.start_km.message}</p>}
        </div>

        {/* Kilometraje Final */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kilometraje Final <span className="text-gray-400">(Opcional)</span>
          </label>
          <input
            type="number"
            {...register('end_km', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.end_km && <p className="mt-1 text-sm text-red-600">{errors.end_km.message}</p>}
        </div>

        {/* Costo Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Costo Total (S/.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register('total_cost', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
            placeholder="0.00"
            readOnly
          />
          {errors.total_cost && (
            <p className="mt-1 text-sm text-red-600">{errors.total_cost.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Calculado automáticamente según los días</p>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="reservado">Reservado</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : rental ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default RentalForm;
