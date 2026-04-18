const form = document.getElementById("form-razas");
const select = document.getElementById("razas");
const mensaje = document.getElementById("mensaje");
const tbody = document.getElementById("cuerpo-tabla");

let listaPersonajes = [];

// Evento formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const raza = select.value;

  if (!raza) {
    mensaje.textContent = "Selecciona una raza.";
    return;
  }

  mensaje.textContent = "Cargando personajes...";
  tbody.innerHTML = `<tr><td colspan="9">Cargando...</td></tr>`;

  try {
    const res = await fetch("https://dragonball-api.com/api/characters");
    const data = await res.json();

    listaPersonajes = data.items.filter(p => p.race === raza);

    mostrarPersonajes(listaPersonajes);

    mensaje.textContent = `Resultados encontrados: ${listaPersonajes.length}`;

  } catch (error) {
    mensaje.textContent = "Error al cargar datos.";
  }
});

// Mostrar tabla
function mostrarPersonajes(personajes) {
  tbody.innerHTML = "";

  if (personajes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No hay personajes</td></tr>`;
    return;
  }

  personajes.forEach(p => {
    const fila = `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.ki}</td>
        <td>${p.maxKi}</td>
        <td>${p.gender}</td>
        <td>${p.originPlanet || "Desconocido"}</td>
        <td>${p.affiliation}</td>
        <td>
          <img src="${p.image}" alt="${p.name}">
        </td>
        <td>
          <button class="btn-ver" data-id="${p.id}">Ver</button>
        </td>
      </tr>
    `;

    tbody.innerHTML += fila;
  });
}

// Evento botón "Ver"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver")) {
    const id = e.target.dataset.id;
    const personaje = listaPersonajes.find(p => p.id == id);

    mostrarDetalle(personaje);
  }
});

// Mostrar detalle + transformaciones
function mostrarDetalle(p) {
  const panel = document.getElementById("panel-transformaciones");

  const descripcion = p.description?.trim()
    ? p.description
    : "Sin descripción disponible";

  let html = `
    <h3>${p.name}</h3>
    <p><strong>Descripción:</strong> ${descripcion}</p>
  `;

  if (p.transformations && p.transformations.length > 0) {
    html += `<h4>Transformaciones:</h4>`;

    p.transformations.forEach(t => {
      html += `
        <div style="margin:10px 0;">
          <p><strong>${t.name}</strong></p>
          <img src="${t.image}" width="100">
        </div>
      `;
    });
  } else {
    html += `<p>No tiene transformaciones.</p>`;
  }

  panel.innerHTML = html;
}