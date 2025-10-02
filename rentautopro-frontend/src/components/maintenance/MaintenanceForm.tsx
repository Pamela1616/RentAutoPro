import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '../../api/vehicles';
import type { Maintenance } from '../../types';

const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, 'Debe seleccionar un vehículo'),
  type: z.enum(['preventivo', 'correctivo', 'predictivo', 'programado']),
  description: z.string().min(1, 'La descripción es requerida'),
  cost: z.number().min(0, 'El costo debe ser positivo'),
  km_at_maintenance: z.number().min(0, 'El kilometraje debe ser positivo'),
  scheduled_date: z.string().min(1, 'La fecha programada es requerida'),
  completed_date: z.string().optional(),
  status: z.string().min(1, 'El estado es requerido'),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  maintenance?: Maintenance;
  onSubmit: (data: MaintenanceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  maintenance,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenance
      ? {
          vehicle_id: maintenance.vehicle_id,
          type: maintenance.type,
          description: maintenance.description,
          cost: maintenance.cost,
          km_at_maintenance: maintenance.km_at_maintenance,
          scheduled_date: maintenance.scheduled_date.split('T')[0],
          completed_date: maintenance.completed_date?.split('T')[0],
          status: maintenance.status,
        }
      : {
          type: 'preventivo',
          status: 'pendiente',
          cost: 0,
          km_at_maintenance: 0,
        },
  });

  // Obtener lista de vehículos
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await vehiclesApi.getAll({ per_page: 100 });
      return response.data;
    },
  });

  const vehicles = vehiclesData?.data || [];

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
            disabled={!!maintenance}
          >
            <option value="">Seleccione un vehículo...</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
              </option>
            ))}
          </select>
          {errors.vehicle_id && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicle_id.message}</p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Mantenimiento <span className="text-red-500">*</span>
          </label>
          <select
            {...register('type')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="preventivo">Preventivo</option>
            <option value="correctivo">Correctivo</option>
            <option value="predictivo">Predictivo</option>
            <option value="programado">Programado</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
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
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Detalle del mantenimiento realizado o a realizar..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Kilometraje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kilometraje <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('km_at_maintenance', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.km_at_maintenance && (
            <p className="mt-1 text-sm text-red-600">{errors.km_at_maintenance.message}</p>
          )}
        </div>

        {/* Costo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Costo (S/.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register('cost', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>}
        </div>

        {/* Fecha Programada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Programada <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('scheduled_date')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.scheduled_date && (
            <p className="mt-1 text-sm text-red-600">{errors.scheduled_date.message}</p>
          )}
        </div>

        {/* Fecha Completada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Completada <span className="text-gray-400">(Opcional)</span>
          </label>
          <input
            type="date"
            {...register('completed_date')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : maintenance ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
