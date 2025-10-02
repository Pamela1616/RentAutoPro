# 🚀 RentAutoPro - Guía de Inicio Rápido

## ✅ Checklist de Configuración

### 1. Configurar Supabase (5 minutos)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. En el **SQL Editor**, ejecuta el archivo `database-schema.sql`
4. Ve a **Settings > API** y copia:
   - `Project URL` → será tu `SUPABASE_URL`
   - `anon/public key` → será tu `SUPABASE_KEY` 
   - `service_role key` → será tu `SUPABASE_SECRET`
5. En **Settings > Database**, copia la cadena de conexión PostgreSQL

### 2. Configurar Backend (5 minutos)

```powershell
# En PowerShell, navegar al directorio del backend
cd rentautopro-api

# Instalar dependencias
composer install

# Configurar .env
# IMPORTANTE: Edita el archivo .env con tus credenciales de Supabase

# Ejecutar migraciones de Laravel
php artisan migrate

# Iniciar servidor
php artisan serve
```

✅ Backend listo en: `http://localhost:8000`

### 3. Configurar Frontend (3 minutos)

```powershell
# En otra terminal PowerShell, navegar al directorio del frontend
cd rentautopro-frontend

# Instalar dependencias
npm install

# Configurar .env
# IMPORTANTE: Edita el archivo .env con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

✅ Frontend listo en: `http://localhost:5173`

## 🔑 Crear Usuario Administrador

### Opción 1: Usar la API
```powershell
# Hacer POST request al endpoint de registro
# Usar Postman, Insomnia o curl:

curl -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@rentautopro.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "admin"
  }'
```

### Opción 2: Desde Supabase Dashboard
1. Ve a **Authentication > Users**
2. Crea un nuevo usuario
3. Usa las credenciales para hacer login

## 📋 Variables de Entorno

### Backend (.env)
```env
APP_NAME=RentAutoPro
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=db.XXXX.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=TU_PASSWORD_SUPABASE
SUPABASE_URL=https://XXXX.supabase.co
SUPABASE_KEY=TU_ANON_KEY
SUPABASE_SECRET=TU_SERVICE_ROLE_KEY
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## 🧪 Probar la Aplicación

1. **Accede al frontend**: `http://localhost:5173`
2. **Inicia sesión** con el usuario creado
3. **Explora el Dashboard**
4. **Prueba las funcionalidades**:
   - Gestión de vehículos
   - Registro de mantenimientos
   - Gestión de clientes
   - Creación de alquileres
   - Visualización de reportes

## 📚 Endpoints de API Disponibles

### Autenticación
- `POST /api/v1/register` - Registrar usuario
- `POST /api/v1/login` - Iniciar sesión
- `POST /api/v1/logout` - Cerrar sesión
- `GET /api/v1/me` - Obtener usuario actual

### Vehículos
- `GET /api/v1/vehicles` - Listar vehículos
- `POST /api/v1/vehicles` - Crear vehículo
- `GET /api/v1/vehicles/{id}` - Ver vehículo
- `PUT /api/v1/vehicles/{id}` - Actualizar vehículo
- `DELETE /api/v1/vehicles/{id}` - Eliminar vehículo
- `GET /api/v1/vehicles/{id}/history` - Historial del vehículo

### Mantenimientos
- `GET /api/v1/maintenances` - Listar mantenimientos
- `POST /api/v1/maintenances` - Crear mantenimiento
- `GET /api/v1/maintenances/{id}` - Ver mantenimiento
- `PUT /api/v1/maintenances/{id}` - Actualizar mantenimiento
- `DELETE /api/v1/maintenances/{id}` - Eliminar mantenimiento

### Clientes
- `GET /api/v1/clients` - Listar clientes
- `POST /api/v1/clients` - Crear cliente
- `GET /api/v1/clients/{id}` - Ver cliente
- `PUT /api/v1/clients/{id}` - Actualizar cliente
- `DELETE /api/v1/clients/{id}` - Eliminar cliente

