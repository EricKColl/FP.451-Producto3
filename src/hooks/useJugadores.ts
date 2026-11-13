import { useEffect, useState } from 'react';
import { Jugador } from '../modelos/jugador';
import { escucharJugador, escucharJugadores } from '../servicios/jugadores';

// Estado de una lectura: mientras llega la primera respuesta, «cargando» es true.
export interface Lectura<T> {
  datos: T;
  cargando: boolean;
  error: Error | null;
}

// Plantilla completa en tiempo real.
// useEffect hace lo que en un componente de clase haría componentDidMount (empezar a escuchar al
// mostrarse) y componentWillUnmount (dejar de escuchar al salir: la función que se devuelve).
export function useJugadores(): Lectura<Jugador[]> {
  const [lectura, setLectura] = useState<Lectura<Jugador[]>>({
    datos: [],
    cargando: true,
    error: null,
  });

  useEffect(
    () =>
      escucharJugadores(
        (jugadores) => setLectura({ datos: jugadores, cargando: false, error: null }),
        (error) => setLectura((anterior) => ({ ...anterior, cargando: false, error })),
      ),
    [],
  );

  return lectura;
}

// Un jugador en tiempo real (para la ficha y el reproductor). «datos» es null si no existe.
export function useJugador(id: string): Lectura<Jugador | null> {
  const [lectura, setLectura] = useState<Lectura<Jugador | null>>({
    datos: null,
    cargando: true,
    error: null,
  });

  useEffect(() => {
    setLectura({ datos: null, cargando: true, error: null });
    return escucharJugador(
      id,
      (jugador) => setLectura({ datos: jugador, cargando: false, error: null }),
      (error) => setLectura((anterior) => ({ ...anterior, cargando: false, error })),
    );
  }, [id]);

  return lectura;
}
