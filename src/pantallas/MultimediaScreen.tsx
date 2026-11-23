import { Ionicons } from '@expo/vector-icons';
import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { useJugador } from '../hooks/useJugadores';
import type { Jugador } from '../modelos/jugador';
import type { PropsPantalla } from '../navegacion/tipos';
import { colores, colorPosicion, fuentes, medidas } from '../tema/tema';

const velocidades = [0.5, 1, 1.5, 2];
const salto = 10;
// Decimales con coma, como en el resto de la aplicación (1,5×)
const coma = (numero: number) => String(numero).replace('.', ',');

export function MultimediaScreen({ route, navigation }: PropsPantalla<'Multimedia'>) {
  const { id } = route.params;
  const { datos: jugador, cargando, error } = useJugador(id);
  const nombre = jugador ? `${jugador.nombre} ${jugador.apellidos}` : '';
  const url = jugador?.video.trim();

  useEffect(() => {
    navigation.setOptions({ title: nombre ? `Vídeo · ${nombre}` : 'Vídeo' });
  }, [nombre, navigation]);

  if (cargando)
    return (
      <Fondo>
        <EstadoPantalla tipo="cargando" texto="Cargando los datos del jugador…" />
      </Fondo>
    );
  if (error)
    return (
      <Fondo>
        <EstadoPantalla tipo="error" texto="No se han podido leer los datos del jugador." />
      </Fondo>
    );
  if (!jugador || !url)
    return (
      <Fondo>
        <EstadoPantalla
          tipo="vacio"
          texto={
            jugador
              ? 'Este jugador todavía no tiene vídeo.'
              : 'El jugador ya no está en la plantilla.'
          }
          accion={{ texto: 'Volver al listado', alPulsar: () => navigation.popTo('Inicio') }}
        />
      </Fondo>
    );

  return (
    <Fondo>
      <Reproductor key={url} url={url} nombre={nombre}>
        <InfoJugador jugador={jugador} alVerFicha={() => navigation.popTo('Detalle', { id })} />
      </Reproductor>
    </Fondo>
  );
}

