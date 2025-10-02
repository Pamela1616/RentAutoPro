import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vehicle } from '../../types';

const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
  year: z.number().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  license_plate: z.string().min(1, 'La placa es requerida'),
  fuel_type: z.string().min(1, 'El tipo de combustible es requerido'),
  current_km: z.number().min(0, 'El kilometraje debe ser positivo'),
  daily_rate: z.number().min(0, 'La tarifa debe ser positiva'),
  status: z.enum(['disponible', 'alquilado', 'mantenimiento']),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          license_plate: vehicle.license_plate,
          fuel_type: vehicle.fuel_type,
          current_km: vehicle.current_km,
          daily_rate: vehicle.daily_rate,
          status: vehicle.status,
        }
      : {
          status: 'disponible',
          current_km: 0,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('brand')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Toyota, Honda, etc."
          />
          {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('model')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Corolla, Civic, etc."
          />
          {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>}
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="2024"
          />
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
        </div>

        {/* Placa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('license_plate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="ABC-123"
          />
          {errors.license_plate && (
            <p className="mt-1 text-sm text-red-600">{errors.license_plate.message}</p>
          )}
        </div>

        {/* Tipo de Combustible */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Combustible <span className="text-red-500">*</span>
          </label>
          <select
            {...register('fuel_type')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccione...</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Eléctrico">Eléctrico</option>
            <option value="Híbrido">Híbrido</option>
            <option value="GLP">GLP</option>
          </select>
          {errors.fuel_type && (
            <p className="mt-1 text-sm text-red-600">{errors.fuel_type.message}</p>
          )}
        </div>

        {/* Kilometraje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kilometraje Actual <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('current_km', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.current_km && (
            <p className="mt-1 text-sm text-red-600">{errors.current_km.message}</p>
          )}
        </div>

        {/* Tarifa Diaria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tarifa Diaria (S/.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register('daily_rate', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.daily_rate && (
            <p className="mt-1 text-sm text-red-600">{errors.daily_rate.message}</p>
          )}
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
            <option value="disponible">Disponible</option>
            <option value="alquilado">Alquilado</option>
            <option value="mantenimiento">Mantenimiento</option>
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
          {isLoading ? 'Guardando...' : vehicle ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
