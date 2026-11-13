import { URL_WEB } from '../config/firebase';

// En Firestore, la foto y el vídeo de cada jugador pueden ser:
//   - una ruta de la aplicación web, como «assets/img/jugadores/jugador-1.jpg» (plantilla inicial)
//   - la URL completa de un archivo subido a Cloudinary desde la web (altas y ediciones)
// En el móvil no existe esa carpeta «assets», así que las rutas se completan con la dirección
// de la aplicación publicada en Firebase Hosting.
export function urlMedio(ruta: string | undefined | null): string {
  if (!ruta) return '';
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return URL_WEB + ruta.replace(/^\/+/, '');
}

// Las fotos de Cloudinary se piden ya recortadas al tamaño en que se muestran y en el formato más
// ligero (f_auto): la lista descarga unos pocos kB por jugador. Las demás URL no cambian.
//   miniatura(url, 96)       → cuadrada de 96 × 96, centrada en la cara
//   miniatura(url, 1200, 0)  → hasta 1200 px de ancho, sin recortar
const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export function miniatura(url: string, ancho: number, alto: number = ancho): string {
  const partes = CLOUDINARY.exec(url);
  if (!partes) return url;
  const recorte = alto > 0 ? `c_fill,g_face,w_${ancho},h_${alto}` : `c_limit,w_${ancho}`;
  return `${partes[1]}${recorte},f_auto,q_auto/${partes[2]}`;
}
