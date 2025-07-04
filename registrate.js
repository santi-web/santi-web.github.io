document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", async (e) => {
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

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const yaExiste = usuariosGuardados.some(u => u.nombre === nombre);
    if (yaExiste) {
      alert("El nombre de usuario ya está registrado.");
      return;
    }

    const passwordHasheada = await hashPassword(password);
    const nuevoUsuario = { nombre, password: passwordHasheada };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    localStorage.setItem("usuarioLogueado", nombre);

    alert("Cuenta creada con éxito.");
    window.location.href = "index.html";
  });

  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
});
