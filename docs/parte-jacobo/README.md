# Producto 3 · Aportación de Jacobo

- **Autor de la aportación:** Jacobo Barrera Toba
- **Equipo:** Front Stack Attack · EQUIPO BASKET
- **Tarea:** P3.3 · Ventana Inicio y tarjetas de jugadores
- **Rama:** `feature/jacobo-barrera` → PR a `develop`
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
| Apertura en iPhone 15 Pro Max real | Correcta | Confirmación de Jacobo usando Expo Go |
| Filtros Base, Pívot y Todos | Correctos | Confirmación manual de Jacobo en el iPhone |
| Desplazamiento hasta el final | Correcto | Jacobo confirmó que aparecen los jugadores restantes |
| Tarjeta → Detalle y flecha atrás | Correctos | Confirmación manual de Jacobo |
| Botón ▶ → Multimedia e Inicio | Correctos | Confirmación manual; el vídeo definitivo corresponde a Carles |
| Alta en tiempo real | Correcta, sin recargar | Jacobo vio aparecer «Prueba Jacobo P3»; Firebase pasó de 10 a 11 jugadores |
| Edición en tiempo real | Correcta, sin recargar | Jacobo confirmó el cambio de dorsal 91 → 92 y puntos 12,5 → 20,5 |
| Borrado en tiempo real | Correcto, sin recargar | Jacobo confirmó que el jugador temporal desapareció |
| Limpieza de los datos de prueba | Completada | Lectura final del servidor: 10 jugadores y documento temporal inexistente |
| Integridad de los jugadores iniciales | Verificada | Fechas anteriores al alta temporal y comparación final de los datos con campos ordenados |

Las pruebas manuales están respaldadas por las confirmaciones de Jacobo en el chat de desarrollo. Todavía no se han incorporado capturas a esta carpeta. La generación de paquetes se ha comprobado para las tres plataformas; la ejecución en un teléfono real se ha realizado en iPhone.

## Comprobaciones y entrega pendientes

- Recoger las capturas de Inicio en el iPhone: parte superior, final del listado y un filtro activo.
- Verificar específicamente los estados sin resultados, plantilla vacía y pérdida de conexión. Están implementados, pero no se registran aquí como pruebas manuales completadas.
- Revisar y probar la aplicación integrada cuando estén terminadas las pantallas de Marc y Carles.
- Subir la rama, abrir la PR a `develop` y añadir el enlace en esta documentación.
- Asociar la PR a la etiqueta `listado`, al Hito 2 y a la tarjeta P3.3 de Trello.
- Revisión y fusión por Erick.

### Capturas propuestas

Guardar las imágenes reales dentro de `docs/parte-jacobo/capturas/` cuando estén disponibles:

| Nombre propuesto | Qué debe mostrar | Estado |
| --- | --- | --- |
| `inicio-iphone.png` | Título, filtros y primeras tarjetas | Pendiente |
| `final-listado-iphone.png` | Últimas tarjetas y contador final | Pendiente |
| `filtro-posicion-iphone.png` | Posición seleccionada y tarjetas resultantes | Pendiente |

Los nombres son una propuesta: estos archivos aún no existen.

## Historial de implementación

| Commit | Cambio |
| --- | --- |
| `575d14f` | Tarjetas de jugadores y accesos a ficha y vídeo |
| `e8a41bb` | Cabecera y listado por bloques de seis |
| `6509a9f` | Filtros por posición y estados vacíos |

En el momento de redactar este documento, los tres commits de implementación están guardados localmente y la PR todavía no está abierta.

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
