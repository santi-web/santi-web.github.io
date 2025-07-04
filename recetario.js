document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    const usuarioJSON = localStorage.getItem("usuario");

    if (!usuarioLogueado || !usuarioJSON) {
        mostrarModalLogin();
        return;
    }

    if (window.location.pathname.includes("index.html")) {
        cargarRecetario();
    }

    if (window.location.pathname.includes("detalle.html")) {
        mostrarDetalleReceta();
    }

    // Mostrar menú de usuario si hay sesión
    const usuarioMenu = document.getElementById("usuario-menu");
    const btnUsuario = document.getElementById("btn-usuario");
    const menuDesplegable = document.getElementById("menu-desplegable");
    const btnCerrarSesion = document.getElementById("cerrar-sesion-btn");

    const usuario = JSON.parse(usuarioJSON);

    if (usuarioMenu && btnUsuario && menuDesplegable && btnCerrarSesion) {
        usuarioMenu.style.display = "inline-block";
        btnUsuario.textContent = usuario.nombre;

        btnUsuario.addEventListener("click", () => {
            menuDesplegable.style.display = 
                menuDesplegable.style.display === "block" ? "none" : "block";
        });

        btnCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogueado");
            alert("Has cerrado sesión.");
            window.location.href = "login.html";
        });

        document.addEventListener("click", (e) => {
            if (!usuarioMenu.contains(e.target)) {
                menuDesplegable.style.display = "none";
            }
        });
    } else {
        if (usuarioMenu) usuarioMenu.style.display = "none";
    }
});

function mostrarModalLogin() {
    const modal = document.getElementById("modal-login");

    if (modal) modal.style.display = "flex";

    const main = document.querySelector("main");
    const aviso = document.querySelector(".card-click");

    if (main) main.style.display = "none";
    if (aviso) aviso.style.display = "none";
}

function cargarRecetario() {
    const main = document.querySelector("main");
    const avisoSinRecetas = document.querySelector(".card-click");

    main.innerHTML = "";

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      mostrarModalLogin();
      return;
    }

    const recetas = (JSON.parse(localStorage.getItem("recetas")) || [])
        .filter(r => r.usuario === usuario.nombre)
        .sort((a, b) => a.titulo.localeCompare(b.titulo));

    if (recetas.length === 0) {
        avisoSinRecetas.style.display = "block";
    } else {
        avisoSinRecetas.style.display = "none";
    }

    recetas.forEach(receta => {
        const card = crearCardReceta(receta);
        main.appendChild(card);
    });
}
;


function crearCardReceta(receta) {
    const card = document.createElement("div");
    card.className = "receta-card";

    const img = document.createElement("img");
    img.src = receta.imagen || "placeholder.png";
    img.alt = receta.titulo;

    const info = document.createElement("div");
    info.className = "receta-info";

    const h2 = document.createElement("h2");
    h2.textContent = receta.titulo;

    const botonesContainer = document.createElement("div");
    botonesContainer.style.display = "flex";
    botonesContainer.style.flexDirection = "column";
    botonesContainer.style.alignItems = "flex-end";
    botonesContainer.style.gap = "5px";

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.onclick = () => eliminarReceta(receta.id);

    const btnConsultar = document.createElement("button");
    btnConsultar.textContent = "Consultar";
    btnConsultar.onclick = () => verReceta(receta.id);

    botonesContainer.appendChild(btnEliminar);
    botonesContainer.appendChild(btnConsultar);

    info.appendChild(h2);
    info.appendChild(botonesContainer);

    card.appendChild(img);
    card.appendChild(info);

    return card;
}

function verReceta(id) {
    localStorage.setItem("receta", id);
    window.location.href = "detalle.html";
}

function eliminarReceta(id) {
    const confirmar = confirm("¿Estás seguro de que querés eliminar esta receta?");
    if (!confirmar) return;

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    let recetas = JSON.parse(localStorage.getItem("recetas")) || [];

    recetas = recetas.filter(r => !(r.id === id && r.usuario === usuario.nombre));

    localStorage.setItem("recetas", JSON.stringify(recetas));
    location.reload();
}

function mostrarDetalleReceta() {
    const id = localStorage.getItem("receta");
    const recetas = JSON.parse(localStorage.getItem("recetas")) || [];
    const receta = recetas.find(r => r.id === id);

    if (receta) {
        document.getElementById("imagen-receta").src = receta.imagen || "placeholder.png";
        document.getElementById("titulo-receta").textContent = receta.titulo;
        document.getElementById("descripcion-receta").textContent = receta.descripcion;

        const ingList = document.getElementById("ingredientes-receta");
        ingList.innerHTML = "";
        receta.ingredientes.forEach(i => {
            const li = document.createElement("li");
            li.textContent = i;
            ingList.appendChild(li);
        });

        const pasosList = document.getElementById("pasos-receta");
        pasosList.innerHTML = "";
        receta.pasos.forEach(p => {
            const li = document.createElement("li");
            li.textContent = p;
            pasosList.appendChild(li);
        });

        const btnModificar = document.getElementById("modificar-btn");
        btnModificar.addEventListener("click", () => {
            localStorage.setItem("recetaModificar", receta.id);
            window.location.href = "registrar.html";
        });
    }
}
