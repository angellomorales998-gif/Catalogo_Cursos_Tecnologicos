// Elementos principales de la página (DOM)
const listaCursos = document.querySelector("#listaCursos");
const formulario = document.querySelector("#formCurso");
const buscador = document.querySelector("#buscador");
const mensaje = document.querySelector("#mensaje");
const cantidadCursos = document.querySelector("#cantidadCursos");
const nombreCurso = document.querySelector("#nombreCurso");
const descripcionCurso = document.querySelector("#descripcion");
const contadorDescripcion = document.querySelector("#contadorDescripcion");
const limpiarBusqueda = document.querySelector("#limpiarBusqueda");

// Cursos iniciales solicitados en la guía.
let cursos = [
  {
    id: 1,
    nombre: "HTML y fundamentos del desarrollo web",
    descripcion: "Aprende a construir la estructura de páginas web y comprende los elementos esenciales de HTML."
  },
  {
    id: 2,
    nombre: "Diseño de páginas con CSS",
    descripcion: "Aprende a diseñar páginas web atractivas mediante colores, tipografías, espacios y diseños adaptables."
  },
  {
    id: 3,
    nombre: "Programación con JavaScript",
    descripcion: "Aprende a crear páginas web interactivas que respondan a las acciones de las personas usuarias."
  }
];

let siguienteId = 4;

// Muestra mensajes de confirmación o de validación.
function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("error", esError);
}

// Devuelve los cursos cuyo nombre coincide con el texto buscado.
function filtrarCursos(texto) {
  const busqueda = texto.toLowerCase().trim();
  if (busqueda === "") return cursos;

  return cursos.filter(function (curso) {
    return curso.nombre.toLowerCase().includes(busqueda);
  });
}

// Construye las tarjetas utilizando el DOM, sin insertar datos como HTML.
function mostrarCursos(datos) {
  listaCursos.replaceChildren();
  cantidadCursos.textContent = String(cursos.length);

  if (datos.length === 0) {
    const sinResultados = document.createElement("p");
    sinResultados.classList.add("sin-resultados");
    sinResultados.textContent = "No se encontraron cursos con ese nombre. Prueba con otra búsqueda.";
    listaCursos.append(sinResultados);
    return;
  }

  datos.forEach(function (curso) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("curso");

    const icono = document.createElement("div");
    icono.classList.add("curso-cabecera");
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = curso.nombre.toLowerCase().includes("html") ? "H5" :
      curso.nombre.toLowerCase().includes("css") ? "CSS" :
      curso.nombre.toLowerCase().includes("javascript") ? "JS" : "＋";

    const titulo = document.createElement("h3");
    titulo.textContent = curso.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = curso.descripcion;

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.classList.add("boton-eliminar");
    botonEliminar.textContent = "Eliminar curso";
    botonEliminar.setAttribute("aria-label", `Eliminar el curso ${curso.nombre}`);

    botonEliminar.addEventListener("click", function () {
      cursos = cursos.filter(function (elemento) {
        return elemento.id !== curso.id;
      });
      mostrarCursos(filtrarCursos(buscador.value));
      mostrarMensaje(`El curso "${curso.nombre}" fue eliminado correctamente.`);
    });

    tarjeta.append(icono, titulo, descripcion, botonEliminar);
    listaCursos.append(tarjeta);
  });
}

// Registra un nuevo curso y actualiza el catálogo.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    mostrarMensaje("Completa los campos y revisa la longitud mínima solicitada.", true);
    return;
  }

  const nombre = nombreCurso.value.trim();
  const descripcion = descripcionCurso.value.trim();

  if (nombre.length < 3 || descripcion.length < 10) {
    mostrarMensaje("El nombre debe tener al menos 3 caracteres y la descripción al menos 10.", true);
    return;
  }

  const yaExiste = cursos.some(function (curso) {
    return curso.nombre.toLowerCase() === nombre.toLowerCase();
  });

  if (yaExiste) {
    mostrarMensaje("Ya existe un curso con ese nombre. Escribe un nombre diferente.", true);
    return;
  }

  cursos.push({
    id: siguienteId,
    nombre: nombre,
    descripcion: descripcion
  });
  siguienteId += 1;

  formulario.reset();
  contadorDescripcion.textContent = "0 / 240";
  mostrarCursos(filtrarCursos(buscador.value));
  mostrarMensaje(`El curso "${nombre}" se agregó correctamente al catálogo.`);
});

// Actualiza las tarjetas en cada cambio del buscador.
buscador.addEventListener("input", function () {
  mostrarCursos(filtrarCursos(buscador.value));
  if (buscador.value.trim() !== "") {
    mostrarMensaje("Resultados de búsqueda actualizados.");
  } else {
    mostrarMensaje("Se muestran nuevamente todos los cursos.");
  }
});

// Limpia la búsqueda con el botón auxiliar.
limpiarBusqueda.addEventListener("click", function () {
  buscador.value = "";
  mostrarCursos(cursos);
  mostrarMensaje("Búsqueda limpiada. Se muestran todos los cursos.");
  buscador.focus();
});

// Cuenta los caracteres de la descripción mientras se escribe.
descripcionCurso.addEventListener("input", function () {
  contadorDescripcion.textContent = `${descripcionCurso.value.length} / 240`;
});

// Primera visualización del catálogo al cargar la página.
mostrarCursos(cursos);
