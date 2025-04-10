document.addEventListener("DOMContentLoaded", () => {
  // Aplicar volumen guardado al iniciar la página
  const volumenGuardado = localStorage.getItem("volumen");
  if (volumenGuardado !== null) aplicarVolumen(volumenGuardado);

  // ---------------------- TIENDA --------------------------

  // Definición de los artículos disponibles en la tienda
  const shopItems = [
      { id: "Cj", name: "Grove Street Attack", price: 100, image: "/boladragon/images/Cj_eleccion.png" },
      { id: "Diddy", name: "Oil on top", price: 100, image: "/boladragon/images/Diddy_eleccion.png" },
      { id: "Franco", name: "Golpe de Estado", price: 666, image: "/boladragon/images/Franco_eleccion.png" },
      { id: "churumbel", name: "Puuuuummm!!!", price: 340, image: "/boladragon/images/churumbel_eleccion.png" },
      { id: "among", name: "Apuñalada silenciosa", price: 320, image: "/boladragon/images/Among_eleccion.png" },
      { id: "Walter", name: "Pastillaso azul", price: 500, image: "/boladragon/images/Walter_eleccion.png" },
  ];

  // Variables de la tienda
  const shopContainer = document.getElementById("shop");
  const coinsElement = document.getElementById("coins");
  const inventory = document.getElementById("inventory");

  // Obtener monedas del almacenamiento local o establecer un valor inicial
  let coins = parseInt(localStorage.getItem("coins"));
  if (isNaN(coins)) {
      coins = 100;
      localStorage.setItem("coins", coins);
  }

  // Obtener el inventario guardado en localStorage
  let savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];

  // Renderizar tienda con los artículos disponibles
  function renderShop() {
      shopContainer.innerHTML = "";
      shopItems.forEach((item, index) => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("item");

          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.name;

          const p = document.createElement("p");
          p.textContent = `${item.name} - ${item.price} monedas`;

          const button = document.createElement("button");
          button.classList.add("buy-button");
          button.dataset.index = index;

          // Verificar si el ítem ya ha sido comprado
          if (savedInventory.includes(item.id)) {
              button.textContent = "Ya Comprado";
              button.disabled = true;
          } else {
              button.textContent = "Comprar";
              button.addEventListener("click", () => buyItem(index, button));
          }

          itemDiv.appendChild(img);
          itemDiv.appendChild(p);
          itemDiv.appendChild(button);
          shopContainer.appendChild(itemDiv);
      });
  }

  // Función para comprar un ítem
  function buyItem(index, button) {
      const item = shopItems[index];
      if (coins >= item.price) {
          coins -= item.price;
          coinsElement.textContent = coins;

          savedInventory.push(item.id);
          localStorage.setItem("inventory", JSON.stringify(savedInventory));
          localStorage.setItem("coins", coins);

          button.textContent = "Ya Comprado";
          button.disabled = true;

          updateInventory();
      } else {
          alert("No tienes suficientes monedas");
      }
  }

  // Función para actualizar el inventario del jugador
  function updateInventory() {
      inventory.innerHTML = "";
      savedInventory.forEach(id => {
          const item = shopItems.find(p => p.id === id);
          const li = document.createElement("li");
          li.textContent = item ? item.name : id;
          inventory.appendChild(li);
      });
  }

  coinsElement.textContent = coins;
  updateInventory();
  renderShop();

  // ---------------------- EXPERIENCIA --------------------------

  const barra = document.getElementById("barra-exp");
  const texto = document.getElementById("exp-texto");

  let exp = parseInt(localStorage.getItem("exp")) || 0;
  let nivel = parseInt(localStorage.getItem("nivel")) || 1;

  // Obtener la experiencia necesaria para subir de nivel
  function getExpNecesaria(nivel) {
      return 100 + (nivel - 1) * 150; // Nivel 1 = 100, Nivel 2 = 250, Nivel 3 = 400, etc.
  }

  // Actualizar la barra de experiencia y verificar si el nivel aumenta
  function actualizarBarraExp() {
      const expMax = getExpNecesaria(nivel);
      if (exp >= expMax) {
          exp -= expMax;
          nivel++;
          localStorage.setItem("nivel", nivel);
      }

      const porcentaje = Math.min((exp / getExpNecesaria(nivel)) * 100, 100);
      if (barra) barra.style.width = `${porcentaje}%`;
      if (texto) texto.innerText = `Nivel: ${nivel} - Experiencia: ${exp} / ${getExpNecesaria(nivel)}`;
      localStorage.setItem("exp", exp);
  }

  actualizarBarraExp();
});