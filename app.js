const tabla = document.getElementById("tablaEstudiantes");
const form = document.getElementById("formEstudiante");
const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const edadInput = document.getElementById("edad");

async function obtenerEstudiantes() {
  try {
    const response = await fetch('http://localhost:1337/api/estudiantes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return [];
  }
}

function cargarTabla(estudiantes) {
  tabla.innerHTML = "";
  if (estudiantes.length === 0) {
    tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No hay estudiantes registrados.</td></tr>";
    return;
  }

  estudiantes.forEach(est => {
    const fila = `
      <tr data-id="${est.id}">
        <td>${est.id}</td>
        <td>${est.Nombre}</td>
        <td>${est.Apellido}</td>
        <td>${est.edad}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
}

async function init() {
  const estudiantes = await obtenerEstudiantes();
  cargarTabla(estudiantes);
}

init();

async function agregarEstudiante(estudiante) {
  try {
    const response = await fetch('http://localhost:1337/api/estudiantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: estudiante })
    });

    if (!response.ok) {
      throw new Error(`Error al agregar el estudiante: ${response.statusText}`);
    }

    await init();   // Recarga la tabla
    form.reset();   // Limpia el formulario
  } catch (error) {
    console.error('Error en agregarEstudiante:', error);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();
  const edad = edadInput.value.trim();

  if (!nombre || !apellido || !edad) {
    alert('Por favor, complete todos los campos (Nombre, Apellido, Edad).');
    return;
  }

  const nuevoEstudiante = {
    Nombre: nombre,
    Apellido: apellido,
    edad: parseInt(edad, 10),
  };

  await agregarEstudiante(nuevoEstudiante);
});

function cargarTabla(estudiantes) {
  tabla.innerHTML = "";

  if (estudiantes.length === 0) {
    tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No hay estudiantes registrados.</td></tr>";
    return;
  }

  estudiantes.forEach(est => {
    const fila = `
      <tr data-document-id="${est.documentId}">
        <td>${est.id}</td>
        <td>${est.Nombre}</td>
        <td>${est.Apellido}</td>
        <td>${est.edad}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
}

tabla.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-editar')) {
    const fila = e.target.closest('tr');
    const docId = fila.dataset.documentId;
    const nombre = fila.children[1].textContent;
    const apellido = fila.children[2].textContent;
    const edad = fila.children[3].textContent;

    // Rellenar el formulario con los datos del estudiante
    idInput.value = docId; // input oculto para guardar el documentId
    nombreInput.value = nombre;
    apellidoInput.value = apellido;
    edadInput.value = edad;
  }
});

async function actualizarEstudiante(docId, estudiante) {
  try {
    const response = await fetch(`http://localhost:1337/api/estudiantes/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: estudiante })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estudiante.');
    }
  } catch (error) {
    console.error('Error en actualizarEstudiante:', error);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const docId = idInput.value;
  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();
  const edad = edadInput.value.trim();

  if (!nombre || !apellido || !edad) {
    alert('Por favor, complete todos los campos (Nombre, Apellido, Edad).');
    return;
  }

  const estudianteData = {
    Nombre: nombre,
    Apellido: apellido,
    edad: parseInt(edad, 10),
  };

  if (docId) {
    await actualizarEstudiante(docId, estudianteData);
  } else {
    await agregarEstudiante(estudianteData);
  }

  form.reset();
  idInput.value = ''; // limpia el ID oculto
  await init(); // recarga la tabla
});

async function eliminarEstudiante(docId) {
  try {
    const response = await fetch(`http://localhost:1337/api/estudiantes/${docId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el estudiante.');
    }
  } catch (error) {
    console.error('Error en eliminarEstudiante:', error);
  }
}

tabla.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-editar')) {
    const fila = e.target.closest('tr');
    const docId = fila.dataset.documentId;
    const nombre = fila.children[1].textContent;
    const apellido = fila.children[2].textContent;
    const edad = fila.children[3].textContent;

    idInput.value = docId;
    nombreInput.value = nombre;
    apellidoInput.value = apellido;
    edadInput.value = edad;
  } 
  else if (e.target.classList.contains('btn-eliminar')) {
    const fila = e.target.closest('tr');
    const docId = fila.dataset.documentId;

    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      await eliminarEstudiante(docId);
      await init(); // Recargar la tabla después de eliminar
    }
  }
});

