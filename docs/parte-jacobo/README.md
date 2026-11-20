# Producto 3 · Aportación de Jacobo

- **Autor de la aportación:** Jacobo Barrera Toba
- **Equipo:** Front Stack Attack · EQUIPO BASKET
- **Tarea:** P3.3 · Ventana Inicio y tarjetas de jugadores
- **Rama:** `feature/jacobo-barrera` → `develop`
- **Pull Request:** [#2 · Inicio con tarjetas, filtros y scroll por bloques](https://github.com/EricKColl/FP.451-Producto3/pull/2)
- **Fecha de este registro:** 19 de noviembre de 2026
- **Código comprobado:** `6509a9f`

## Texto para la memoria del equipo

He desarrollado la ventana Inicio de la aplicación móvil de EQUIPO BASKET con React Native, siguiendo la identidad visual y el contrato técnico preparados por Erick. La pantalla presenta el título «Nuestros jugadores» y un listado con `FlatList` que recibe los jugadores de Firebase a través del hook `useJugadores()`, ya existente en el proyecto.

He creado el componente reutilizable `TarjetaJugador`, que muestra foto, nombre y apellidos, posición, dorsal y medias de puntos, rebotes y asistencias. Al pulsar la zona principal se abre la ficha del jugador, y el botón de vídeo abre su pantalla Multimedia. Ambas acciones utilizan la navegación que preparó Erick y envían el identificador del jugador. Si falta la fotografía o no se puede cargar, la tarjeta muestra un icono de persona.

El listado empieza con un límite de seis jugadores y amplía ese límite al acercarse al final. También he incorporado los filtros «Todos», «Base», «Escolta», «Alero», «Ala-pívot» y «Pívot». Primero se filtra la plantilla completa y después se selecciona el bloque que se va a mostrar. Al cambiar el filtro se reinician el límite y el desplazamiento. Se muestran mensajes distintos cuando la plantilla está vacía o cuando no hay jugadores de la posición elegida.

He probado la aplicación en mi iPhone 15 Pro Max real mediante Expo Go: filtros, desplazamiento, acceso a Detalle y Multimedia, flecha atrás y botón Inicio. Para comprobar el tiempo real se creó un jugador temporal, se modificaron su dorsal y sus puntos y se eliminó al terminar. Confirmé en el iPhone los tres cambios sin recargar la aplicación. La base de datos volvió a tener los diez jugadores iniciales, cuya integridad se verificó al terminar.

## Qué estaba preparado y qué he añadido

| Base preparada por Erick | Aportación de Jacobo |
| --- | --- |
| Proyecto Expo, TypeScript y dependencias | Tarjeta reutilizable `TarjetaJugador.tsx` |
| Configuración de Firebase y servicio de lectura | Presentación de los datos en tarjetas |
| Hooks `useJugadores()` y `useJugador(id)` | Consumo de `useJugadores()` en Inicio |
| Modelo `Jugador` | Uso del modelo para tipar las tarjetas y el listado |
| Stack de navegación, títulos, flecha atrás y botón Inicio | Accesos al Detalle y a Multimedia desde cada tarjeta |
| Tema «Holo Court», fuentes, `Fondo` y `EstadoPantalla` | Cabecera definitiva, estilos de las tarjetas y filtros |
| Pantalla provisional para comprobar la lectura inicial | Listado por bloques, filtros y mensajes de lista vacía |

La ficha completa y el visor de foto corresponden a Marc. El reproductor de vídeo y sus controles corresponden a Carles. En estas pruebas se comprobó que la navegación llega al jugador correcto; las pantallas de destino seguían siendo las versiones provisionales de la Fase 0.

## Archivos de la aportación

- [`src/componentes/TarjetaJugador.tsx`](../../src/componentes/TarjetaJugador.tsx): presentación de cada jugador, fotografía e icono de reserva, etiquetas accesibles y dos zonas de pulsación independientes.
- [`src/pantallas/InicioScreen.tsx`](../../src/pantallas/InicioScreen.tsx): título, lectura del hook existente, listado por bloques, filtros, contador de resultados y mensajes de estado.

Los cambios de aplicación están limitados a estos dos archivos. No se han modificado la configuración de Firebase, los servicios, los hooks, la navegación, las pantallas de los compañeros ni las dependencias.

## Cómo funciona

1. `useJugadores()` entrega la plantilla y los estados de carga y error. La escucha `onSnapshot` está implementada en el servicio de Erick.
2. `useState` conserva el filtro elegido y el límite de jugadores que se muestran. `null` representa «Todos».
3. `filter()` selecciona la posición y `slice()` obtiene el bloque visible, conservando el array original.
4. `FlatList` dibuja las tarjetas. `onEndReached` aumenta el límite de seis en seis mientras quedan resultados.
5. Inicio pasa a cada tarjeta tres props: `jugador`, `alAbrir` y `alVerVideo`. Las dos últimas son funciones que deciden la navegación.
6. `useRef` permite devolver el desplazamiento de la lista al principio cuando se cambia de filtro.
7. `memo` y las funciones estables creadas con `useCallback` permiten evitar actualizaciones innecesarias de tarjetas cuyas props no cambian.

El listado por bloques controla la presentación local: el servicio existente recibe la plantilla completa de Firestore. La cabecera va dentro de `ListHeaderComponent`, por lo que se desplaza junto con el listado.

## Pruebas realizadas y evidencia

| Comprobación | Resultado | Evidencia disponible |
| --- | --- | --- |
| Tipos y formato | Correctos | Ejecución de `npm run comprobar` |
| Exportación para web, iOS y Android | Correcta | `expo export --platform all` generó los tres paquetes |
| Apertura en iPhone 15 Pro Max real | Correcta | Confirmación de Jacobo usando Expo Go y [captura de Inicio](capturas/inicio-iphone.jpg) |
| Filtros Base, Pívot y Todos | Correctos | Confirmación manual de Jacobo; [captura de Base con 2 resultados](capturas/filtro-posicion-iphone.jpg) |
| Desplazamiento hasta el final | Correcto | Confirmación de Jacobo y [captura con 10 de 10 jugadores](capturas/final-listado-iphone.jpg) |
| Tarjeta → Detalle y flecha atrás | Correctos | Confirmación manual de Jacobo |
| Botón ▶ → Multimedia e Inicio | Correctos | Confirmación manual; el vídeo definitivo corresponde a Carles |
| Alta en tiempo real | Correcta, sin recargar | Jacobo vio aparecer «Prueba Jacobo P3»; Firebase pasó de 10 a 11 jugadores |
| Edición en tiempo real | Correcta, sin recargar | Jacobo confirmó el cambio de dorsal 91 → 92 y puntos 12,5 → 20,5 |
| Borrado en tiempo real | Correcto, sin recargar | Jacobo confirmó que el jugador temporal desapareció |
| Limpieza de los datos de prueba | Completada | Lectura final del servidor: 10 jugadores y documento temporal inexistente |
| Integridad de los jugadores iniciales | Verificada | Fechas anteriores al alta temporal y comparación final de los datos con campos ordenados |
| Carga, plantilla vacía y filtro sin coincidencias | Correctos en pruebas de lógica aisladas | Casos automatizados reproducibles en `tests/jacobo/inicio-estados.test.cjs` |
| Error inicial y error de actualización con datos previos | Correctos en pruebas de lógica aisladas | Mensaje de error inicial y conservación de las tarjetas con aviso en una actualización fallida |
| Filtro sobre toda la plantilla y reinicio del bloque | Correctos en pruebas de lógica aisladas | Datos sintéticos de 15 jugadores y cambio de posición tras ampliar el listado |

Las pruebas manuales están respaldadas por las comprobaciones de Jacobo en su iPhone y por tres capturas de su iPhone 15 Pro Max, incorporadas el 19 de noviembre de 2026. Las imágenes muestran Inicio, el filtro Base y el final del listado. La generación de paquetes se ha comprobado para las tres plataformas; la ejecución en un teléfono real se ha realizado en iPhone.

## Pruebas de lógica reproducibles

Desde la raíz del proyecto:

```bash
node --test tests/jacobo/inicio-estados.test.cjs
```

Resultado registrado el 19 de noviembre de 2026: **6 pruebas correctas, 0 fallos**.

El archivo ejecuta el código TSX de `InicioScreen` y `EstadoPantalla` en un entorno aislado. Simula las respuestas de `useJugadores()`, el estado local y las primitivas de React Native, y comprueba los elementos, mensajes y datos que devuelve la lógica del componente. Utiliza Node y TypeScript, ya disponibles en el proyecto, y no realiza conexiones ni escrituras en Firebase.

Casos comprobados:

1. Durante la carga se muestra el mensaje de conexión, sin confundirlo con una plantilla vacía.
2. Una lectura sin jugadores muestra su mensaje, sin contador ni acción innecesaria.
3. Un filtro sin coincidencias ofrece «Ver toda la plantilla» y permite quitar el filtro.
4. Un error inicial muestra el aviso de lectura, en lugar de afirmar que no hay jugadores.
5. Un error posterior mantiene las tarjetas recibidas y muestra una advertencia.
6. El filtro se aplica a toda la plantilla, incluidos los jugadores posteriores al primer bloque, y reinicia el límite de seis.

Estas pruebas verifican decisiones de la pantalla con dependencias simuladas. El montaje real de React, los gestos, la distribución visual, el servicio de Firebase y la detección de una desconexión física quedan fuera de su alcance. Las comprobaciones funcionales con datos reales y dispositivo se documentan por separado en la tabla anterior.

## Comprobaciones y entrega pendientes

- Comprobar, durante las pruebas cruzadas del equipo, el aspecto nativo de los estados vacíos y la pérdida física de conexión. La lógica de respuesta a lecturas vacías y a errores simulados ya está comprobada; no se presenta como una prueba de desconexión real en el teléfono.
- Revisar y probar la aplicación integrada cuando estén terminadas las pantallas de Marc y Carles.
- Añadir el enlace de la PR #2 a la tarjeta P3.3 de Trello. La PR ya tiene la etiqueta `listado` y el Hito 2.
- Fusión por Erick.

### Capturas del iPhone

Imágenes proporcionadas por Jacobo de la aplicación ejecutándose en Expo Go en su iPhone 15 Pro Max. Se conservan los JPG originales sin recortes ni retoques.

| Captura | Evidencia visible |
| --- | --- |
| [Inicio con Todos](capturas/inicio-iphone.jpg) | Título «Nuestros jugadores», contador de 10 jugadores, filtro Todos seleccionado y primeras tarjetas con fotos, dorsales y estadísticas. |
| [Final del listado](capturas/final-listado-iphone.jpg) | Últimos jugadores, «Mostrando 10 de 10 jugadores» y «Has visto toda la plantilla». |
| [Filtro Base](capturas/filtro-posicion-iphone.jpg) | Base seleccionado, Stephen Curry y Chris Paul, y «Mostrando 2 de 2 jugadores». |

Estas capturas documentan el aspecto del listado y el filtro. Las pruebas de navegación y de cambios en tiempo real se acreditan mediante las confirmaciones manuales registradas en la tabla anterior.

## Historial de implementación

| Commit | Cambio |
| --- | --- |
| `575d14f` | Tarjetas de jugadores y accesos a ficha y vídeo |
| `e8a41bb` | Cabecera y listado por bloques de seis |
| `6509a9f` | Filtros por posición y estados vacíos |

Los commits de implementación, documentación, capturas y pruebas están publicados en `feature/jacobo-barrera`. La [PR #2](https://github.com/EricKColl/FP.451-Producto3/pull/2) está abierta hacia `develop`, con la etiqueta `listado`, el Hito 2 y revisión solicitada a `EricKColl`. La revisión y la fusión corresponden a Erick.

## Revisión de Erick

Erick revisó la PR el 20 de noviembre de 2026 con una batería automática sobre la versión web, en un móvil simulado de 390 × 844 (cabecera, tarjetas, listado por bloques, cada filtro, navegación, foto que no carga, pantalla de 320 px y conexión cortada). Encontró dos cosas y las corrigió en esta misma rama:

| Commit | Corrección |
| --- | --- |
| `fix(firebase)` | Sin conexión, Firestore no da error: entrega una lista vacía «de la caché». Inicio decía «0 jugadores» y «Todavía no hay jugadores en la plantilla». Ahora el servicio lo trata como un error de conexión: sale el aviso de conexión y, al volver la red, aparece la plantilla sin recargar. Lo mismo para un jugador (ficha y vídeo). |
| `fix(listado)` | El filtro elegido no se anunciaba (`accessibilityState.selected` no llega a la web en un botón). Los filtros pasan a ser pestañas (`tablist` / `tab` con `aria-selected`), y el lector de pantalla dice cuál está seleccionada en el móvil y en la web. Además, «1 jugador» en singular. |

Resultado: **45 de 45 pruebas correctas** (antes de las correcciones, 36 de 45). Las 6 pruebas de lógica de Jacobo siguen correctas y `npm run comprobar` no da errores.

## Referencias

- [React: pasar props a un componente](https://react.dev/learn/passing-props-to-a-component).
- [React: estado con useState](https://react.dev/reference/react/useState).
- [React: listas y filtros](https://react.dev/learn/rendering-lists).
- [React: referencias con useRef](https://react.dev/reference/react/useRef).
- [React Native: FlatList](https://reactnative.dev/docs/flatlist).
- [React Native: Pressable](https://reactnative.dev/docs/pressable).
- [Expo: componente Image](https://docs.expo.dev/versions/latest/sdk/image/).
- [Firebase: escuchar actualizaciones en tiempo real](https://firebase.google.com/docs/firestore/query-data/listen), referencia de la funcionalidad utilizada a través del servicio existente.
- Guía interna del Producto 3 de Erick, apartado 8.2 y contrato técnico del capítulo 5.
