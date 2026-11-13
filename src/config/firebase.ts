import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración del proyecto de Firebase del Producto 2 («Equipo Basket Producto2»).
// La aplicación móvil se conecta a la MISMA base de datos que la web: lo que se cambia en una
// aparece en la otra. Estos valores identifican el proyecto y son públicos por diseño; lo que
// protege los datos son las reglas de seguridad de Firestore (lectura libre, escrituras validadas).
const configuracion = {
  apiKey: 'AIzaSyBdDp7R0gWho4HZSoWJ1lHjRxlD28Xb9xU',
  authDomain: 'equipo-basket-producto2-ee9e1.firebaseapp.com',
  projectId: 'equipo-basket-producto2-ee9e1',
  storageBucket: 'equipo-basket-producto2-ee9e1.firebasestorage.app',
  messagingSenderId: '428664606749',
  appId: '1:428664606749:web:c9cce3525bc3bf75aa36f4',
};

// initializeApp crea la conexión una sola vez. Al guardar un archivo, la recarga en caliente de
// Expo vuelve a ejecutar este módulo: getApps() evita crear una segunda aplicación.
export const app = getApps().length ? getApp() : initializeApp(configuracion);

// Base de datos Cloud Firestore del proyecto
export const db = getFirestore(app);

// Dirección pública de la aplicación web del Producto 2 (Firebase Hosting). Las fotos y vídeos
// de la plantilla inicial están guardados como rutas («assets/...») de esa aplicación.
export const URL_WEB = 'https://equipo-basket-producto2-ee9e1.web.app/';
