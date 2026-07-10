let tareas = [
  {
    id: 1,
    titulo: 'Revisar documentación de API REST',
    completada: false
  },
  {
    id: 2,
    titulo: 'Probar integración con servicio de clima',
    completada: false
  }
];

let siguienteId = 3;

function obtenerTodas() {
  return tareas;
}

function obtenerPorId(id) {
  return tareas.find((tarea) => tarea.id === id);
}

function crear(datos) {
  const nuevaTarea = {
    id: siguienteId++,
    titulo: datos.titulo,
    completada: false
  };

  tareas.push(nuevaTarea);
  return nuevaTarea;
}

function actualizar(id, datos) {
  const tarea = obtenerPorId(id);

  if (!tarea) {
    return null;
  }

  if (datos.titulo !== undefined) {
    tarea.titulo = datos.titulo;
  }

  if (datos.completada !== undefined) {
    tarea.completada = datos.completada;
  }

  return tarea;
}

function eliminar(id) {
  const indice = tareas.findIndex((tarea) => tarea.id === id);

  if (indice === -1) {
    return false;
  }

  tareas.splice(indice, 1);
  return true;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};