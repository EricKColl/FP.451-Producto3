const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Al copiar este archivo a tests/jacobo, la raíz queda dos niveles por encima.
const root = process.env.FP451_TEST_ROOT || path.resolve(__dirname, '../..');
const fromProject = require('node:module').createRequire(path.join(root, 'package.json'));
const ts = fromProject('typescript');
const jsx = fromProject('react/jsx-runtime');

// Prueba de lógica aislada: los hooks y las primitivas nativas se simulan.
// Ejecutamos el código TSX de Inicio y EstadoPantalla; no montamos una interfaz nativa.
function preparar(lecturaInicial) {
  let lectura = lecturaInicial;
  let cursor = 0;
  const estados = [];
  const referencias = [];
  const react = {
    useState(inicial) {
      const indice = cursor++;
      if (!(indice in estados)) estados[indice] = inicial;
      return [
        estados[indice],
        (nuevo) => {
          estados[indice] = typeof nuevo === 'function' ? nuevo(estados[indice]) : nuevo;
        },
      ];
    },
    useRef(inicial) {
      const indice = cursor++;
      return (referencias[indice] ||= { current: inicial });
    },
    useCallback(funcion) {
      return funcion;
    },
  };
  const native = Object.fromEntries(
    ['FlatList', 'Pressable', 'ScrollView', 'Text', 'View', 'ActivityIndicator'].map((tipo) => [
      tipo,
      tipo,
    ]),
  );
  native.StyleSheet = { create: (estilos) => estilos };
  const cache = new Map();
  function cargar(relativo) {
    const archivo = path.join(root, relativo);
    if (cache.has(archivo)) return cache.get(archivo);
    const modulo = { exports: {} };
    cache.set(archivo, modulo.exports);
    const codigo = ts.transpileModule(fs.readFileSync(archivo, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText;
    const cargarImport = (nombre) => {
      if (nombre === 'react') return react;
      if (nombre === 'react/jsx-runtime') return jsx;
      if (nombre === 'react-native') return native;
      if (nombre === '@expo/vector-icons') return { Ionicons: 'Icono' };
      if (nombre.endsWith('/tema/tema')) return cargar('src/tema/tema.ts');
      if (nombre.endsWith('/comunes/EstadoPantalla'))
        return cargar('src/componentes/comunes/EstadoPantalla.tsx');
      if (nombre.endsWith('/comunes/Fondo')) return { Fondo: 'Fondo' };
      if (nombre.endsWith('/TarjetaJugador')) return { TarjetaJugador: 'TarjetaJugador' };
      if (nombre.endsWith('/useJugadores')) return { useJugadores: () => lectura };
      throw new Error('Import no previsto en la prueba: ' + nombre);
    };
    vm.runInNewContext(
      codigo,
      { module: modulo, exports: modulo.exports, require: cargarImport },
      { filename: archivo },
    );
    return modulo.exports;
  }
  const { InicioScreen } = cargar('src/pantallas/InicioScreen.tsx');
  const dibujar = () => {
    cursor = 0;
    return InicioScreen({ navigation: { navigate() {} } });
  };
  return {
    dibujar,
    recibir: (nueva) => {
      lectura = nueva;
    },
  };
}

function buscar(nodo, condicion) {
  if (!nodo) return undefined;
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) {
      const resultado = buscar(hijo, condicion);
      if (resultado) return resultado;
    }
    return undefined;
  }
  if (typeof nodo !== 'object') return undefined;
  if (condicion(nodo)) return nodo;
  return buscar(nodo.props?.children, condicion);
}
const lista = (arbol) => buscar(arbol, (n) => n.type === 'FlatList');
const texto = (nodo) => {
  if (nodo == null || typeof nodo === 'boolean') return '';
  if (Array.isArray(nodo)) return nodo.map(texto).join(' ');
  if (typeof nodo !== 'object') return String(nodo);
  if (typeof nodo.type === 'function') return texto(nodo.type(nodo.props));
  return texto(nodo.props?.children);
};
const jugador = (id, posicion = 'Alero') => ({ id: String(id), posicion });
const respuesta = (datos, error = null) => ({ datos, cargando: false, error });
const pulsarFiltro = (listado, posicion) => {
  const boton = buscar(
    listado.props.ListHeaderComponent,
    (n) => n.props?.testID === `filtro-${posicion}`,
  );
  assert.ok(boton, 'El filtro tiene un botón');
  boton.props.onPress();
};

