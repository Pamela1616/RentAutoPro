<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrato de Alquiler</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin-bottom: 5px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            background-color: #2563eb;
            color: white;
            padding: 8px;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .label {
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>RentAutoPro</h1>
        <p>Contrato de Alquiler de Vehículo</p>
        <p>No. {{ $rental->id }}</p>
    </div>

    <div class="section">
        <div class="section-title">Información del Cliente</div>
        <div class="info-row">
            <span class="label">Nombre Completo:</span>
            <span>{{ $client->full_name }}</span>
        </div>
        <div class="info-row">
            <span class="label">Documento:</span>
            <span>{{ $client->document_id }}</span>
        </div>
        <div class="info-row">
            <span class="label">Teléfono:</span>
            <span>{{ $client->phone }}</span>
        </div>
        <div class="info-row">
            <span class="label">Email:</span>
            <span>{{ $client->email }}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Información del Vehículo</div>
        <div class="info-row">
            <span class="label">Marca y Modelo:</span>
            <span>{{ $vehicle->brand }} {{ $vehicle->model }}</span>
        </div>
        <div class="info-row">
            <span class="label">Año:</span>
            <span>{{ $vehicle->year }}</span>
        </div>
        <div class="info-row">
            <span class="label">Placa:</span>
            <span>{{ $vehicle->license_plate }}</span>
        </div>
        <div class="info-row">
            <span class="label">Kilometraje Inicial:</span>
            <span>{{ $rental->start_km }} km</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Detalles del Alquiler</div>
        <div class="info-row">
            <span class="label">Fecha de Inicio:</span>
            <span>{{ $rental->start_date->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
            <span class="label">Fecha de Fin:</span>
            <span>{{ $rental->end_date->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
            <span class="label">Duración:</span>
            <span>{{ $rental->start_date->diffInDays($rental->end_date) + 1 }} días</span>
        </div>
        <div class="info-row">
            <span class="label">Tarifa Diaria:</span>
            <span>${{ number_format($vehicle->daily_rate, 2) }}</span>
        </div>
        <div class="info-row">
            <span class="label">Costo Total:</span>
            <span style="font-size: 18px; font-weight: bold;">${{ number_format($rental->total_cost, 2) }}</span>
        </div>
    </div>

    <div class="footer">
        <p>Generado el {{ $generated_at }}</p>
        <p>Este documento es un contrato vinculante entre RentAutoPro y el cliente.</p>
    </div>
</body>
</html>
