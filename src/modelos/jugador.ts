// Modelo de datos: el mismo jugador que guarda la aplicación web en Cloud Firestore
// (colección «jugadores» del proyecto de Firebase del Producto 2).

export type Posicion = 'Base' | 'Escolta' | 'Alero' | 'Ala-pívot' | 'Pívot';

// Estadísticas medias por partido
export interface Estadisticas {
  puntos: number;
  rebotes: number;
  asistencias: number;
}

export interface Jugador {
  id: string; // identificador del documento en Firestore
  nombre: string;
  apellidos: string;
  dorsal: number;
  posicion: Posicion;
  edad: number;
  altura: number; // en metros, ej. 1.98
  peso: number; // en kilos
  nacionalidad: string;
  foto: string; // URL completa, lista para usar (ver servicios/medios.ts)
  video: string; // URL completa, lista para usar
  descripcion: string;
  estadisticas: Estadisticas;
  actualizadoEn?: Date; // última modificación (la pone el servidor)
}
