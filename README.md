# 🥗 Vue LAB · Meal Planner

Este repositorio contiene la resolución del laboratorio del módulo de Vue de Lemoncode. La aplicación permite crear un catálogo de comidas, organizar un plan semanal y reutilizar platos favoritos dentro de una única SPA construida con Vue 3, Pinia y Vue Router.

Cada feature está encapsulada en `src/features`, mientras que los componentes, stores, layouts, constantes y modelos reutilizables se encuentran en `src/common`.

---

## 📁 Estructura del proyecto

```bash
src/
├── app/
│   ├── router/                    # Rutas y títulos de la aplicación
│   └── App.vue                    # Componente raíz
├── common/
│   ├── components/                # Header, footer, modal y sistema de toasts
│   ├── constants/                 # Días de la semana y categorías
│   ├── layouts/                   # Layout principal
│   ├── stores/                    # Estado global reutilizable
│   ├── types/                     # Modelos compartidos
│   └── views/                     # Vistas comunes, como 404
├── features/
│   ├── dishes/                    # Catálogo de comidas
│   ├── favorites/                 # Platos favoritos
│   └── meal-plan/                 # Planificación semanal
├── styles/                        # Estilos Sass globales
└── main.ts                        # Punto de entrada
```

Los componentes y vistas mantienen sus estilos en un archivo Sass independiente, por ejemplo:

```bash
components/header/
├── Header.vue
└── Header.styles.scss
```

---

## 🍽️ Funcionalidades

### 1️⃣ Plan semanal

Organización de las comidas de lunes a domingo.

- Tarjetas independientes para cada día.
- Categorías de desayuno, comida, merienda y cena.
- Búsqueda y filtros por nombre, día y categoría.
- Contador de comidas planificadas.
- Prevención de duplicados para un mismo plato y día.
- Eliminación individual o vaciado completo con confirmación.
- Copia, descarga en texto e impresión del menú semanal.

📂 `src/features/meal-plan/`

---

### 2️⃣ Catálogo de comidas

Listado persistente de platos que pueden existir sin estar incluidos en el plan semanal.

- Datos iniciales leídos desde un mock JSON.
- Creación y edición de título, descripción y categoría.
- Asignación de un plato a varios días.
- Búsqueda por título o descripción.
- Filtro por categoría y favoritos.
- Eliminación en cascada del catálogo, planificación y favoritos.
- Persistencia de los platos eliminados para que los mocks no reaparezcan.

📂 `src/features/dishes/`

---

### 3️⃣ Platos favoritos

Recetario rápido para reutilizar comidas frecuentes.

- Alta y eliminación de favoritos.
- Corazón reactivo en planning, catálogo y detalle.
- Reutilización directa en cualquier día de la semana.
- Asociación mediante un `dishId` estable.
- Prevención de favoritos duplicados.

📂 `src/features/favorites/`

---

### 4️⃣ Experiencia de usuario

- Diseño responsive para móvil, tablet y escritorio.
- Material Icons en toda la aplicación.
- Modal de confirmación propio y accesible.
- Sistema global de toasts con variantes de éxito, información y error.
- Página 404 para rutas desconocidas.

---

## 🧩 Modelo de datos

El catálogo y la planificación se mantienen separados:

```ts
interface Dish {
  id: string
  name: string
  description?: string
  category: MealCategory
  createdAt: string
}

interface PlannedMeal {
  id: string
  dishId: Dish['id']
  day: Weekday
  createdAt: string
}
```

De esta forma, editar un plato actualiza todas sus apariciones sin duplicar su información. El store incluye además una migración para convertir los registros persistidos con el modelo anterior.

---

## 🗺️ Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Plan semanal |
| `/dishes` | Catálogo de comidas |
| `/dishes/:id` | Detalle y edición de una comida |
| `/favorites` | Lista de platos favoritos |
| `/meals/new` | Creación de una comida |
| `/meals/:id` | Compatibilidad con el detalle de una planificación |
| `/*` | Página no encontrada |

---

## 🚀 Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/JCMiriam-front-lemoncode-XVIII-labs/module-4_vue.git
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Levanta el entorno de desarrollo

```bash
npm run dev
```

### 4. Abre la URL mostrada en la consola

Normalmente será [http://localhost:5173](http://localhost:5173).

> El proyecto requiere Node.js 22.12 o superior.

---

## 🧪 Calidad y testing

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar Vitest en modo interactivo
npm run test:unit

# Comprobar los tipos
npm run typecheck

# Ejecutar los linters
npm run lint

# Crear la build de producción
npm run build

# Formatear el código fuente
npm run format
```

La suite utiliza Vitest, Vue Test Utils y JSDOM para cubrir stores, componentes, vistas, rutas, persistencia y migración de datos.

---

## 🛠️ Tecnologías usadas

- Vue 3 y Composition API
- TypeScript
- Vite
- Vue Router
- Pinia
- `pinia-plugin-persistedstate`
- Sass
- Material Design Icons
- Vitest, Vue Test Utils y JSDOM
- ESLint, Oxlint y Prettier

---

## 📌 Notas

- El proyecto se ha generado con la plantilla oficial de [`create-vue`](https://github.com/vuejs/create-vue).
- El catálogo, los favoritos y el plan semanal se conservan en `localStorage` mediante Pinia.
- Los datos iniciales del catálogo se encuentran en `src/features/dishes/data/dishes.mock.json`.
- Las vistas principales se cargan de forma diferida mediante Vue Router.