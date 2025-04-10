// Esperamos que el DOM esté cargado antes de ejecutar el código principal
document.addEventListener("DOMContentLoaded", () => {
    const volumenGuardado = localStorage.getItem("volumen");
    if (volumenGuardado !== null) aplicarVolumen(volumenGuardado); // Aplica volumen guardado si existe

    if (playerTurn) {
        setControls(true); // Habilita controles si es turno del jugador
    }
});

// Referencias a elementos del DOM para jugadores, barras de vida y el log de acciones
let imgJugador1 = document.getElementById('img-jugador1');
let imgJugador2 = document.getElementById('img-jugador2');
let hp1Element = document.getElementById("hp1");
let hp2Element = document.getElementById("hp2");
let hp1Bar = document.getElementById("hp1-bar");
let hp2Bar = document.getElementById("hp2-bar");
let logElement = document.getElementById("log");

// Obtención de los nombres de los jugadores desde los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const jugador1 = urlParams.get('jugador1') || "default_player";
const jugador2 = urlParams.get('jugador2') || "default_enemy";

// Muestra los nombres de los jugadores en pantalla
document.getElementById('nombre-jugador1').innerText = jugador1.replace('_eleccion', '');
document.getElementById('nombre-jugador2').innerText = `${jugador2.replace('_eleccion', '')} (IA)`;

// Carga las imágenes correspondientes de los personajes
imgJugador1.src = `/boladragon/images/${jugador1}.png`;
imgJugador2.src = `/boladragon/images/${jugador2}.png`;

// Variables de vida y turno
let hp1 = 100;
let hp2 = 100;
let playerTurn = true;

// Diccionario con habilidades especiales de cada personaje
const habilidades = {
    "Cj": { name: "Grove Street Attack", damage: { min: 30, max: 35 } },
    "Diddy": { name: "Oil on top", damage: { min: 30, max: 35 } },
    "Churumbel": { name: "Pum!!!", damage: { min: 30, max: 35 } },
    "Among": { name: "Apuñalada Silenciosa", damage: { min: 30, max: 35 } },
    "Walter": { name: "¡Pastillazo Azul!!", damage: { min: 30, max: 35 } },
    "Franco": { name: "Golpe de Estado", damage: { min: 30, max: 35 } }
};

let habilidadUsada = 0; // Contador de uso de habilidad especial

// Verificamos si el personaje del jugador tiene su habilidad especial comprada
const inventario = JSON.parse(localStorage.getItem("inventory")) || [];
const nombreJugador = jugador1.replace('_eleccion', '').trim();
const habilidadComprada = inventario.includes(nombreJugador);

// Referencia al botón de habilidad especial
const btnHabilidad = document.getElementById("habilidadEspecial");

// Se asegura que el botón de habilidad especial siempre se muestre y esté habilitado visualmente
btnHabilidad.style.display = 'inline-block';
btnHabilidad.innerText = "Habilidad Especial";
btnHabilidad.disabled = false;
btnHabilidad.style.opacity = 1;

// Maneja el uso de la habilidad especial al presionar el botón
btnHabilidad.addEventListener("click", () => {
    if (!habilidadComprada) {
        logAction("❌ No has comprado este personaje para usar la habilidad especial.");
        return;
    }
    if (habilidadUsada < 3) {
        const habilidadJugador = habilidades[nombreJugador] || { name: "Habilidad Desconocida", damage: { min: 30, max: 35 } };
        logAction(`🌀 ${nombreJugador} usa su habilidad especial: ${habilidadJugador.name}`);
        habilidadUsada++;
        playerAttack(true, habilidadJugador);
    } else {
        logAction("❌ Solo puedes usar la habilidad especial 3 veces.");
    }
});

// Función para activar o desactivar los botones de control del jugador
function setControls(enabled) {
    document.getElementById("attack").disabled = !enabled;
    document.getElementById("evade").disabled = !enabled;
    document.getElementById("heal").disabled = !enabled;

    // Habilita o desactiva el botón de habilidad especial según los usos restantes
    if (habilidadUsada < 3 && enabled) {
        btnHabilidad.disabled = false;
        btnHabilidad.style.opacity = 1;
    } else {
        btnHabilidad.disabled = true;
        btnHabilidad.style.opacity = 0.5;
    }
}