function Reproductor({
  url,
  nombre,
  children,
}: {
  url: string;
  nombre: string;
  children?: ReactNode;
}) {
  const vista = useRef<VideoView>(null);
  const terminado = useRef(false);
  const [anchoBarra, setAnchoBarra] = useState(0);
  const [errorPantallaCompleta, setErrorPantallaCompleta] = useState(false);
  const [controlesNativosIOS, setControlesNativosIOS] = useState(false);
  const player = useVideoPlayer(url, (reproductor) => {
    reproductor.timeUpdateEventInterval = 0.25;
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });
  const { playbackRate } = useEvent(player, 'playbackRateChange', {
    playbackRate: player.playbackRate,
  });
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });
  useEventListener(player, 'playToEnd', () => {
    terminado.current = true;
  });
  useEventListener(player, 'playingChange', ({ isPlaying: reproduciendo }) => {
    if (reproduciendo) terminado.current = false;
  });

  const duracionVideo = player.duration;
  const duracion = Number.isFinite(duracionVideo) && duracionVideo > 0 ? duracionVideo : 0;
  const posicion = Math.max(0, Math.min(duracion, currentTime));
  const progreso = duracion ? posicion / duracion : 0;
  const listo = status === 'readyToPlay';
  const puedeBuscar = listo && duracion > 0;

  function irA(segundos: number) {
    if (!Number.isFinite(segundos)) return;
    terminado.current = false;
    player.currentTime = Math.max(0, Math.min(duracion, segundos));
  }

  function alternarReproduccion() {
    if (player.playing) {
      player.pause();
    } else if (terminado.current || (duracion > 0 && player.currentTime >= duracion)) {
      player.replay();
    } else {
      player.play();
    }
  }

  function cambiarVelocidad() {
    const indice = velocidades.indexOf(player.playbackRate);
    player.playbackRate = velocidades[(indice + 1) % velocidades.length];
  }

  const presentarPantallaCompleta = useCallback(async () => {
    try {
      await vista.current?.enterFullscreen();
    } catch {
      setControlesNativosIOS(false);
      setErrorPantallaCompleta(true);
    }
  }, []);

  useEffect(() => {
    if (!controlesNativosIOS) return;

    // iOS reutiliza el controlador integrado. Aplica nativeControls antes de presentarlo.
    const fotograma = requestAnimationFrame(() => {
      void presentarPantallaCompleta();
    });
    return () => cancelAnimationFrame(fotograma);
  }, [controlesNativosIOS, presentarPantallaCompleta]);

  function abrirPantallaCompleta() {
    setErrorPantallaCompleta(false);
    if (Platform.OS === 'ios') {
      setControlesNativosIOS(true);
    } else {
      // La web requiere llamar a fullscreen dentro del gesto del usuario.
      void presentarPantallaCompleta();
    }
  }

  if (status === 'error')
    return <EstadoPantalla tipo="error" texto="No se ha podido reproducir el vídeo del jugador." />;

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <View style={estilos.caja}>
        <Text accessibilityRole="header" style={estilos.titulo}>
          {nombre}
        </Text>
        <View style={estilos.pantalla}>
          <VideoView
            ref={vista}
            player={player}
            style={StyleSheet.absoluteFill}
            nativeControls={controlesNativosIOS}
            onFullscreenExit={() => setControlesNativosIOS(false)}
            fullscreenOptions={{ enable: true }}
            contentFit="contain"
            testID="video"
          />
          {!listo && (
            <View style={estilos.cargando} pointerEvents="none" accessibilityRole="progressbar">
              <ActivityIndicator color={colores.cian} />
              <Text style={estilos.texto}>Cargando vídeo…</Text>
            </View>
          )}
        </View>

        <View>
          <Pressable
            style={estilos.zonaBarra}
            disabled={!puedeBuscar}
            onLayout={({ nativeEvent }) => setAnchoBarra(nativeEvent.layout.width)}
            onPress={({ nativeEvent }) => {
              // En Android e iOS llega locationX; en la web, offsetX (los dos, dentro de la barra)
              const x = Number.isFinite(nativeEvent.locationX)
                ? nativeEvent.locationX
                : (nativeEvent as unknown as { offsetX?: number }).offsetX;
              if (anchoBarra > 0 && x !== undefined) irA((x / anchoBarra) * duracion);
            }}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Posición del vídeo"
            accessibilityState={{ disabled: !puedeBuscar }}
            accessibilityValue={{
              min: 0,
              max: Math.floor(duracion),
              now: Math.floor(posicion),
              text: `${formatoTiempo(posicion)} de ${formatoTiempo(duracion)}`,
            }}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={({ nativeEvent }) => {
              if (!puedeBuscar) return;
              const desplazamiento = nativeEvent.actionName === 'increment' ? salto : -salto;
              irA(player.currentTime + desplazamiento);
            }}
          >
            <View pointerEvents="none" style={estilos.barra}>
              <View style={[estilos.progreso, { width: `${progreso * 100}%` }]} />
            </View>
          </Pressable>
          <View style={estilos.tiempos}>
            <Text style={estilos.tiempo}>{formatoTiempo(posicion)}</Text>
            <Text style={estilos.tiempo}>{formatoTiempo(duracion)}</Text>
          </View>
        </View>

        <View style={estilos.controles}>
          <Control
            icono="play-back"
            texto="−10 s"
            etiqueta="Retroceder 10 segundos"
            accion={() => irA(player.currentTime - salto)}
            desactivado={!puedeBuscar}
          />
          <Control
            icono={isPlaying ? 'pause' : 'play'}
            texto={isPlaying ? 'Pausar' : 'Reproducir'}
            accion={alternarReproduccion}
            desactivado={!listo && !isPlaying}
            principal
          />
          <Control
            icono="play-forward"
            texto="+10 s"
            etiqueta="Avanzar 10 segundos"
            accion={() => irA(player.currentTime + salto)}
            desactivado={!puedeBuscar}
          />
        </View>
        <View style={estilos.controles}>
          <Control
            icono={muted ? 'volume-mute' : 'volume-high'}
            texto={muted ? 'Activar sonido' : 'Silenciar'}
            accion={() => {
              player.muted = !player.muted;
            }}
            desactivado={!listo}
          />
          <Control
            icono="refresh"
            texto="Reiniciar"
            accion={() => {
              player.replay();
            }}
            desactivado={!puedeBuscar}
          />
          <Control
            icono="speedometer-outline"
            texto={`${coma(playbackRate)}×`}
            etiqueta={`Velocidad de reproducción: ${coma(playbackRate)}×`}
            accion={cambiarVelocidad}
            desactivado={!listo}
          />
          <Control
            icono="expand-outline"
            texto="Pantalla completa"
            accion={abrirPantallaCompleta}
            desactivado={!listo || controlesNativosIOS}
          />
        </View>
        {errorPantallaCompleta && (
          <Text accessibilityRole="alert" style={estilos.aviso}>
            No se ha podido abrir la pantalla completa.
          </Text>
        )}
      </View>
      {children}
    </ScrollView>
  );
}

