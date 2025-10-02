# 🚀 Guía de Inicio Rápido - RentAutoPro

## 📋 Requisitos Previos

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.0
- **PostgreSQL** (Supabase configurado)
- **Git**

---

## ⚡ Inicio Rápido (Quick Start)

### 1️⃣ Backend (Laravel 12)

```powershell
# Navegar al directorio del backend
cd rentautopro-api

# Instalar dependencias (si no está hecho)
composer install

# Verificar archivo .env (debe estar configurado)
# Ver INICIO-RAPIDO.md para configuración completa

# Ejecutar migraciones (primera vez)
php artisan migrate

# Iniciar servidor de desarrollo
php artisan serve
```

✅ Backend corriendo en: **http://localhost:8000**

---

### 2️⃣ Frontend (React 19.1 + TypeScript)

```powershell
# Navegar al directorio del frontend
cd rentautopro-frontend

# Instalar dependencias (si no está hecho)
npm install

# Verificar archivo .env (debe estar configurado)
# VITE_API_URL=http://localhost:8000/api/v1
# VITE_SUPABASE_URL=tu_url
# VITE_SUPABASE_ANON_KEY=tu_key

# Iniciar servidor de desarrollo
npm run dev
```

✅ Frontend corriendo en: **http://localhost:5173**

---

## 🔐 Crear Usuario de Prueba

### Opción 1: Desde Supabase Dashboard
1. Ir a: https://app.supabase.com
2. Seleccionar tu proyecto
3. Ir a **Authentication > Users**
4. Click en **Add User**
5. Email: `admin@rentautopro.com`
6. Password: `admin123456`
7. Click en **Create User**

### Opción 2: Desde la API (Postman/Thunder Client)

```http
POST http://localhost:8000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Administrador",
  "email": "admin@rentautopro.com",
  "password": "admin123456",
  "password_confirmation": "admin123456",
  "role": "admin"
}
```

---

## 🧪 Probar la Aplicación

### 1. Acceder a la aplicación
Abrir navegador en: **http://localhost:5173**

### 2. Login
- Email: `admin@rentautopro.com`
- Password: `admin123456`

### 3. Flujo de Prueba Completo

#### A. Dashboard
✅ Ver KPIs generales del sistema

#### B. Crear Vehículos (3 ejemplos)
1. **Vehículo 1:**
   - Marca: Toyota
   - Modelo: Corolla
   - Año: 2023
   - Placa: ABC-123
   - Combustible: Gasolina
   - KM: 15000
   - Tarifa: 80.00

2. **Vehículo 2:**
   - Marca: Honda
   - Modelo: Civic
   - Año: 2024
   - Placa: DEF-456
   - Combustible: Gasolina
   - KM: 5000
   - Tarifa: 100.00

3. **Vehículo 3:**
   - Marca: Nissan
   - Modelo: Sentra
   - Año: 2023
   - Placa: GHI-789
   - Combustible: Diesel
   - KM: 20000
   - Tarifa: 90.00

#### C. Crear Clientes (2 ejemplos)
1. **Cliente 1:**
   - Nombre: Juan Pérez García
   - DNI: 12345678
   - Teléfono: 987654321
   - Email: juan.perez@example.com
   - Dirección: Av. Principal 123, Lima

2. **Cliente 2:**
   - Nombre: María García López
   - DNI: 87654321
   - Teléfono: 987123456
   - Email: maria.garcia@example.com
   - Dirección: Calle Secundaria 456, Lima

#### D. Crear Mantenimientos (2 ejemplos)
1. **Mantenimiento Preventivo:**
   - Vehículo: Toyota Corolla
   - Tipo: Preventivo
   - Descripción: Cambio de aceite y filtros
   - KM: 15000
   - Costo: 150.00
   - Fecha programada: Fecha actual
   - Estado: Pendiente

2. **Mantenimiento Correctivo:**
   - Vehículo: Honda Civic
   - Tipo: Correctivo
   - Descripción: Reparación de frenos
   - KM: 5000
   - Costo: 300.00
   - Fecha programada: Fecha actual
   - Estado: Completado
   - Fecha completada: Fecha actual

#### E. Crear Alquileres
1. **Alquiler 1:**
   - Vehículo: Nissan Sentra (debe estar disponible)
   - Cliente: Juan Pérez García
   - Fecha inicio: Hoy
   - Fecha fin: Dentro de 5 días
   - KM inicial: 20000
   - Costo: Se calcula automáticamente (5 días × 90 = S/. 450)
   - Estado: Activo

2. **Probar funcionalidad de Completar Alquiler:**
   - Click en botón "Completar"
   - Ingresar KM final: 20300
   - Verificar que estado cambie a "Completado"

3. **Probar generación de PDF:**
   - Click en botón "PDF"
   - Verificar descarga del contrato

#### F. Ver Reportes
1. **Reporte de Ingresos:**
   - Seleccionar mes actual
   - Verificar gráfico de barras
   - Verificar métricas

2. **Reporte de Costos:**
   - Seleccionar mes actual
   - Verificar gráfico por tipo
   - Verificar total de costos

3. **Disponibilidad de Flota:**
   - Verificar gráfico circular
   - Verificar estadísticas
   - Verificar tasa de utilización

---

## 🎯 Comandos Útiles

### Backend (Laravel)

```powershell
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver rutas disponibles
php artisan route:list

# Crear nueva migración
php artisan make:migration create_tabla_name

# Ejecutar migraciones
php artisan migrate

# Revertir última migración
php artisan migrate:rollback

# Refrescar base de datos (cuidado: borra todo)
php artisan migrate:fresh

# Ver logs
tail -f storage/logs/laravel.log
```

