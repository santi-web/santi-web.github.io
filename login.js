document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-Inicio");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreIngresado = document.getElementById("nombre").value.trim();
    const passwordIngresado = document.getElementById("password").value;

    if (!nombreIngresado || !passwordIngresado) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const passwordHasheada = await hashPassword(passwordIngresado);

    const usuarioEncontrado = usuariosGuardados.find(u =>
      u.nombre === nombreIngresado && u.password === passwordHasheada
    );

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioLogueado", nombreIngresado);
      localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
      alert("Inicio de sesión exitoso.");
      window.location.href = "index.html";
    } else {
      alert("Nombre de usuario o contraseña incorrectos.");
    }
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