// Debajo del vídeo, como en el mockup: posición, dorsal, descripción y acceso a la ficha
function InfoJugador({ jugador, alVerFicha }: { jugador: Jugador; alVerFicha: () => void }) {
  const color = colorPosicion[jugador.posicion] ?? colores.cian;
  return (
    <View style={[estilos.caja, estilos.info]}>
      <Text style={[estilos.posicion, { color }]}>
        {jugador.posicion.toUpperCase()} · #{jugador.dorsal}
      </Text>
      {jugador.descripcion ? (
        <Text style={estilos.descripcion} numberOfLines={4}>
          {jugador.descripcion}
        </Text>
      ) : null}
      <Pressable
        onPress={alVerFicha}
        style={({ pressed }) => [estilos.enlace, pressed && estilos.controlAtenuado]}
        accessibilityRole="button"
        accessibilityLabel={`Ver la ficha completa de ${jugador.nombre} ${jugador.apellidos}`}
      >
        <Ionicons name="id-card-outline" size={18} color={colores.cian} />
        <Text style={estilos.textoEnlace}>Ver la ficha completa</Text>
      </Pressable>
    </View>
  );
}

type PropsControl = {
  icono: ComponentProps<typeof Ionicons>['name'];
  texto: string;
  etiqueta?: string;
  accion: () => void;
  desactivado: boolean;
  principal?: boolean;
};

function Control({ icono, texto, etiqueta, accion, desactivado, principal }: PropsControl) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta ?? texto}
      accessibilityState={{ disabled: desactivado }}
      disabled={desactivado}
      onPress={accion}
      style={({ pressed }) => [
        estilos.control,
        principal && estilos.controlPrincipal,
        (pressed || desactivado) && estilos.controlAtenuado,
      ]}
    >
      <Ionicons name={icono} size={21} color={principal ? colores.fondo0 : colores.cian} />
      <Text style={[estilos.etiqueta, principal && estilos.etiquetaPrincipal]}>{texto}</Text>
    </Pressable>
  );
}

function formatoTiempo(segundos: number) {
  const total = Math.floor(segundos);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

const estilos = StyleSheet.create({
  contenido: { padding: medidas.hueco },
  caja: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: medidas.hueco,
    gap: 12,
    borderRadius: medidas.radio,
    borderWidth: 1,
    borderColor: colores.linea,
    backgroundColor: colores.vidrio,
  },
  titulo: { color: colores.texto, fontFamily: fuentes.titulo, fontSize: 21 },
  pantalla: {
    aspectRatio: 16 / 9,
    backgroundColor: colores.fondo0,
    borderRadius: medidas.radioS,
    overflow: 'hidden',
  },
  cargando: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colores.vidrioFuerte,
  },
  texto: { color: colores.texto2, fontFamily: fuentes.texto, fontSize: 14 },
  zonaBarra: { minHeight: medidas.toque, justifyContent: 'center' },
  barra: {
    height: 8,
    borderRadius: medidas.radioS,
    overflow: 'hidden',
    backgroundColor: colores.lineaFuerte,
  },
  progreso: { height: '100%', backgroundColor: colores.cian },
  tiempos: { flexDirection: 'row', justifyContent: 'space-between' },
  tiempo: { color: colores.texto2, fontFamily: fuentes.datos, fontSize: 12 },
  controles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  control: {
    flexGrow: 1,
    flexBasis: 62,
    minHeight: medidas.toque,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: colores.lineaFuerte,
    borderRadius: medidas.radioS,
    backgroundColor: colores.cianTenue,
  },
  controlPrincipal: { backgroundColor: colores.naranja, borderColor: colores.naranja },
  controlAtenuado: { opacity: 0.55 },
  etiqueta: {
    color: colores.texto,
    fontFamily: fuentes.textoMedio,
    fontSize: 12,
    textAlign: 'center',
  },
  etiquetaPrincipal: { color: colores.fondo0 },
  aviso: { color: colores.rojo, fontFamily: fuentes.texto, fontSize: 14 },
  info: { marginTop: medidas.hueco, gap: 8 },
  posicion: { fontFamily: fuentes.datos, fontSize: 12, letterSpacing: 1.5 },
  descripcion: { color: colores.texto2, fontFamily: fuentes.texto, fontSize: 14, lineHeight: 21 },
  enlace: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    minHeight: medidas.toque,
  },
  textoEnlace: { color: colores.cian, fontFamily: fuentes.tituloMedio, fontSize: 15 },
});
