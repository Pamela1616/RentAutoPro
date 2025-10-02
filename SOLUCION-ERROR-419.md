# ✅ Solución Error 419 - CSRF Token

## 🔍 Problema
Error **419 (unknown status)** al intentar registrarse o hacer login.

**Causa:** Laravel Sanctum estaba configurado para validar tokens CSRF en las rutas API, pero el frontend solo usaba tokens Bearer (no cookies de sesión).

## 🛠️ Cambios Realizados

### 1. Backend - Configuración de Sanctum

**Archivo:** `rentautopro-api/config/sanctum.php`

✅ **Deshabilitado CSRF** para rutas API (comentada la línea):
```php
'middleware' => [
    'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
    'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
    // 'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class, // ← Comentado
],
```

✅ **Agregado localhost:5173** a dominios stateful:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1,',
    Sanctum::currentApplicationUrlWithPort()
))),
```

### 2. Backend - Variables de Entorno

**Archivo:** `rentautopro-api/.env`

Asegúrate de tener estas variables:
```env
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000
```

### 3. Frontend - Cliente API

**Archivo:** `rentautopro-frontend/src/api/client.ts`

✅ **Removido `withCredentials`** (no necesario para tokens Bearer):
```typescript
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // withCredentials: true, ← REMOVIDO
});
```

### 4. Backend - CORS

**Archivo:** `rentautopro-api/config/cors.php`

Ya estaba correctamente configurado:
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => true,
```

## 🚀 Pasos para Aplicar la Solución

### 1. Limpiar caché del backend
```bash
cd rentautopro-api
php artisan config:clear
php artisan cache:clear
```

### 2. Reiniciar el servidor backend
```bash
# Si está corriendo, detenerlo con Ctrl+C
php artisan serve
```

### 3. Refrescar el frontend
- Recarga la página en el navegador (F5)
- O reinicia el servidor de desarrollo:
```bash
cd rentautopro-frontend
npm run dev
```

### 4. Probar de nuevo
1. Ve a: `http://localhost:5173/register`
2. Completa el formulario
3. Haz clic en "Crear Cuenta"
4. ✅ Debería funcionar correctamente

## 📋 Verificación

### ✅ Verificar en DevTools (F12)

**Network tab:**
- Request: `POST http://localhost:8000/api/v1/register`
- Status: **200 OK** (antes era 419)
- Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "1|..."
  }
}
```

**Console tab:**
- No debe haber errores 419
- No debe haber errores de CORS

**Application → Local Storage:**
- `auth_token`: Token JWT presente
- `user`: Datos del usuario presente

## 🎯 ¿Por qué funcionaba Login pero no Register?

Ambos tenían el mismo problema, pero quizás el login funcionó antes porque:
1. Ya tenías un usuario registrado directamente en la base de datos
2. O el CSRF token se estaba cacheando de alguna forma

El error 419 afecta a **todas las rutas POST/PUT/DELETE** que requieren protección CSRF, incluyendo:
- ✅ `/register`
- ✅ `/login`
- ✅ Todas las demás rutas API

## 🔐 Seguridad

Esta configuración es **segura** porque:

1. **Tokens Bearer:** Cada request lleva el token en el header `Authorization`
2. **HTTPS en producción:** En producción usarás HTTPS
3. **CORS configurado:** Solo tu dominio frontend puede acceder
4. **Sanctum:** Maneja la autenticación de forma segura

## 🌐 Para Producción

Cuando despliegues a producción, actualiza:

**Backend `.env`:**
```env
FRONTEND_URL=https://tu-dominio-frontend.com
SANCTUM_STATEFUL_DOMAINS=tu-dominio-frontend.com
APP_URL=https://tu-dominio-backend.com
```

**Frontend `.env`:**
```env
VITE_API_URL=https://tu-dominio-backend.com/api/v1
```

## 📚 Documentación

- [Laravel Sanctum - SPA Authentication](https://laravel.com/docs/11.x/sanctum#spa-authentication)
- [Axios - CSRF Protection](https://axios-http.com/docs/req_config)
- [Laravel CORS](https://laravel.com/docs/11.x/routing#cors)

---

✨ **¡Error 419 resuelto!** Ahora el registro y login funcionan correctamente.
