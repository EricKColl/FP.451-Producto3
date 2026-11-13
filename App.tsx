import { ChakraPetch_600SemiBold, ChakraPetch_700Bold } from '@expo-google-fonts/chakra-petch';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { DarkTheme, LinkingOptions, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BotonInicio } from './src/navegacion/BotonInicio';
import { ParametrosNavegacion } from './src/navegacion/tipos';
import { DetalleScreen } from './src/pantallas/DetalleScreen';
import { InicioScreen } from './src/pantallas/InicioScreen';
import { MultimediaScreen } from './src/pantallas/MultimediaScreen';
import { colores, fuentes } from './src/tema/tema';

// Stack de navegación con las 3 ventanas de la aplicación
const Stack = createNativeStackNavigator<ParametrosNavegacion>();

// Direcciones de cada ventana cuando la app se abre en un navegador (Expo web): así funcionan
// el botón «atrás» del navegador y los enlaces directos, como /jugador/1/video
const enlaces: LinkingOptions<ParametrosNavegacion> = {
  prefixes: [],
  config: { screens: { Inicio: '', Detalle: 'jugador/:id', Multimedia: 'jugador/:id/video' } },
};

// Título de la pestaña en la versión web: «Kobe Bryant · EQUIPO BASKET» (en Inicio, solo la marca)
const tituloPestana = (opciones?: { title?: string }, ruta?: { name: string }) => {
  const titulo = opciones?.title ?? ruta?.name ?? '';
  return titulo === 'EQUIPO BASKET' ? titulo : `${titulo} · EQUIPO BASKET`;
};

// Colores de React Navigation adaptados a «Holo Court» (fondo, cabecera, textos y bordes)
const tema: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colores.cian,
    background: colores.fondo0,
    card: colores.fondo1,
    text: colores.texto,
    border: colores.linea,
    notification: colores.naranja,
  },
};

export default function App() {
  // Fuentes de la identidad visual (las mismas que la web), desde Google Fonts
  const [fuentesListas] = useFonts({
    ChakraPetch_600SemiBold,
    ChakraPetch_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_500Medium,
  });

  if (!fuentesListas) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colores.fondo0,
        }}
      >
        <ActivityIndicator color={colores.cian} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={tema}
        linking={enlaces}
        documentTitle={{ formatter: tituloPestana }}
      >
        <StatusBar style="light" />
        {/* Menú superior: el mismo estilo en las 3 ventanas. A la izquierda, la flecha de volver
            atrás (la añade el Stack solo cuando hay una ventana anterior); a la derecha, el botón
            Inicio, que vuelve al listado desde el detalle y desde el reproductor. */}
        <Stack.Navigator
          initialRouteName="Inicio"
          screenOptions={{
            headerStyle: { backgroundColor: colores.fondo1 },
            headerTintColor: colores.cian,
            headerTitleStyle: { fontFamily: fuentes.titulo, fontSize: 18, color: colores.texto },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            headerRight: () => <BotonInicio />,
            contentStyle: { backgroundColor: colores.fondo0 },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="Inicio"
            component={InicioScreen}
            options={{ title: 'EQUIPO BASKET', headerRight: () => null }}
          />
          <Stack.Screen name="Detalle" component={DetalleScreen} options={{ title: 'Ficha' }} />
          <Stack.Screen
            name="Multimedia"
            component={MultimediaScreen}
            options={{ title: 'Vídeo', animation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
