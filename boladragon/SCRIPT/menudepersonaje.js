// Función para seleccionar un personaje
function seleccionarPersonaje(jugador) {
    const seleccion = document.getElementById(jugador); // Obtiene el elemento de selección del jugador
    const divImagen = document.getElementById(`imagen-${jugador}`); // Área donde se mostrará la imagen del personaje
    const personaje = seleccion.value; // Obtiene el personaje seleccionado
    const nombreJugador = jugador === 'jugador1' ? 'nombre-jugador1' : 'nombre-jugador2'; // Determina qué jugador está eligiendo

    if (personaje) {
        // Cambia el nombre del jugador al del personaje seleccionado
        document.getElementById(nombreJugador).innerText = jugador === 'jugador1' 
            ? personaje.replace('_eleccion', '') 
            : personaje.replace('_eleccion', '') + " (IA)";

        // Muestra la imagen del personaje
        divImagen.innerHTML = `<img src="/boladragon/images/${personaje}.png" alt="${personaje}">`;
    } else {
        // Si no se ha seleccionado un personaje, se mantiene el nombre original del jugador
        document.getElementById(nombreJugador).innerText = jugador === 'jugador1' ? 'Jugador 1' : 'Jugador 2 (IA)';
        divImagen.innerHTML = ""; // Limpia la imagen si no hay selección
    }

    verificarBotonCombate(); // Verifica si el botón de combate debe activarse
}

// Función para verificar si el botón de combate puede activarse
function verificarBotonCombate() {
    const jugador1 = document.getElementById("jugador1").value; // Verifica si el jugador 1 ha seleccionado personaje
    const jugador2 = document.getElementById("jugador2").value; // Verifica si el jugador 2 ha seleccionado personaje
    const boton = document.getElementById("botonCombate"); // Obtiene el botón de combate

    // Activa el botón si ambos jugadores han elegido personaje, de lo contrario lo desactiva
    boton.disabled = !(jugador1 && jugador2);
}

// Función para iniciar el combate
function iniciarCombate() {
    const jugador1 = document.getElementById("jugador1").value; // Obtiene el personaje seleccionado por el jugador 1
    const jugador2 = document.getElementById("jugador2").value; // Obtiene el personaje seleccionado por el jugador 2

    if (jugador1 && jugador2) {
        // Redirige a la página de combate pasando los personajes seleccionados como parámetros en la URL
        window.location.href = `pruebaCombate2.html?jugador1=${jugador1}&jugador2=${jugador2}`;
    }
}