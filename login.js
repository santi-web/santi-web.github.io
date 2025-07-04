document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-Inicio");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreIngresado = document.getElementById("nombre").value.trim();
    const passwordIngresado = document.getElementById("password").value;

    if (!nombreIngresado || !passwordIngresado) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = usuariosGuardados.find(u =>
      u.nombre === nombreIngresado && u.password === passwordIngresado
    );

    if (usuarioEncontrado) {
      // ✅ Solución real: guardar objeto usuario completo
      localStorage.setItem("usuarioLogueado", nombreIngresado);
      localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado)); // ESTA LÍNEA ES CLAVE
      alert("Inicio de sesión exitoso.");
      window.location.href = "index.html";
    } else {
      alert("Nombre de usuario o contraseña incorrectos.");
    }
  });
});
