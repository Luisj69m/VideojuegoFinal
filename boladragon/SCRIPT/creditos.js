document.addEventListener("DOMContentLoaded", () => {
    // Recupera y aplica el volumen guardado en localStorage al cargar la página
    const volumenGuardado = localStorage.getItem("volumen");
    if (volumenGuardado !== null) 
        aplicarVolumen(volumenGuardado);   
});
