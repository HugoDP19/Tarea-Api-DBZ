const form = document.getElementById("form-razas");
const select = document.getElementById("razas");
const mensaje = document.getElementById("mensaje");
const tbody = document.getElementById("cuerpo-tabla");

const facciones = {
  "Z Fighter": "Guerreros Z",
  "Army of Frieza": "Ejército de Freezer",
  "Freelancer": "Independiente",
  "Other": "Otro",
  "Villain": "Villano"
};

function traducirFaccion(f) {
  return facciones[f] || f;
}

let personajesDetalle = {};
let listaPersonajes = [];

// CACHE DETALLE
function obtenerDetallePersonaje(id) {
  if (personajesDetalle[id]) {
    return Promise.resolve(personajesDetalle[id]);
  }

  return fetch(`https://dragonball-api.com/api/characters/${id}`)
    .then(res => res.json())
    .then(data => {
      personajesDetalle[id] = data;
      return data;
    });
}

// Resetear contenido de transformaciones
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const panel = document.getElementById("panel-transformaciones");
  panel.innerHTML = `
    <p class="texto-centro">
      Seleccione un personaje desde el botón ver.
    </p>
  `;

  const raza = select.value;

  if (!raza) {
    mensaje.textContent = "Selecciona una raza.";
    return;
  }

  mensaje.textContent = "Cargando personajes...";
  tbody.innerHTML = `<tr><td colspan="9">Cargando...</td></tr>`;

  try {
    const res = await fetch("https://dragonball-api.com/api/characters?limit=100");
    const data = await res.json();

    listaPersonajes = data.items.filter(p => p.race === raza);

    mostrarPersonajes(listaPersonajes);

    mensaje.textContent = `Resultados encontrados: ${listaPersonajes.length}`;

  } catch {
    mensaje.textContent = "Error al cargar datos.";
  }
});

// TABLA
function mostrarPersonajes(personajes) {
  tbody.innerHTML = "";

  if (personajes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No hay personajes</td></tr>`;
    return;
  }

  personajes.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.ki}</td>
        <td>${p.maxKi}</td>
        <td>${traducirGenero(p.gender)}</td>
        <td>${p.originPlanet?.name || "Desconocido"}</td>
        <td>${traducirFaccion(p.affiliation)}</td>
        <td>
          <button class="btn-lupa" data-id="${p.id}">
            <i class="bi bi-search"></i>
          </button>
        </td>
        <td>
          <button class="btn-ver" data-id="${p.id}">Ver</button>
        </td>
      </tr>
    `;
  });
}

// EVENTOS BOTONES
document.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;

  const id = boton.dataset.id;
  if (!id) return;

  // VER
  if (boton.classList.contains("btn-ver")) {
    obtenerDetallePersonaje(id).then(mostrarDetalle);
  }

  // LUPA
  if (boton.classList.contains("btn-lupa")) {
    obtenerDetallePersonaje(id).then(abrirModal);
  }
});

function mostrarDetalle(p) {
  const panel = document.getElementById("panel-transformaciones");

  const descripcion = p.description?.trim()
    ? p.description
    : "Sin descripción disponible";

  const transformaciones = p.transformations || [];

  // Personaje sin transformaciones
  if (transformaciones.length === 0) {
    panel.innerHTML = `
      <h3>${p.name}</h3>
      <p>Este personaje no tiene transformaciones registradas.</p>

      <div class="detalle-transformacion">
        
        <!-- IMAGEN -->
        <div>
          <img src="${p.image}">
        </div>

        <div class="descripcion-transformacion">
          <h3>Descripción</h3>
          <p>${descripcion}</p>
        </div>

      </div>
    `;
    return;
  }

  // Mostrar transformaciones del personaje
  panel.innerHTML = `
    <h3>${p.name}</h3>

    <div class="cabecera-transformacion">
      <select id="select-transformaciones"></select>
    </div>  

    <div class="detalle-transformacion">
      <img id="img-transformacion">

      <div class="descripcion-transformacion" id="info-transformacion"></div>
    </div>
  `;

  const select = document.getElementById("select-transformaciones");

  transformaciones.forEach((t, i) => {
    select.innerHTML += `<option value="${i}">${t.name}</option>`;
  });

  renderTransformacion(transformaciones[0], descripcion);

  select.addEventListener("change", () => {
    renderTransformacion(transformaciones[select.value], descripcion);
  });
}

//Mostrar información de la transformación
function renderTransformacion(t, descripcion) {
  const img = document.getElementById("img-transformacion");
  const info = document.getElementById("info-transformacion");

  img.src = t.image;

  info.innerHTML = `
    <h3>${t.name}</h3>
    <p><strong>Ki:</strong> ${t.ki}</p>

    <p>
      Esta transformación aumenta el poder del personaje.
    </p>

    <p><strong>Descripción:</strong> ${descripcion}</p>
  `;
}

// Modal imagén
function abrirModal(p) {
  const modal = document.getElementById("modal-imagen");
  const img = document.getElementById("imagen-modal");
  const titulo = document.getElementById("modal-titulo");

  titulo.textContent = p.name;
  img.src = p.image || "https://via.placeholder.com/300";
  img.alt = p.name;

  modal.classList.add("activo");
}

// Traductir género
function traducirGenero(g) {
  if (g === "Male") return "Masculino";
  if (g === "Female") return "Femenino";
  return "Desconocido";
}

// Cerrar modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-imagen");
  const cerrar = document.getElementById("cerrar-modal");

  cerrar.addEventListener("click", () => {
    modal.classList.remove("activo");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("activo");
    }
  });
});