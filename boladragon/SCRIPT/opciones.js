// Cargar opciones al iniciar
document.addEventListener("DOMContentLoaded", () => {
    const volumenSlider = document.getElementById("volumen");

    // Cargar valores guardados
    const volumenGuardado = localStorage.getItem("volumen");

    if (volumenGuardado !== null) {
        volumenSlider.value = volumenGuardado;
        aplicarVolumen(volumenGuardado);
    }


    // Cambios en tiempo real
    volumenSlider.addEventListener("input", (e) => {
        const valor = e.target.value;
        localStorage.setItem("volumen", valor);
        aplicarVolumen(valor);
    });

    // Guardar opciones
    document.getElementById("guardarOpciones").addEventListener("click", () => {
        mostrarMensaje("Opciones guardadas correctamente");
    });

    // Restablecer opciones
    document.getElementById("restablecerOpciones").addEventListener("click", () => {
        volumenSlider.value = 50;
        localStorage.setItem("volumen", 50);
        aplicarVolumen(50);
        mostrarMensaje("Opciones restablecidas");
    });
});

// Función para aplicar volumen a todos los audios
function aplicarVolumen(valor) {
    const audios = document.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.volume = valor / 100;
    });
}



// Función para mostrar mensajes suaves en pantalla
function mostrarMensaje(texto) {
    let mensaje = document.createElement("div");
    mensaje.textContent = texto;
    mensaje.style.position = "fixed";
    mensaje.style.bottom = "20px";
    mensaje.style.left = "50%";
    mensaje.style.transform = "translateX(-50%)";
    mensaje.style.background = "rgba(0, 0, 0, 0.8)";
    mensaje.style.color = "white";
    mensaje.style.padding = "10px 20px";
    mensaje.style.borderRadius = "10px";
    mensaje.style.zIndex = "9999";
    mensaje.style.transition = "opacity 0.5s ease";
    document.body.appendChild(mensaje);

    setTimeout(() => {
        mensaje.style.opacity = "0";
        setTimeout(() => mensaje.remove(), 500);
    }, 2000);
}
 