### Frontend (React)

```powershell
# Instalar nueva dependencia
npm install nombre-paquete

# Actualizar dependencias
npm update

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint

# Formatear código
npm run format
```

---

## 📂 Estructura de Carpetas

```
rentautopro/
├── rentautopro-api/          # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Services/
│   ├── config/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env
│
└── rentautopro-frontend/     # Frontend React
    ├── src/
    │   ├── api/              # Servicios API
    │   ├── components/       # Componentes reutilizables
    │   ├── context/          # Context API (Auth)
    │   ├── pages/            # Páginas/Vistas
    │   ├── types/            # TypeScript types
    │   └── App.tsx           # Componente principal
    ├── public/
    └── .env
```

---

## 🔧 Solución de Problemas Comunes

### ❌ Error: "CORS policy"
**Solución:**
```php
// En config/cors.php verificar:
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
```

### ❌ Error: "Unauthenticated"
**Solución:**
1. Verificar que el token esté en localStorage
2. Hacer logout y volver a hacer login
3. Verificar que las rutas de API tengan middleware 'auth:sanctum'

### ❌ Error: "Connection refused"
**Solución:**
1. Verificar que el backend esté corriendo: `php artisan serve`
2. Verificar URL en `.env` del frontend: `VITE_API_URL=http://localhost:8000/api/v1`

### ❌ Error: "Table not found"
**Solución:**
```bash
# Ejecutar migraciones
php artisan migrate
```

### ❌ Error: "npm install fails"
**Solución:**
```bash
# Limpiar caché de npm
npm cache clean --force
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "SQLSTATE[HY000]"
**Solución:**
1. Verificar conexión a Supabase
2. Verificar credenciales en `.env`
3. Verificar que la base de datos exista

---

## 📊 Puertos Utilizados

- **Backend (Laravel):** `8000`
- **Frontend (React):** `5173`
- **PostgreSQL (Supabase):** `5432` (remoto)

---

## 🌐 URLs Importantes

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/v1
- **Supabase:** https://app.supabase.com
- **Documentación API:** Ver README.md

---

## 📱 Navegación de la Aplicación

```
http://localhost:5173/
├── /login              # Página de login
├── /dashboard          # Dashboard con KPIs
├── /vehicles           # Gestión de vehículos
├── /maintenance        # Gestión de mantenimientos
├── /clients            # Gestión de clientes
├── /rentals            # Gestión de alquileres
└── /reports            # Reportes y estadísticas
```

---

## 🎨 Características de la Interfaz

### Navegación
- **Sidebar:** Menú lateral con iconos
- **Navbar:** Información del usuario y logout
- **Breadcrumbs:** (Próximamente)

### Componentes
- **Modales:** Para crear/editar registros
- **Cards:** Vista moderna de datos
- **Tablas:** Vista tabular con paginación
- **Gráficos:** Visualización de datos (Recharts)
- **Badges:** Indicadores de estado
- **Botones:** Primary, Secondary, Danger

### Colores
- **Primary:** Verde-azulado (#10b981)
- **Success:** Verde
- **Warning:** Amarillo
- **Danger:** Rojo
- **Info:** Azul

---

## 🔐 Seguridad

### Backend
- ✅ Autenticación con Laravel Sanctum
- ✅ Middleware de autenticación
- ✅ Validación de datos
- ✅ Protección CSRF
- ✅ Rate limiting

### Frontend
- ✅ Rutas protegidas con AuthContext
- ✅ Token JWT en localStorage
- ✅ Interceptor para agregar token en requests
- ✅ Redirect automático al login si no autenticado
- ✅ Validación de formularios

---

## 📈 Monitoreo

### Logs del Backend
```powershell
# Ver logs en tiempo real
Get-Content storage/logs/laravel.log -Wait -Tail 50
```

### DevTools del Frontend
- **React Query DevTools:** Ya incluido en desarrollo
- **Network Tab:** Para ver requests HTTP
- **Console:** Para ver errores JavaScript

---

## 🚀 Deploy (Producción)

### Backend
```bash
# Optimizar para producción
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend
```bash
# Build para producción
npm run build

# Los archivos estarán en /dist
```

---

## 📚 Recursos Adicionales

- **README.md** - Documentación técnica completa
- **INICIO-RAPIDO.md** - Guía de configuración inicial
- **ESTRUCTURA-PROYECTO.md** - Resumen de archivos
- **MODULOS-IMPLEMENTADOS.md** - Detalle de funcionalidades
- **database-schema.sql** - Script SQL para Supabase

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verificar:

- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 5173
- [ ] Base de datos Supabase configurada
- [ ] Archivos .env configurados correctamente
- [ ] Migraciones ejecutadas
- [ ] Usuario creado en Supabase
- [ ] Login exitoso
- [ ] Token en localStorage
- [ ] CORS configurado correctamente

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisar logs del backend
2. Revisar console del navegador
3. Verificar network tab
4. Consultar documentación
5. Revisar configuración de .env

---

## 🎉 ¡Listo para usar!

La aplicación está completamente funcional con:
- ✅ 5 módulos CRUD completos
- ✅ Autenticación
- ✅ Dashboard con KPIs
- ✅ Reportes con gráficos
- ✅ Generación de PDF
- ✅ Diseño responsive

**¡Disfruta de RentAutoPro!** 🚗💨
