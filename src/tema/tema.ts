// Identidad visual «Holo Court» de EQUIPO BASKET, la misma de la aplicación web (Productos 1 y 2):
// azul noche de fondo, cian holográfico para la interfaz y naranja balón para lo importante.
// Todas las pantallas toman de aquí los colores, las fuentes y las medidas: así se ven iguales.

export const colores = {
  fondo0: '#05080f',
  fondo1: '#0a1222',
  fondo2: '#0f1b31',
  vidrio: 'rgba(16, 28, 50, 0.72)',
  vidrioFuerte: 'rgba(13, 23, 42, 0.92)',
  linea: 'rgba(120, 205, 255, 0.16)',
  lineaFuerte: 'rgba(120, 205, 255, 0.34)',
  cian: '#2eebfc',
  cianTenue: 'rgba(46, 235, 252, 0.16)',
  azul: '#2981fb',
  naranja: '#ff7f16',
  naranjaTenue: 'rgba(255, 127, 22, 0.18)',
  verde: '#3ee08f',
  rojo: '#f2555a',
  texto: '#e9f2ff',
  texto2: '#a9b8cf',
  texto3: '#6f8098',
} as const;

// Nombres de las fuentes cargadas en App.tsx con useFonts (paquetes @expo-google-fonts)
export const fuentes = {
  titulo: 'ChakraPetch_700Bold',
  tituloMedio: 'ChakraPetch_600SemiBold',
  texto: 'Inter_400Regular',
  textoMedio: 'Inter_500Medium',
  textoFuerte: 'Inter_600SemiBold',
  datos: 'JetBrainsMono_500Medium',
} as const;

export const medidas = {
  hueco: 16, // margen lateral de las pantallas
  radio: 14,
  radioS: 10,
  toque: 44, // tamaño mínimo de cualquier zona que se pueda pulsar (accesibilidad)
} as const;

// Color de cada posición: el mismo en la lista, en la ficha y en el reproductor
export const colorPosicion: Record<string, string> = {
  Base: '#2eebfc',
  Escolta: '#2981fb',
  Alero: '#3ee08f',
  'Ala-pívot': '#ffb23e',
  Pívot: '#ff7f16',
};
