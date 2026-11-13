import {
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Jugador, Posicion } from '../modelos/jugador';
import { urlMedio } from './medios';

// Acceso a la colección «jugadores» de Cloud Firestore. Las pantallas no hablan con Firebase
// directamente: usan estas funciones (o los hooks de src/hooks, que las envuelven).

const coleccion = collection(db, 'jugadores');
// Mismo orden que en la web: por fecha de alta
const consulta = query(coleccion, orderBy('creadoEn'));

// Convierte un documento de Firestore en un Jugador listo para mostrar
export function aJugador(id: string, d: DocumentData): Jugador {
  return {
    id,
    nombre: d['nombre'] ?? '',
    apellidos: d['apellidos'] ?? '',
    dorsal: d['dorsal'] ?? 0,
    posicion: d['posicion'] as Posicion,
    edad: d['edad'] ?? 0,
    altura: d['altura'] ?? 0,
    peso: d['peso'] ?? 0,
    nacionalidad: d['nacionalidad'] ?? '',
    foto: urlMedio(d['foto']),
    video: urlMedio(d['video']),
    descripcion: d['descripcion'] ?? '',
    estadisticas: {
      puntos: d['estadisticas']?.['puntos'] ?? 0,
      rebotes: d['estadisticas']?.['rebotes'] ?? 0,
      asistencias: d['estadisticas']?.['asistencias'] ?? 0,
    },
    actualizadoEn: d['actualizadoEn']?.toDate?.() ?? undefined,
  };
}

// Lectura única de toda la plantilla. Es el equivalente en Firestore del método «once» de
// Realtime Database que cita el enunciado: devuelve el array completo una sola vez.
export async function obtenerJugadores(): Promise<Jugador[]> {
  const instantanea = await getDocs(consulta);
  return instantanea.docs.map((d) => aJugador(d.id, d.data()));
}

// Plantilla en tiempo real: llama a «alCambiar» con la lista completa al empezar y cada vez que
// cambia en Firestore (desde la web, desde otro móvil o desde la consola de Firebase).
// Devuelve la función que cancela la escucha: hay que llamarla al salir de la pantalla.
export function escucharJugadores(
  alCambiar: (jugadores: Jugador[]) => void,
  alFallar: (error: Error) => void,
): () => void {
  return onSnapshot(
    consulta,
    (instantanea) =>
      alCambiar(
        instantanea.docs.map((d) => aJugador(d.id, d.data({ serverTimestamps: 'estimate' }))),
      ),
    alFallar,
  );
}

// Un jugador en tiempo real. «alCambiar» recibe null si el documento no existe (o se ha borrado).
export function escucharJugador(
  id: string,
  alCambiar: (jugador: Jugador | null) => void,
  alFallar: (error: Error) => void,
): () => void {
  return onSnapshot(
    doc(coleccion, id),
    (d) => alCambiar(d.exists() ? aJugador(d.id, d.data({ serverTimestamps: 'estimate' })) : null),
    alFallar,
  );
}
