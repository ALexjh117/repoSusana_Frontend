# Frontend de ANA IA

Pantalla del Hospital Susana López de Valencia. La guía completa —qué es la aplicación, cómo se usa y cómo levantar este frontend junto con el backend— está en el [README de la raíz](../README.md).

## Arrancar

La API tiene que estar en el puerto 8000. En esta carpeta:

```powershell
copy .env.example .env
npm install
npm run dev
```

Deja `VITE_API_URL` vacío. Vite reenvía `/api` a `http://127.0.0.1:8000`. Abre [http://localhost:5173](http://localhost:5173), entra con el formulario (en la demo ya viene `carlos.torres` / `demo`) y recorre el menú o abre ANA IA con el botón del robot.

Cuando el frontend se publica, `VITE_API_URL` es la URL del backend, sin barra al final.

```powershell
npm run build
npm run preview
npm run lint
```

## Carpetas

```
src/pages        pantallas
src/components   iconos, chat y tarjetas de ANA
src/lib          ANA y cálculos compartidos
src/styles       estilos
src/api.ts       llamadas a la API
src/App.tsx      página pública, ingreso y menú
```
