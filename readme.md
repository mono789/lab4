# Laboratorio 4 — Contenedores y Despliegue con Docker

**UDEA - 2026**

---

## Introducción

En el desarrollo de software moderno, uno de los mayores desafíos es lograr que una aplicación funcione de la misma forma en diferentes entornos: la máquina del desarrollador, el servidor de pruebas y el servidor de producción. Docker resuelve este problema mediante la contenerización, una tecnología que permite empaquetar una aplicación junto con todas sus dependencias en una unidad llamada *contenedor*.

En este laboratorio se construyó una aplicación web simple con Node.js y Express, se encapsuló dentro de un contenedor Docker y se publicó en un registro remoto (Docker Hub). El resultado es un entorno aislado, reproducible y listo para ser desplegado en cualquier máquina que tenga Docker instalado.

---

## Objetivo General

Comprender el concepto de contenerización y aplicar Docker para empaquetar, ejecutar y distribuir una aplicación en un entorno aislado y reproducible.

## Objetivos Específicos

1. Instalar y configurar Docker correctamente.
2. Comprender la diferencia entre imágenes y contenedores.
3. Crear un Dockerfile para construir una imagen personalizada.
4. Ejecutar un contenedor localmente y exponer un servicio mediante un puerto.
5. Utilizar comandos básicos de Docker para gestionar imágenes y contenedores.
6. Subir la imagen a Docker Hub o un repositorio propio.

---

## Herramientas Utilizadas

| Herramienta | Versión / Propósito |
|---|---|
| **Docker Desktop** | Motor de contenedores para construir y ejecutar imágenes |
| **Node.js 22** | Entorno de ejecución para la aplicación web |
| **Express 4.18** | Framework web para Node.js |
| **VSCode** | Editor de código |
| **PowerShell** | Terminal de comandos en Windows |
| **Docker Hub** | Registro remoto para almacenar y distribuir imágenes |

---

## Resultados

### 1. Código de la aplicación (`app.js`)

Se creó un servidor HTTP con Express que expone dos rutas: una raíz que devuelve un mensaje de bienvenida y una ruta `/suma` que realiza una operación matemática simple.

**Contenido del archivo:**

```js
const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('¡Hola desde Docker! Laboratorio 4 - UDEA 2026');
});

app.get('/suma', (req, res) => {
  const a = Number(req.query.a) || 0;
  const b = Number(req.query.b) || 0;
  res.json({ operacion: 'suma', a, b, resultado: a + b });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
```

---

### 2. Dockerfile

El Dockerfile define cómo se construye la imagen: parte de una base oficial de Node.js (`node:20-alpine`), copia los archivos del proyecto, instala las dependencias y expone el puerto 3001.

**Contenido del archivo:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "app.js"]
```

---

### 3. Construcción de la imagen y ejecución del contenedor

Se construyó la imagen con la etiqueta `lab4-docker:v1` y luego se ejecutó un contenedor en segundo plano mapeando el puerto 3001 de la máquina anfitriona al puerto 3001 del contenedor.

> - `docker build -t lab4-docker:v1 .`
> - `docker run -d -p 3001:3001 --name lab4-container lab4-docker:v1`


---

### 4. Prueba de los endpoints de la aplicación

Una vez el contenedor estaba corriendo, se probaron los dos endpoints de la aplicación desde el navegador para verificar su funcionamiento.

**Endpoint raíz (GET /):** Devuelve un mensaje de bienvenida en texto plano.


**Endpoint de suma (GET /suma):** Recibe dos parámetros `a` y `b` por query string y devuelve un JSON con el resultado de la operación.


```
http://localhost:3001
http://localhost:3001/suma?a=10&b=5
```

Ambos endpoints respondieron correctamente, confirmando que la aplicación dentro del contenedor está operativa y accesible desde la máquina anfitriona a través del mapeo de puertos.

---

### 5. Gestión de contenedores (comandos básicos)

Se utilizaron los comandos fundamentales de Docker para inspeccionar, detener y eliminar contenedores:

> - `docker ps`
> - `docker logs lab4-container`
> - `docker stop lab4-container`
> - `docker rm lab4-container`

| Comando | Descripción |
|---|---|
| `docker ps` | Lista los contenedores en ejecución |
| `docker logs <nombre>` | Muestra los logs del contenedor |
| `docker stop <nombre>` | Detiene un contenedor en ejecución |
| `docker rm <nombre>` | Elimina un contenedor detenido |

---

### 6. Publicación en Docker Hub

La imagen se etiquetó con el nombre de usuario de Docker Hub y se subió al registro remoto.

```
docker tag lab4-docker:v1 zifroapp/lab4-docker:v1
docker push zifroapp/lab4-docker:v1
```

---

### 7. Imagen en Docker Hub

Una vez subida la imagen, esta aparece publicada en el perfil de Docker Hub, desde donde puede ser descargada y ejecutada por cualquier persona con Docker instalado.


---

## Conclusiones

- Docker permite encapsular una aplicación y sus dependencias en una imagen ligera y portable, eliminando el clásico problema de *"en mi máquina funciona"*.
- La creación de un Dockerfile es un proceso sencillo y declarativo: basta con especificar una imagen base, copiar los archivos necesarios y definir el comando de inicio.
- Los contenedores se comportan como procesos aislados; cada uno tiene su propio sistema de archivos, puertos y red, pero comparten el kernel del sistema anfitrión, lo que los hace mucho más livianos que las máquinas virtuales tradicionales.
- La publicación en Docker Hub facilita la distribución y el despliegue continuo: cualquier equipo o servidor de CI/CD puede descargar la imagen y ejecutarla sin necesidad de configurar el entorno desde cero.
- Docker no solo beneficia el despliegue en producción, sino también el desarrollo local, al permitir probar la aplicación en un entorno idéntico al de producción desde el primer día.