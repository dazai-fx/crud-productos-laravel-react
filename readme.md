# CRUD de Productos (Laravel + React)

Este proyecto es una aplicación Full Stack para la gestión de productos.

## Estructura del proyecto

- `api-laravel/`: Backend desarrollado en Laravel con rutas RESTful API.
- `frontend-react/`: Interface de usuario desarrollada en React con Bootstrap y SweetAlert2.

## Instalación y Ejecución

### 1. Backend (Laravel)

```bash
cd api-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 1. Backend (Laravel)

```bash
cd frontend-react
pnpm install   # o npm install
pnpm start     # o npm start
```

Registros para pruebas

```sql
Scripts SQL
INSERT INTO `products` (`id`, `description`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 'Monitor LG 24', 25000.00, 12, '2021-07-27 01:18:57', '2021-07-27 01:18:57'),
(2, 'Teclado Gamer RGB Redragon', 2700.00, 30, '2021-07-27 01:24:33', '2021-07-27 01:24:54'),
(4, 'Consola PS4 1TB', 68000.00, 20, '2021-07-27 01:37:26', '2021-07-27 01:37:26'),
(5, 'Webcam Logitech Pro', 10500.00, 15, '2021-07-27 01:38:44', '2021-07-27 01:38:44'),
(6, 'Gabinete Gamer Sentey x10 RGB', 4500.00, 60, '2021-07-27 01:39:16', '2021-07-27 01:39:16');
```

## 🧠 Conceptos y Aprendizajes del Proyecto

Este proyecto sirvió como práctica para conectar un backend RESTful en Laravel con un frontend en React. A continuación se resumen los pasos clave y conceptos aprendidos durante el desarrollo.

### 1. Backend: Laravel API REST

#### A. Migración de la Base de Datos

Para crear la tabla de productos, generamos el archivo de migración con Artisan:

```bash
php artisan make:migration create_products_table
```

En la migración (database/migrations/...\_create_products_table.php), estructuramos los campos:

```php
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('description');
        $table->double('price', 8, 2);
        $table->integer('stock');
        $table->timestamps();
    });
}
```

Posteriormente ejecutamos las migraciones para crear la tabla en la base de datos:

```bash
php artisan migrate
```

B. Modelo y Controlador
Para manejar la lógica de negocio y las peticiones HTTP, creamos el modelo Product y un controlador con las funciones CRUD:

```bash
php artisan make:model Product
php artisan make:controller ProductController
```

En ProductController.php definimos los métodos para responder en formato JSON:

index(): Devuelve la lista completa de productos (GET).

store(): Guarda un nuevo producto (POST).

show($id): Devuelve un producto específico (GET).

update($id): Actualiza los datos de un producto (PUT).

destroy($id): Elimina un producto (DELETE).

C. Rutas de la API (routes/api.php)
Agrupamos las rutas usando el controlador y siguiendo la convención RESTful para mantener endpoints limpios y consistentes en plural:

use App\Http\Controllers\ProductController;

```php
Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'index');
    Route::post('/products', 'store');
    Route::get('/products/{id}', 'show');
    Route::put('/products/{id}', 'update');
    Route::delete('/products/{id}', 'destroy');
});
```

### 2. Frontend: React App

A. Creación del Proyecto e Instalación de Dependencias
Inicializamos la aplicación de React e instalamos las dependencias necesarias para la interfaz y comunicación HTTP:

# Crear proyecto React

npx create-react-app frontend-react

```bash
# Entrar a la carpeta e instalar dependencias
cd frontend-react
pnpm install axios sweetalert2 sweetalert2-react-content bootstrap @fortawesome/fontawesome-free react-router-dom
```

B. Configuración Global (index.js)
Para que los estilos de Bootstrap y FontAwesome estén disponibles en toda la aplicación, añadimos las importaciones en index.js:

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Estilos e iconos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

C. Módulo de Helper/Alertas (functions.js)
Creamos un archivo auxiliar para reutilizar los avisos visuales con SweetAlert2 y controlar el foco de los inputs:

```javascript
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function show_alerta(mensaje, icono, foco = "") {
  MySwal.fire({
    title: mensaje,
    icon: icono,
  }).then(() => {
    if (foco !== "") {
      const element = document.getElementById(foco);
      if (element) element.focus();
    }
  });
}
```

D. Componente Principal (ShowProducts.jsx)
Construimos el componente gestionando el estado con Hooks de React (useState, useEffect):

Peticiones HTTP: Uso de axios para conectar con las rutas /api/products (GET, POST, PUT, DELETE).

Control de Modal: Reutilización de un único Modal Bootstrap para operaciones de creación y edición.

Renderizado Dinámico: Mapeo del array products dentro del cuerpo de la tabla JSX (<tbody>).

E. Enrutamiento (App.js)
Configuramos react-router-dom para gestionar las rutas de la SPA:

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowProducts from "./components/ShowProducts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element="{<ShowProducts" path="/"/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
```
