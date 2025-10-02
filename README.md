# RentAutoPro - Sistema de Gestión de Alquiler de Vehículos

Sistema completo de gestión de alquiler de vehículos desarrollado con Laravel 12 (Backend) y React 19.1 con TypeScript (Frontend).

## 🚀 Tecnologías

### Backend
- Laravel 12
- PHP 8.2+
- PostgreSQL (Supabase)
- Sanctum (Autenticación)
- DomPDF (Generación de PDFs)

### Frontend
- React 19.1
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router DOM
- Axios

## 📋 Requisitos Previos

- PHP >= 8.2
- Composer
- Node.js >= 18
- PostgreSQL o cuenta en Supabase
- Git

## 🛠️ Configuración del Proyecto

### 1. Configuración de Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. En el SQL Editor, ejecutar el script de creación de base de datos ubicado en `/database/supabase-schema.sql`
4. Obtener las credenciales del proyecto:
   - Project URL
   - Anon/Public Key
   - Service Role Key

### 2. Backend (Laravel)

```bash
# Navegar a la carpeta del backend
cd rentautopro-api

# Instalar dependencias de PHP
composer install

# Copiar archivo de entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Configurar variables de entorno en .env
# Editar con tus credenciales de Supabase:
DB_CONNECTION=pgsql
DB_HOST=db.XXXX.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=tu_password_supabase

SUPABASE_URL=https://XXXX.supabase.co
SUPABASE_KEY=tu_anon_key
SUPABASE_SECRET=tu_service_role_key

FRONTEND_URL=http://localhost:5173

# Ejecutar migraciones
php artisan migrate

# Publicar configuración de Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Iniciar servidor de desarrollo
php artisan serve
# Backend estará disponible en http://localhost:8000
```

### 3. Frontend (React)

```bash
# Navegar a la carpeta del frontend
cd rentautopro-frontend

# Instalar dependencias de Node
npm install

# Copiar archivo de entorno
cp .env.example .env

# Configurar variables de entorno en .env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key

# Iniciar servidor de desarrollo
npm run dev
# Frontend estará disponible en http://localhost:5173
```

## 📚 Estructura del Proyecto

### Backend
```
rentautopro-api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php
│   │           ├── VehicleController.php
│   │           ├── MaintenanceController.php
│   │           ├── ClientController.php
│   │           ├── RentalController.php
│   │           ├── DashboardController.php
│   │           └── ReportController.php
│   ├── Models/
│   │   ├── Vehicle.php
│   │   ├── Maintenance.php
│   │   ├── Client.php
│   │   └── Rental.php
│   └── Services/
│       ├── SupabaseService.php
│       └── PDFService.php
├── database/
│   └── migrations/
├── routes/
│   └── api.php
└── config/
```

### Frontend
```
rentautopro-frontend/
├── src/
│   ├── api/              # Servicios de API
│   ├── components/       # Componentes reutilizables
│   │   └── common/
│   ├── context/          # Contextos de React
│   ├── pages/            # Páginas principales
│   ├── types/            # Tipos TypeScript
│   └── lib/              # Utilidades
├── public/
└── package.json
```

## 🔑 Funcionalidades Principales

### 1. Gestión de Vehículos
- CRUD completo de vehículos
- Control de estado (disponible, alquilado, mantenimiento)
- Historial de cada vehículo
- Seguimiento de kilometraje

### 2. Gestión de Mantenimientos
- Registro de mantenimientos (preventivo, correctivo, predictivo)
- Alertas automáticas
- Historial por vehículo
- Control de costos

### 3. Gestión de Clientes
- CRUD de clientes
- Historial de alquileres por cliente
- Información de contacto

### 4. Gestión de Alquileres
- Crear nuevos alquileres
- Calcular costos automáticamente
- Completar alquileres
- Generar contratos en PDF
- Control de estados

### 5. Dashboard
- KPIs en tiempo real
- Estado de la flota
- Ingresos y costos del mes
- Alquileres recientes

### 6. Reportes
- Reporte de ingresos
- Reporte de costos de mantenimiento
- Disponibilidad de flota

## 🔐 Autenticación

El sistema utiliza autenticación con Sanctum (Laravel) + Supabase Auth.

### Roles de Usuario
- **Admin**: Acceso completo al sistema
- **Gestor**: Gestión operativa
- **Cliente**: Vista limitada de sus alquileres

### Login de Prueba
Después de configurar Supabase, crear un usuario manualmente:

```sql
-- En Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@rentautopro.com', crypt('password123', gen_salt('bf')), now());
```

Luego registrarlo en Laravel usando el endpoint `/api/v1/register`

## 📡 API Endpoints

### Autenticación
```
POST /api/v1/register
POST /api/v1/login
POST /api/v1/logout
GET  /api/v1/me
```

### Vehículos
```
GET    /api/v1/vehicles
POST   /api/v1/vehicles
GET    /api/v1/vehicles/{id}
PUT    /api/v1/vehicles/{id}
DELETE /api/v1/vehicles/{id}
GET    /api/v1/vehicles/{id}/history
```

### Mantenimientos
```
GET    /api/v1/maintenances
POST   /api/v1/maintenances
GET    /api/v1/maintenances/{id}
PUT    /api/v1/maintenances/{id}
DELETE /api/v1/maintenances/{id}
```

### Clientes
```
GET    /api/v1/clients
POST   /api/v1/clients
GET    /api/v1/clients/{id}
PUT    /api/v1/clients/{id}
DELETE /api/v1/clients/{id}
```

### Alquileres
```
GET    /api/v1/rentals
POST   /api/v1/rentals
GET    /api/v1/rentals/{id}
PUT    /api/v1/rentals/{id}
DELETE /api/v1/rentals/{id}
POST   /api/v1/rentals/{id}/complete
POST   /api/v1/rentals/{id}/pdf
```

### Dashboard y Reportes
```
GET /api/v1/dashboard/kpis
GET /api/v1/reports/income
GET /api/v1/reports/maintenance-costs
GET /api/v1/reports/fleet-availability
```

## 🧪 Testing

### Backend
```bash
php artisan test
```

### Frontend
```bash
npm run test
```

## 🚢 Producción

### Backend
```bash
# Optimizar autoload
composer install --optimize-autoloader --no-dev

# Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend
```bash
# Construir para producción
npm run build

# Los archivos estarán en /dist
```

## 📝 Notas Importantes

1. **CORS**: Asegúrate de configurar correctamente `FRONTEND_URL` en el `.env` del backend
2. **Supabase**: Las credenciales de Supabase deben configurarse tanto en backend como frontend
3. **Migraciones**: Ejecutar siempre las migraciones después de configurar la base de datos
4. **Sanctum**: Configurar `SANCTUM_STATEFUL_DOMAINS` correctamente

## 🐛 Solución de Problemas Comunes

### Error de CORS
Verificar que `config/cors.php` tenga configurado correctamente el `FRONTEND_URL`

### Error de autenticación
Verificar que el token se esté enviando correctamente en los headers:
```
Authorization: Bearer {token}
```

### Error de conexión a base de datos
Verificar las credenciales de Supabase en el `.env`

## 👥 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión moderna de alquiler de vehículos.

## 🔗 Enlaces Útiles

- [Documentación de Laravel](https://laravel.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
