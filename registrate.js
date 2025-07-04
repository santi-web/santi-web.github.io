document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    if (!nombre || !password || !confirmar) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const regexMayuscula = /[A-Z]/;
    const regexNumero = /[0-9]/;

    if (!regexMayuscula.test(password)) {
      alert("La contraseña debe contener al menos una letra mayúscula.");
      return;
    }

    if (!regexNumero.test(password)) {
      alert("La contraseña debe contener al menos un número.");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const nuevoUsuario = { nombre, password };

    // Obtener usuarios existentes
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar que no exista el mismo nombre
    const yaExiste = usuariosGuardados.some(u => u.nombre === nombre);
    if (yaExiste) {
      alert("El nombre de usuario ya está registrado.");
      return;
    }

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // Guardar usuario y marcar sesión como activa con nombre del usuario
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    localStorage.setItem("usuarioLogueado", nombre);  // Guardar el nombre para identificar usuario activo

    alert("Cuenta creada con éxito.");
    window.location.href = "index.html";
  });
});
