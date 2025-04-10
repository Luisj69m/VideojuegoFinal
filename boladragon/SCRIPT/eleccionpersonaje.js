document.addEventListener("DOMContentLoaded", () => {
    // Recupera y aplica el volumen guardado en localStorage al cargar la página
    const volumenGuardado = localStorage.getItem("volumen");
    if (volumenGuardado !== null) 
        aplicarVolumen(volumenGuardado);   
});


// Variables para los jugadores
let jugador1 = null;
let jugador2 = null;

// Función para seleccionar un personaje
function seleccionarPersonaje(jugador) {
    const seleccion = document.getElementById(jugador);
    const divImagen = document.getElementById(`imagen-${jugador}`);
    const personaje = seleccion.value;
    const nombreJugador = jugador === 'jugador1' ? 'nombre-jugador1' : 'nombre-jugador2';

    if (personaje) {
        // Actualiza el nombre del jugador con el personaje elegido
        document.getElementById(nombreJugador).innerText = jugador === 'jugador1' 
            ? personaje.replace('_eleccion', '') 
            : personaje.replace('_eleccion', '') + " (IA)";

        // Muestra la imagen correspondiente
        divImagen.innerHTML = `<img src="/boladragon/images/${personaje}.png" alt="${personaje}">`;
    } else {
        // Restablece la información si no hay selección
        document.getElementById(nombreJugador).innerText = jugador === 'jugador1' ? 'Jugador 1' : 'Jugador 2 (IA)';
        divImagen.innerHTML = "";
    }

    verificarBotonCombate();
}

// Función para habilitar/deshabilitar el botón de combate
function verificarBotonCombate() {
    const jugador1 = document.getElementById("jugador1").value;
    const jugador2 = document.getElementById("jugador2").value;
    const boton = document.getElementById("botonCombate");

    boton.disabled = !(jugador1 && jugador2); // Habilita si ambos jugadores han seleccionado personaje
}

// Función para iniciar el combate
function iniciarCombate() {
    const jugador1 = document.getElementById("jugador1").value;
    const jugador2 = document.getElementById("jugador2").value;

    if (jugador1 && jugador2) {
        // Redirige a la página de combate con los personajes seleccionados
        window.location.href = `/boladragon/Combate/combate_(pruebas).html?jugador1=${jugador1}&jugador2=${jugador2}`;
    }
}