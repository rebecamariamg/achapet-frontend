
const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    
    const petsGrid = document.getElementById("pets-grid");
    
    carregarPets(petsGrid); 

    async function carregarPets(gridElement) { 
        if (!gridElement) {
            console.error("Erro: O elemento com ID 'pets-grid' não foi encontrado.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/pets/`);
            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`Não foi possível carregar os pets. Status: ${response.status} - ${errorText}`);
            }
            let pets = await response.json();

            pets = pets.filter(pet => pet.categoria === "Para Adoção");

            gridElement.innerHTML = ""; 

            if (pets.length === 0) {
                gridElement.innerHTML = "<p class='text-gray-500'>Nenhum animal cadastrado ainda.</p>";
                return;
            }

            pets.forEach(pet => {
                const card = criarPetCard(pet);
                gridElement.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao carregar pets:", error);
            gridElement.innerHTML = `<p class='text-red-500'>Erro ao carregar animais: ${error.message}</p>`;
        }
    }
    
    function criarPetCard(pet) {
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105";

        const imageUrl = pet.image_path 
            ? `${API_URL}/${pet.image_path}` 
            : `https://placehold.co/400x300/E2E8F0/94A3B8?text=${pet.tipo || 'Pet'}`;

        let tagColor = "bg-gray-200 text-gray-800"; 
        if (pet.categoria === "Perdido") tagColor = "bg-red-100 text-red-800";
        if (pet.categoria === "Para Adoção") tagColor = "bg-green-100 text-green-800";
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="Foto de ${pet.nome}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-xl font-bold text-gray-900">${pet.nome || 'Sem nome'}</h3>
                    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagColor}">
                        ${pet.categoria || 'N/A'}
                    </span>
                </div>
                <p class="text-sm text-gray-600 capitalize mb-1">
                    <strong>Tipo:</strong> ${pet.tipo || 'N/A'}
                </p>
                <p class="text-sm text-gray-600 mb-1">
                    <strong>Local:</strong> ${pet.localizacao}

                </p>
                <p class="text-sm text-gray-600">
                    <strong>Contato:</strong> ${pet.telefone}
                </p>
            </div>
        `;
        return card;
    }
}); 