### Alquileres
- `GET /api/v1/rentals` - Listar alquileres
- `POST /api/v1/rentals` - Crear alquiler
- `GET /api/v1/rentals/{id}` - Ver alquiler
- `PUT /api/v1/rentals/{id}` - Actualizar alquiler
- `DELETE /api/v1/rentals/{id}` - Eliminar alquiler
- `POST /api/v1/rentals/{id}/complete` - Completar alquiler
- `POST /api/v1/rentals/{id}/pdf` - Generar PDF

### Dashboard & Reportes
- `GET /api/v1/dashboard/kpis` - KPIs del dashboard
- `GET /api/v1/reports/income` - Reporte de ingresos
- `GET /api/v1/reports/maintenance-costs` - Costos de mantenimiento
- `GET /api/v1/reports/fleet-availability` - Disponibilidad de flota

## 🔧 Troubleshooting

### Error de CORS
**Problema**: El frontend no puede comunicarse con el backend

**Solución**: 
1. Verifica que `FRONTEND_URL` en `.env` del backend sea `http://localhost:5173`
2. Verifica que `config/cors.php` tenga configurado correctamente el URL

### Error 401 Unauthorized
**Problema**: No se puede acceder a endpoints protegidos

**Solución**:
1. Verifica que el token se guarda correctamente en localStorage
2. Verifica que Sanctum está configurado correctamente
3. Intenta hacer logout y login nuevamente

### Error de Conexión a Base de Datos
**Problema**: Laravel no puede conectarse a Supabase

**Solución**:
1. Verifica las credenciales en `.env`
2. Verifica que el proyecto de Supabase esté activo
3. Verifica que el firewall no bloquee la conexión

### Frontend no carga estilos
**Problema**: La aplicación se ve sin estilos

**Solución**:
1. Verifica que Tailwind CSS está instalado: `npm list tailwindcss`
2. Verifica que `tailwind.config.js` existe
3. Reinicia el servidor de desarrollo: `npm run dev`

## 📊 Estructura de Datos

### Vehículo
```json
{
  "id": "uuid",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2023,
  "license_plate": "ABC-123",
  "status": "disponible",
  "current_km": 5000,
  "fuel_type": "Gasolina",
  "daily_rate": 45.00
}
```

### Cliente
```json
{
  "id": "uuid",
  "full_name": "Juan Pérez",
  "document_id": "12345678",
  "phone": "+51987654321",
  "email": "juan@example.com",
  "address": "Av. Principal 123"
}
```

### Alquiler
```json
{
  "id": "uuid",
  "vehicle_id": "uuid",
  "client_id": "uuid",
  "start_date": "2025-01-01",
  "end_date": "2025-01-07",
  "start_km": 5000,
  "end_km": 5500,
  "total_cost": 315.00,
  "status": "activo"
}
```

## 🎯 Próximos Pasos

1. **Personalizar el sistema** según tus necesidades
2. **Agregar más funcionalidades** (notificaciones, reportes avanzados, etc.)
3. **Implementar testing** (PHPUnit para backend, Jest para frontend)
4. **Optimizar para producción**
5. **Desplegar en la nube** (Vercel para frontend, Railway/Heroku para backend)

## 📞 Soporte

Si tienes algún problema:
1. Revisa la documentación completa en `README.md`
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que las variables de entorno estén correctamente configuradas
4. Revisa los logs de Laravel: `storage/logs/laravel.log`
5. Revisa la consola del navegador para errores del frontend

## ✨ Features Implementadas

- ✅ Autenticación con Supabase + Sanctum
- ✅ Gestión completa de vehículos (CRUD)
- ✅ Gestión de mantenimientos
- ✅ Gestión de clientes
- ✅ Sistema de alquileres con cálculo automático de costos
- ✅ Dashboard con KPIs en tiempo real
- ✅ Reportes de ingresos y costos
- ✅ Generación de PDFs para contratos
- ✅ Interfaz responsive con Tailwind CSS
- ✅ API RESTful documentada
- ✅ Sistema de roles y permisos
- ✅ Validaciones en backend y frontend

---

**¡Listo para usar RentAutoPro! 🚗💨**
