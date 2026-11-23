# EQUIPO BASKET · Producto 3 · Interfaz móvil

Aplicación móvil de EQUIPO BASKET hecha con **React Native** y **Expo** para la asignatura FP.451. Se conecta a la misma base de datos de **Cloud Firestore** que la aplicación web del Producto 2: lo que se cambia en la web (o en la consola de Firebase) aparece en el móvil al momento, sin recargar.

Tiene tres ventanas, unidas con un Stack de navegación:

| Ventana | Qué muestra |
| --- | --- |
| **Inicio** | Zona del título y listado infinito de la plantilla (FlatList) con los datos de Firebase |
| **Detalle** | Todos los datos del jugador; la foto se amplía con zoom al tocarla |
| **Multimedia** | Reproductor del vídeo del jugador con sus botones de control |

El menú superior tiene el título de cada ventana, la flecha para volver atrás y un botón **Inicio** que vuelve al listado.

## Equipo · Front Stack Attack

| Persona | Integrante | Parte | Rama |
| --- | --- | --- | --- |
| P1 | Erick Coll Rodríguez | Coordinación, entorno, conexión con Firebase y navegación | `feature/erick-coll` |
| P2 | Jacobo Barrera Toba | Ventana Inicio: listado con FlatList | `feature/jacobo-barrera` |
| P3 | Marc Pérez Rodríguez | Ventana Detalle y foto con zoom | `feature/marc-perez` |
| P4 | Carles Miguel Millán | Ventana Multimedia: reproductor con controles | `feature/carles-miguel` |

## Cómo arrancarlo

Hace falta **Node.js 20 o superior** y, para verla en el móvil, la aplicación **Expo Go** (Google Play o App Store).

```bash
npm install
npx expo start
```

- **En el móvil:** abre Expo Go y escanea el código QR que aparece en la terminal (en iPhone, con la cámara). El móvil y el ordenador tienen que estar en la misma red wifi; si no se conectan, usa `npx expo start --tunnel`.
- **En el navegador:** pulsa `w` en la terminal (o `npm run web`).
- **En un emulador de Android:** pulsa `a` con el emulador de Android Studio abierto.

Antes de subir cambios, `npm run comprobar` revisa los tipos de TypeScript y el formato (y `npm run formato` lo arregla).

## Estructura

```text
App.tsx                      Stack de navegación con las 3 ventanas y el menú superior (P1)
src/
  config/firebase.ts         initializeApp y Firestore (proyecto del Producto 2) (P1)
  modelos/jugador.ts         Modelo de datos del jugador (P1)
  servicios/jugadores.ts     Lectura única y escucha en tiempo real de la colección «jugadores» (P1)
  servicios/medios.ts        URL completas de fotos y vídeos y miniaturas de Cloudinary (P1)
  hooks/useJugadores.ts      useJugadores() y useJugador(id) para las pantallas (P1)
  navegacion/                Tipos de las rutas y botón Inicio del menú (P1)
  tema/tema.ts               Colores, fuentes y medidas «Holo Court» (P1)
  componentes/comunes/       Fondo y mensajes de carga, error y jugador inexistente (P1)
  pantallas/InicioScreen.tsx      Ventana Inicio (P2)
  pantallas/DetalleScreen.tsx     Ventana Detalle (P3)
  pantallas/MultimediaScreen.tsx  Ventana Multimedia (P4)
```

## Firebase

La aplicación usa el proyecto de Firebase del Producto 2 (`equipo-basket-producto2-ee9e1`) y su colección `jugadores`, con el **SDK oficial de Firebase para JavaScript**, que funciona igual en Expo Go, en Android, en iOS y en la web. Las reglas de seguridad permiten leer a cualquiera; el móvil solo lee.

Las fotos y los vídeos de la plantilla inicial están guardados como rutas de la aplicación web (`assets/...`): el móvil las completa con la dirección de Firebase Hosting (https://equipo-basket-producto2-ee9e1.web.app). Los archivos subidos desde la web ya son direcciones completas de Cloudinary.

## Ramas

- `main`: versiones entregables (protegida; solo recibe Pull Requests desde `develop`).
- `develop`: integración del equipo (rama por defecto).
- `feature/<nombre>`: la rama de trabajo de cada integrante. Cada parte entra en `develop` con un Pull Request revisado.
