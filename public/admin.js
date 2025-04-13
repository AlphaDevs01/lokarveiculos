document.addEventListener("DOMContentLoaded", () => {
  const vehicleTable = document.getElementById("vehicleTable");
  const addVehicleForm = document.getElementById("addVehicleForm");

  let editingVehicleId = null; // Armazena o ID do veículo em edição

  const API_URL = "https://lokarveiculos.vercel.app/api/veiculos";

  const renderAdminTable = (vehicles) => {
    vehicleTable.innerHTML = "";

    if (vehicles.length === 0) {
      vehicleTable.innerHTML = `<p class="text-gray-400 text-sm">Nenhum veículo cadastrado ainda.</p>`;
      return;
    }

    vehicles.forEach((vehicle) => {
      const card = document.createElement("div");
      card.className =
        "bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-4 shadow-md flex justify-between items-center";

      card.innerHTML = `
        <div>
          <h3 class="text-lg font-semibold">${vehicle.name} (${vehicle.year})</h3>
          <p class="text-amber-400 font-medium">R$ ${vehicle.price}</p>
        </div>
        <div class="flex gap-2">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            data-id="${vehicle.id}">
            Editar
          </button>
          <button
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            data-id="${vehicle.id}">
            Excluir
          </button>
        </div>
      `;

      const editButton = card.querySelector(".bg-blue-600");
      const deleteButton = card.querySelector(".bg-red-600");

      editButton.addEventListener("click", () => {
        startEditingVehicle(vehicle);
      });

      deleteButton.addEventListener("click", () => {
        if (confirm(`Tem certeza que deseja excluir "${vehicle.name}"?`)) {
          deleteVehicle(vehicle.id);
        }
      });

      vehicleTable.appendChild(card);
    });
  };

  const loadVehicles = async () => {
    vehicleTable.innerHTML = `<p class="text-gray-400 animate-pulse">Carregando veículos...</p>`;
    try {
      const response = await fetch(API_URL);
      const vehicles = await response.json();
      renderAdminTable(vehicles);
    } catch (error) {
      vehicleTable.innerHTML = `<p class="text-red-500">Erro ao carregar os veículos.</p>`;
      console.error("Erro ao carregar os veículos:", error);
    }
  };

  if (addVehicleForm) {
    addVehicleForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const vehicleData = {
        name: document.getElementById("name").value,
        year: parseInt(document.getElementById("year").value),
        price: document.getElementById("price").value,
        image: document.getElementById("image").value,
      };

      try {
        if (editingVehicleId) {
          // Atualizar veículo existente
          const res = await fetch(`/api/veiculos/${editingVehicleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicleData),
          });

          if (res.ok) {
            editingVehicleId = null; // Resetar o ID de edição
            addVehicleForm.reset();
            loadVehicles();
          } else {
            alert("Erro ao atualizar o veículo.");
          }
        } else {
          // Adicionar novo veículo
          const res = await fetch("/api/veiculos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicleData),
          });

          if (res.ok) {
            addVehicleForm.reset();
            loadVehicles();
          } else {
            alert("Erro ao adicionar o veículo.");
          }
        }
      } catch (error) {
        console.error("Erro ao salvar o veículo:", error);
      }
    });
  }

  const startEditingVehicle = (vehicle) => {
    editingVehicleId = vehicle.id;
    document.getElementById("name").value = vehicle.name;
    document.getElementById("year").value = vehicle.year;
    document.getElementById("price").value = vehicle.price;
    document.getElementById("image").value = vehicle.image;
  };

  const deleteVehicle = async (id) => {
    try {
      await fetch(`/api/veiculos/${id}`, { method: "DELETE" });
      loadVehicles();
    } catch (error) {
      console.error("Erro ao excluir o veículo:", error);
    }
  };

  loadVehicles();
});
