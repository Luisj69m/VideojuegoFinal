document.addEventListener("DOMContentLoaded", () => {
    // Recupera el volumen almacenado en localStorage y lo aplica si existe
    const volumenGuardado = localStorage.getItem("volumen");
    if (volumenGuardado !== null) {
        aplicarVolumen(volumenGuardado);
    }

    // Verifica si la opción de pantalla completa está activada en localStorage
    // Si está activada y el documento no está en pantalla completa, intenta activarla
    if (localStorage.getItem("pantalla") === "Pantalla Completa" && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            // Captura y muestra un mensaje de advertencia si no se puede activar el modo pantalla completa
            console.warn("No se pudo entrar en pantalla completa automáticamente:", err);
        });
    }
});