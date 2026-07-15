let usuarios = [];
let siguienteId = 1;

function buscarPorCorreo(correo) {
  return usuarios.find((usuario) => usuario.correo === correo);
}

function crear(correo, hashPassword) {
  const nuevoUsuario = {
    id: siguienteId++,
    correo,
    password: hashPassword
  };

  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
}

module.exports = {
  buscarPorCorreo,
  crear
};