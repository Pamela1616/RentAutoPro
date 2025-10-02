# Guía de Prueba - Sistema de Registro

## 📋 Funcionalidad Implementada

Se ha implementado completamente el sistema de registro de usuarios con las siguientes características:

### ✅ Frontend (React + TypeScript)

1. **Nueva Página de Registro** (`src/pages/Register.tsx`)
   - Formulario completo con validación
   - Campos: Nombre, Email, Rol, Contraseña y Confirmación
   - Manejo de errores del backend
   - Diseño consistente con el Login
   - Enlaces de navegación entre Login y Registro

2. **Rutas Actualizadas** (`src/App.tsx`)
   - Ruta `/register` agregada
   - Redirige al Dashboard después del registro exitoso
   - No requiere autenticación para acceder

3. **API de Autenticación** (`src/api/auth.ts`)
   - Método `register()` conectado al backend
   - Almacena token y usuario en localStorage
   - Manejo de respuestas y errores

4. **Context de Autenticación** (`src/context/AuthContext.tsx`)
   - Función `register()` actualizada
   - Guarda token automáticamente
   - Actualiza estado del usuario

### ✅ Backend (Laravel)

El backend ya tiene implementado:
- Endpoint: `POST /api/v1/register`
- Validaciones:
  - Email único y válido
  - Contraseña mínima de 6 caracteres
  - Confirmación de contraseña
  - Roles: admin, gestor, cliente (default: cliente)
- Integración con Supabase
- Generación de token Sanctum

## 🚀 Cómo Probar

### 1. Asegúrate de que ambos servidores estén corriendo:

**Backend (Laravel):**
```bash
cd rentautopro-api
php artisan serve
```
Debe estar corriendo en: `http://localhost:8000`

**Frontend (React):**
```bash
cd rentautopro-frontend
npm run dev
```
Debe estar corriendo en: `http://localhost:5173`

### 2. Navega al Registro

Abre tu navegador en:
```
http://localhost:5173/register
```

O desde la página de login, haz clic en "Regístrate aquí"

### 3. Completa el Formulario

Ejemplo de datos:
- **Nombre completo:** Juan Pérez
- **Correo electrónico:** juan@ejemplo.com
- **Rol:** Gestor (o Admin/Cliente)
- **Contraseña:** 123456 (mínimo 6 caracteres)
- **Confirmar contraseña:** 123456

### 4. Haz clic en "Crear Cuenta"

Si todo está correcto:
- ✅ El usuario se registra en la base de datos
- ✅ Se genera un token de autenticación
- ✅ Se redirige automáticamente al Dashboard
- ✅ El usuario queda autenticado

## 🔍 Verificación

### En el Frontend:
1. Abre las DevTools (F12)
2. Ve a la pestaña "Application" → "Local Storage"
3. Verifica que existan:
   - `auth_token`: Token JWT
   - `user`: Datos del usuario en JSON

### En el Backend:
1. Verifica la base de datos:
```bash
php artisan tinker
>>> User::latest()->first()
```

2. Revisa los logs si hay errores:
```bash
tail -f storage/logs/laravel.log
```

## 🎨 Diseño

La página de registro tiene:
- 🎨 Diseño consistente con el Login
- 📱 Responsive (se adapta a móviles)
- 🔄 Animación de carga
- ⚠️ Mensajes de error claros
- 🔗 Navegación fácil entre Login/Registro
- 🎯 Validación en tiempo real

## 🔐 Validaciones Implementadas

### Frontend:
- ✅ Todos los campos son requeridos
- ✅ Email con formato válido
- ✅ Contraseña mínima de 6 caracteres
- ✅ Las contraseñas deben coincidir

### Backend:
- ✅ Email único en la base de datos
- ✅ Email con formato válido
- ✅ Contraseña con confirmación
- ✅ Rol válido (admin/gestor/cliente)
- ✅ Nombre obligatorio (máx. 255 caracteres)

## 🐛 Posibles Errores y Soluciones

### "Error al registrar el usuario"
- Verifica que el backend esté corriendo
- Revisa que la URL en `.env` sea correcta: `VITE_API_URL=http://localhost:8000/api/v1`

### "El email ya está registrado"
- Usa otro email o elimina el usuario existente de la BD

### "Las contraseñas no coinciden"
- Asegúrate de escribir la misma contraseña en ambos campos

### Error de CORS
- Verifica la configuración de CORS en el backend (`config/cors.php`)
- Asegúrate de que `supports_credentials` esté en `true`

## 📝 Próximos Pasos Recomendados

1. ✅ Prueba el registro con diferentes roles
2. ✅ Verifica que el token funcione en las rutas protegidas
3. ✅ Prueba el logout y vuelve a iniciar sesión
4. ✅ Implementa recuperación de contraseña (opcional)
5. ✅ Agrega validaciones adicionales según necesites

## 📞 Estructura de Respuesta del Backend

**Registro Exitoso (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "role": "gestor",
      "created_at": "2025-10-01T12:00:00.000000Z",
      "updated_at": "2025-10-01T12:00:00.000000Z"
    },
    "token": "1|abcdef123456..."
  }
}
```

**Error de Validación (422):**
```json
{
  "success": false,
  "errors": {
    "email": ["El email ya está registrado"],
    "password": ["La contraseña debe tener al menos 6 caracteres"]
  }
}
```

---

✨ **¡Todo está conectado y listo para usar!** ✨
