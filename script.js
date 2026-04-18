const form = document.getElementById("form-razas");
const select = document.getElementById("razas");
const mensaje = document.getElementById("mensaje");
const tbody = document.getElementById("cuerpo-tabla");

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

    const personajes = data.items.filter(p => p.race === raza);

    mostrarPersonajes(personajes);
    mensaje.textContent = `Resultados encontrados: ${personajes.length}`;

  } catch (error) {
    mensaje.textContent = "Error al cargar datos.";
  }
});

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