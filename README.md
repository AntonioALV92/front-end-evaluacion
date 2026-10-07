# Admin de Transacciones

Evaluación técnica desarrollada con Vue 3.

Esta aplicación simula un administrador de transacciones 
con acceso basado en roles para Supervisores y Operadores.

---

## 🚀 Tecnologías

- Vue 3
- Vite
- Vuetify
- Vue Router
- Axios
- JWT
- Web Crypto API
- Mockoon
- Conventional Commits

---

## 📋 Requerimientos

Antes de ejecutar el proyecto, asegurate de tener instalado:

- Node.js 22+
- npm
- Mockoon

---

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/AntonioALV92/front-end-evaluacion.git
```

2. Entra al proyecto:
```bash
cd front-end-evaluacion
```

3. Instala dependencias:
```bash
npm install
```

---

## 🔐 Environment variables
Crea el archivo .env desde .env.example:
```bash
cp .env.example .env
```

El archivo .env debe contener:
```bash
VITE_API_URL=http://localhost:3000
VITE_AES_SECRET=change-this-development-secret
```

> Importante: La llave AES incluida en este proyecto es solo
con propositos de demostración. En un entorno productivo, las 
llaves de encriptación no estan expuestas en el frontend.

## 🧪 Mockoon
El Backend es simulado usando Mockoon

El entorno de Mockoon exportado se encuentra en:
```bash
mockoon/Evaluacion Frontend.json
```

### Importar el entorno
1. Abre Mockoon.
2. Selecciona Importar.
3. Selecciona:
```bash
mockoon/Evaluacion Frontend.json
```
4. Inicializa el entorno.
La API debería estar disponible en:
```bash
http://localhost:3000
```

## ▶️ Ejecuta la aplicación
Inicia el proyecto:
```bash
npm run dev
```
La aplicación estará disponible en:
```bash
http://localhost:5173
```

## 👥 🔑 Roles y Autenticación
Se cuenta con roles como Supervisor y Operador.

Los usuarios son los siguientes:
```bash
Supervisor
Usuario: supervisor
Password: 123456

Operador
Usuario: operador
Password: 123456
```
## 🧑‍💻 Estructura del proyecto
```bash
src/
├── components/
├── constants/
├── plugins/
├── router/
├── services/
├── views/
├── App.vue
└── main.js

mockoon/
└── Evaluacion Frontend.json
```

## 👨‍💻 Author
Antonio López Vásquez