test('Mientras llegan los datos se muestra carga y no una plantilla vacía', () => {
  const arbol = preparar({ datos: [], cargando: true, error: null }).dibujar();
  assert.equal(lista(arbol), undefined);
  assert.match(texto(arbol), /Conectando con Firebase/);
});

test('Una lectura vacía muestra el mensaje de plantilla vacía y no muestra contador', () => {
  const listado = lista(preparar(respuesta([])).dibujar());
  assert.equal(listado.props.data.length, 0);
  assert.match(texto(listado.props.ListEmptyComponent), /Todavía no hay jugadores en la plantilla/);
  assert.equal(listado.props.ListEmptyComponent.props.accion, undefined);
  assert.equal(listado.props.ListFooterComponent, undefined);
});

test('Un filtro sin coincidencias muestra su mensaje y permite volver a Todos', () => {
  const entrada = [jugador(1, 'Alero')];
  const pantalla = preparar(respuesta(entrada));
  pulsarFiltro(lista(pantalla.dibujar()), 'Base');
  let listado = lista(pantalla.dibujar());
  assert.equal(listado.props.data.length, 0);
  assert.match(texto(listado.props.ListEmptyComponent), /No hay jugadores en la posición Base/);
  assert.equal(listado.props.ListFooterComponent, undefined);
  listado.props.ListEmptyComponent.props.accion.alPulsar();
  listado = lista(pantalla.dibujar());
  assert.equal(listado.props.data[0].id, '1');
  assert.equal(entrada.length, 1, 'La plantilla original se conserva');
});

test('Un error inicial muestra el aviso de lectura y no el mensaje de plantilla vacía', () => {
  const arbol = preparar(respuesta([], new Error('Lectura denegada simulada'))).dibujar();
  assert.equal(lista(arbol), undefined);
  assert.match(texto(arbol), /No se ha podido leer la plantilla/);
  assert.doesNotMatch(texto(arbol), /Todavía no hay jugadores/);
});

test('Un error posterior conserva las tarjetas recibidas y muestra un aviso', () => {
  const pantalla = preparar(respuesta([jugador(1)]));
  assert.equal(lista(pantalla.dibujar()).props.data.length, 1);
  pantalla.recibir(respuesta([jugador(1)], new Error('Error de actualización simulado')));
  const listado = lista(pantalla.dibujar());
  assert.equal(listado.props.data[0].id, '1');
  assert.match(texto(listado.props.ListHeaderComponent), /Mostrando la última plantilla recibida/);
  assert.ok(
    buscar(listado.props.ListHeaderComponent, (n) => n.props?.accessibilityRole === 'alert'),
  );
});

test('Los filtros se aplican a la plantilla completa y reinician el bloque visible', () => {
  const datos = Array.from({ length: 15 }, (_, i) => jugador(i + 1, i < 7 ? 'Base' : 'Alero'));
  const pantalla = preparar(respuesta(datos));
  let listado = lista(pantalla.dibujar());
  assert.equal(listado.props.data.length, 6);
  listado.props.onEndReached();
  assert.equal(lista(pantalla.dibujar()).props.data.length, 12);
  pulsarFiltro(lista(pantalla.dibujar()), 'Alero');
  listado = lista(pantalla.dibujar());
  assert.equal(listado.props.data.length, 6);
  assert.ok(listado.props.data.every((j) => j.posicion === 'Alero'));
  listado.props.onEndReached();
  assert.equal(lista(pantalla.dibujar()).props.data.length, 8);
  assert.equal(datos.length, 15, 'El filtrado y el paginado no borran jugadores');
});