// Muestra una acción en el log y hace scroll hacia abajo automáticamente
function logAction(text) {
    logElement.innerHTML += `<p>${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

// Actualiza visualmente las barras de vida y cambia su color si están bajas
function actualizarBarras() {
    hp1Bar.style.width = `${hp1}%`;
    hp2Bar.style.width = `${hp2}%`;

    hp1Bar.style.backgroundColor = hp1 <= 30 ? "#cc0000" : "#00cc00";
    hp2Bar.style.backgroundColor = hp2 <= 30 ? "#cc0000" : "#00cc00";
}

// Ejecuta un ataque del jugador, usando o no la habilidad especial
function playerAttack(habilidadEspecial = false, habilidadJugador = null) {
    if (!playerTurn) return;

    let damage = Math.floor(Math.random() * 20) + 5;

    if (habilidadEspecial && habilidadJugador) {
        damage = Math.floor(Math.random() * (habilidadJugador.damage.max - habilidadJugador.damage.min + 1)) + habilidadJugador.damage.min;
        logAction(`⚔️ ${nombreJugador} usa su habilidad especial (${habilidadJugador.name}) y causa ${damage} de daño.`);
    } else {
        logAction(`⚔️ ${nombreJugador} ataca y causa ${damage} de daño.`);
    }

    hp2 = Math.max(0, hp2 - damage);
    hp2Element.innerText = hp2;
    actualizarBarras();

    checkWin();

    if (hp2 > 0) {
        playerTurn = false;
        setControls(false);
        setTimeout(aiTurn, 500);
    }
}

// El jugador intenta esquivar un ataque
function playerEvade() {
    if (!playerTurn) return;
    logAction(`${nombreJugador} intenta esquivar...`);
    const evadeSuccess = Math.random() < 0.5;

    playerTurn = false;
    setControls(false);

    setTimeout(() => {
        if (evadeSuccess) {
            logAction("✨ ¡Esquiva exitosa! La IA falla su ataque.");
        } else {
            logAction("❌ ¡Falló la esquiva! La IA ataca.");
            aiTurn();
        }
        playerTurn = true;
        setControls(true);
    }, 500);
}

// El jugador se cura
function playerHeal() {
    if (!playerTurn) return;
    const healAmount = Math.floor(Math.random() * 12) + 10;
    hp1 = Math.min(100, hp1 + healAmount);
    hp1Element.innerText = hp1;
    actualizarBarras();
    logAction(`💖 ${nombreJugador} se cura ${healAmount} puntos de vida.`);
    playerTurn = false;
    setControls(false);
    setTimeout(aiTurn, 500);
}

// Turno de la IA (enemigo)
function aiTurn() {
    const nombreIA = jugador2.replace('_eleccion', '').trim();
    const habilidadIA = habilidades[nombreIA] || { name: "Ataque misterioso", damage: { min: 30, max: 35 } };

    const action = decideAIAction(habilidadIA);

    if (action === "special") {
        const damage = Math.floor(Math.random() * (habilidadIA.damage.max - habilidadIA.damage.min + 1)) + habilidadIA.damage.min;
        hp1 = Math.max(0, hp1 - damage);
        hp1Element.innerText = hp1;
        logAction(`⚡ ${nombreIA} (IA) usa su habilidad especial: ${habilidadIA.name} y causa ${damage} de daño.`);
    } else if (action === "attack") {
        const damage = Math.floor(Math.random() * 20) + 5;
        hp1 = Math.max(0, hp1 - damage);
        hp1Element.innerText = hp1;
        logAction(`⚔️ ${nombreIA} (IA) ataca y causa ${damage} de daño.`);
    } else if (action === "heal") {
        const healAmount = Math.floor(Math.random() * 12) + 10;
        hp2 = Math.min(100, hp2 + healAmount);
        hp2Element.innerText = hp2;
        logAction(`💖 ${nombreIA} (IA) se cura ${healAmount} puntos de vida.`);
    } else if (action === "evade") {
        logAction(`🌀 ${nombreIA} intenta esquivar...`);
        logAction(Math.random() < 0.5 ? "✨ ¡La IA esquiva con éxito!" : "❌ La IA falló la esquiva.");
    }

    actualizarBarras();
    checkWin();

    if (hp1 > 0) {
        playerTurn = true;
        setControls(true);
    }
}

// Lógica de decisión de la IA para su acción
function decideAIAction(habilidadIA) {
    const hpThreshold = 45;
    const specialChance = 0.4;

    if (hp2 <= hpThreshold && Math.random() < specialChance) return "special";
    if (hp2 <= 40 && Math.random() < 0.6) return "heal";
    if (Math.random() < 0.3) return "evade";
    return "attack";
}

// Verifica si alguien ha ganado
function checkWin() {
    if (hp1 <= 0) {
        showWinner("Jugador 2 (IA)");
    } else if (hp2 <= 0) {
        showWinner("Jugador 1");
    }
}

// Muestra el ganador, otorga recompensas y experiencia
function showWinner(winner) {
    const nombreGanador = winner === "Jugador 1"
        ? jugador1.replace('_eleccion', '')
        : jugador2.replace('_eleccion', '');

    document.getElementById("winnerText").innerText = `🏆 ¡${nombreGanador} GANA!`;
    document.getElementById("winnerScreen").style.display = "flex";
    setControls(false);

    if (winner === "Jugador 1") {
        // Ganancia de monedas
        const recompensa = 50;
        let monedas = parseInt(localStorage.getItem("coins")) || 0;
        monedas += recompensa;
        localStorage.setItem("coins", monedas);
        logAction(`💰 Ganaste ${recompensa} monedas. Total: ${monedas}`);

        // Ganancia de experiencia y subida de nivel
        let exp = parseInt(localStorage.getItem("exp")) || 0;
        let nivel = parseInt(localStorage.getItem("nivel")) || 1;
        let expNecesaria = 100 + (nivel - 1) * 150;
        let expGanada = 25;

        exp += expGanada;
        logAction(`✨ Ganaste ${expGanada} EXP. Total: ${exp}/${expNecesaria} EXP`);

        // Subida de nivel si se alcanza el umbral
        while (exp >= expNecesaria) {
            exp -= expNecesaria;
            nivel++;
            expNecesaria = 100 + (nivel - 1) * 150;
            logAction(`🔼 ¡Subiste al nivel ${nivel}!`);
        }

        localStorage.setItem("exp", exp);
        localStorage.setItem("nivel", nivel);
    }
}
