document.addEventListener("DOMContentLoaded", () => {
    const agregarIngredienteBtn = document.querySelector(".agregar-ingrediente");
    const agregarPasoBtn = document.querySelector(".agregar-paso");
    const form = document.querySelector("form");

    const listaIngredientes = document.getElementById("ingredientes-agregados");
    const inputNombre = document.getElementById("ingrediente");
    const inputCantidad = document.getElementById("cantidad");
    const selectMedida = document.getElementById("ingrediente-medida");

    const pasosInput = document.getElementById("pasos");
    const pasosLista = document.getElementById("pasos-agregados");

    const inputTitulo = document.getElementById("titulo");
    const inputDescripcion = document.getElementById("descripcion");
    const tituloFormulario = document.getElementById("titulo-formulario");
    const botonSubmit = document.getElementById("btn-submit");
    const inputImagen = document.getElementById("imageUpload");
    const previewImagen = document.getElementById("preview-imagen");

    let recetaIDModificar = null;

    inputImagen.addEventListener("change", () => {
        const archivo = inputImagen.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function (e) {
                previewImagen.src = e.target.result;
                previewImagen.style.display = "block";
            };
            lector.readAsDataURL(archivo);
        } else {
            previewImagen.src = "";
            previewImagen.style.display = "none";
        }
    });

    const idModificar = localStorage.getItem("recetaModificar");
    if (idModificar) {
        const recetas = JSON.parse(localStorage.getItem("recetas")) || [];
        const receta = recetas.find(r => r.id === idModificar);

        if (receta) {
            recetaIDModificar = receta.id;
            inputTitulo.value = receta.titulo;
            inputDescripcion.value = receta.descripcion;

            receta.ingredientes.forEach(ing => {
                const li = document.createElement("li");
                li.textContent = ing;

                const botonEliminar = document.createElement("button");
                botonEliminar.textContent = "❌";
                botonEliminar.style.marginLeft = "10px";
                botonEliminar.onclick = () => {
                    listaIngredientes.removeChild(li);
                    guardarTemporal();
                };

                const botonModificar = document.createElement("button");
                botonModificar.textContent = "Editar";
                botonModificar.style.margin = "8px";
                botonModificar.onclick = () => {
                    const ingredienteActual = li.firstChild.textContent.trim();
                    const inputEdit = document.createElement("input");
                    inputEdit.type = "text";
                    inputEdit.value = ingredienteActual;
                    inputEdit.style.marginRight = "10px";

                    const botonGuardar = document.createElement("button");
                    botonGuardar.textContent = "💾 Guardar";
                    botonGuardar.onclick = () => {
                        const nuevoValor = inputEdit.value.trim();
                        if (nuevoValor !== "") {
                            li.innerHTML = nuevoValor;
                            li.appendChild(botonEliminar);
                            li.appendChild(botonModificar);
                            guardarTemporal();
                        } else {
                            alert("⚠️ El ingrediente no puede estar vacío.");
                        }
                    };

                    li.innerHTML = "";
                    li.appendChild(inputEdit);
                    li.appendChild(botonGuardar);
                };

                li.appendChild(botonEliminar);
                li.appendChild(botonModificar);
                listaIngredientes.appendChild(li);
            });

            receta.pasos.forEach(paso => {
                const li = document.createElement("li");
                li.textContent = paso;

                const botonEliminar = document.createElement("button");
                botonEliminar.textContent = "❌";
                botonEliminar.style.marginLeft = "10px";
                botonEliminar.onclick = () => pasosLista.removeChild(li);

                const botonModificar = document.createElement("button");
                botonModificar.textContent = "Editar";
                botonModificar.style.margin = "8px";
                botonModificar.onclick = () => {
                    const pasoActual = li.firstChild.textContent.trim();
                    const inputEdit = document.createElement("input");
                    inputEdit.type = "text";
                    inputEdit.value = pasoActual;
                    inputEdit.style.marginRight = "10px";

                    const botonGuardar = document.createElement("button");
                    botonGuardar.textContent = "💾 Guardar";
                    botonGuardar.onclick = () => {
                        const nuevoPaso = inputEdit.value.trim();
                        if (nuevoPaso !== "") {
                            li.innerHTML = nuevoPaso;
                            li.appendChild(botonEliminar);
                            li.appendChild(botonModificar);
                        } else {
                            alert("⚠️ El paso no puede estar vacío.");
                        }
                    };

                    li.innerHTML = "";
                    li.appendChild(inputEdit);
                    li.appendChild(botonGuardar);
                };

                li.appendChild(botonEliminar);
                li.appendChild(botonModificar);
                pasosLista.appendChild(li);
            });

            if (receta.imagen) {
                previewImagen.src = receta.imagen;
                previewImagen.style.display = "block";
            }

            tituloFormulario.innerText = "Modificando receta";
            botonSubmit.textContent = "Guardar cambios";
        }

        localStorage.removeItem("recetaModificar");
    }

    function guardarTemporal() {
        const ingredientesTemp = [];
        listaIngredientes.querySelectorAll("li").forEach(li => {
            const texto = li.firstChild.textContent.trim();
            if (texto) ingredientesTemp.push(texto);
        });

        const pasosTemp = [];
        pasosLista.querySelectorAll("li").forEach(li => {
            pasosTemp.push(li.firstChild.textContent.trim());
        });

        const datos = {
            titulo: inputTitulo.value.trim(),
            descripcion: inputDescripcion.value.trim(),
            pasos: pasosTemp,
            ingredientes: ingredientesTemp
        };
        localStorage.setItem("formularioTemporal", JSON.stringify(datos));
    }

    function agregarIngrediente() {
        const nombre = inputNombre.value.trim();
        const cantidad = inputCantidad.value.trim();
        const medida = selectMedida.value;

        if (nombre !== "" && cantidad !== "") {
            const li = document.createElement("li");
            li.textContent = `${nombre} ${cantidad} ${medida}`;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "❌";
            botonEliminar.style.marginLeft = "10px";
            botonEliminar.onclick = () => {
                listaIngredientes.removeChild(li);
                guardarTemporal();
            };

            const botonModificar = document.createElement("button");
            botonModificar.textContent = "Editar";
            botonModificar.style.margin = "8px";
            botonModificar.onclick = () => {
                const actual = li.firstChild.textContent.trim();
                const inputEdit = document.createElement("input");
                inputEdit.type = "text";
                inputEdit.value = actual;
                inputEdit.style.marginRight = "10px";

                const botonGuardar = document.createElement("button");
                botonGuardar.textContent = "Guardar";
                botonGuardar.onclick = () => {
                    const nuevoValor = inputEdit.value.trim();
                    if (nuevoValor !== "") {
                        li.innerHTML = nuevoValor;
                        li.appendChild(botonEliminar);
                        li.appendChild(botonModificar);
                        guardarTemporal();
                    } else {
                        alert("⚠️ El ingrediente no puede estar vacío.");
                    }
                };

                li.innerHTML = "";
                li.appendChild(inputEdit);
                li.appendChild(botonGuardar);
            };

            li.appendChild(botonEliminar);
            li.appendChild(botonModificar);
            listaIngredientes.appendChild(li);

            inputNombre.value = "";
            inputCantidad.value = "";
            guardarTemporal();
        } else {
            alert("⚠️ Completá todos los campos antes de agregar.");
        }
    }

    function agregarPaso() {
        const pasoTexto = pasosInput.value.trim();
        if (pasoTexto !== "") {
            const li = document.createElement("li");
            li.textContent = pasoTexto;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "❌";
            botonEliminar.style.marginLeft = "10px";
            botonEliminar.onclick = () => pasosLista.removeChild(li);

            const botonModificar = document.createElement("button");
            botonModificar.textContent = "Editar";
            botonModificar.style.margin = "8px";
            botonModificar.onclick = () => {
                const pasoActual = li.firstChild.textContent.trim();
                const inputEdit = document.createElement("input");
                inputEdit.type = "text";
                inputEdit.value = pasoActual;
                inputEdit.style.marginRight = "10px";

                const botonGuardar = document.createElement("button");
                botonGuardar.textContent = "Guardar";
                botonGuardar.onclick = () => {
                    const nuevoPaso = inputEdit.value.trim();
                    if (nuevoPaso !== "") {
                        li.innerHTML = nuevoPaso;
                        li.appendChild(botonEliminar);
                        li.appendChild(botonModificar);
                    } else {
                        alert("⚠️ El paso no puede estar vacío.");
                    }
                };

                li.innerHTML = "";
                li.appendChild(inputEdit);
                li.appendChild(botonGuardar);
            };

            li.appendChild(botonEliminar);
            li.appendChild(botonModificar);
            pasosLista.appendChild(li);
            pasosInput.value = "";
        } else {
            alert("⚠️ Escribí un paso antes de agregar.");
        }
    }

    agregarIngredienteBtn.onclick = (e) => {
        e.preventDefault();
        agregarIngrediente();
    };

    agregarPasoBtn.onclick = (e) => {
        e.preventDefault();
        agregarPaso();
    };

    [inputNombre, inputCantidad].forEach(input => {
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                agregarIngrediente();
            }
        });
    });

    pasosInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            agregarPaso();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const titulo = inputTitulo.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const imagen = inputImagen.files[0];

        const ingredientes = [];
        listaIngredientes.querySelectorAll("li").forEach(li => {
            ingredientes.push(li.firstChild.textContent.trim());
        });

        const pasos = [];
        pasosLista.querySelectorAll("li").forEach(li => {
            pasos.push(li.firstChild.textContent.trim());
        });

        if (!titulo || !descripcion || ingredientes.length === 0 || pasos.length === 0) {
            alert("⚠️ Completá todos los campos antes de registrar.");
            return;
        }

        const receta = {
            id: recetaIDModificar || crypto.randomUUID(),
            titulo,
            descripcion,
            ingredientes,
            pasos,
            imagen: null
        };

        if (imagen) {
            const reader = new FileReader();
            reader.onload = () => {
                receta.imagen = reader.result;
                guardarReceta(receta);
            };
            reader.readAsDataURL(imagen);
        } else {
            guardarReceta(receta);
        }
    });

    function guardarReceta(receta) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    receta.usuario = usuario.nombre;
    if (!usuario) {
        alert("⚠️ Debes iniciar sesión para guardar recetas.");
        return;
    }

    receta.usuario = usuario.nombre;

    let recetas = JSON.parse(localStorage.getItem("recetas")) || [];

    if (recetaIDModificar) {
        const index = recetas.findIndex(r => r.id === recetaIDModificar && r.usuario === usuario.nombre);
        if (index !== -1) {
            recetas[index] = receta;
            alert("✏️ Receta modificada exitosamente.");
        } else {
            alert("⚠️ No tienes permiso para modificar esta receta.");
            return;
        }
    } else {
        recetas.push(receta);
        alert("✅ Receta guardada correctamente.");
    }

    localStorage.setItem("recetas", JSON.stringify(recetas));
    localStorage.removeItem("formularioTemporal");
    window.location.href = "index.html";
}


});

