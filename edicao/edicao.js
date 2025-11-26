const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    
    const petsGrid = document.getElementById("pets-grid");
    const modalEdicao = document.getElementById("modal-edicao");
    const fecharModalBtn = document.getElementById("fechar-modal");
    const formEdicao = document.getElementById("form-edicao-animal");
    const botaoExcluir = document.getElementById("botao-excluir");
    const editFeedback = document.getElementById("edit-feedback-mensagem");
    
    fecharModalBtn.addEventListener("click", fecharModalEdicao);
    modalEdicao.addEventListener("click", (e) => {
        if (e.target.id === "modal-edicao") {
            fecharModalEdicao();
        }
    });
    
    formEdicao.addEventListener("submit", handleEdicao);
    botaoExcluir.addEventListener("click", handleExclusao);
    
    carregarPets(petsGrid); 

    function abrirModalEdicao(pet) {
        document.getElementById("edit-id").value = pet.id;
        document.getElementById("edit-nome").value = pet.nome || '';
        document.getElementById("edit-localizacao").value = pet.localizacao || '';
        document.getElementById("edit-telefone").value = pet.telefone || '';
        document.getElementById("edit-categoria").value = pet.categoria || '';
        document.getElementById("edit-tipo").value = pet.tipo || '';
        
        editFeedback.textContent = '';
        modalEdicao.style.display = "flex";
    }

    function fecharModalEdicao() {
        modalEdicao.style.display = "none";
        formEdicao.reset();
        document.getElementById("edit-imagem").value = ''; 
    }

    async function handleEdicao(event) {
        event.preventDefault();
        
        const petId = document.getElementById("edit-id").value;
        editFeedback.textContent = "Salvando alterações...";
        editFeedback.className = "text-blue-600";
        
        const dadosPet = {
            nome: document.getElementById("edit-nome").value,
            localizacao: document.getElementById("edit-localizacao").value,
            telefone: document.getElementById("edit-telefone").value,
            categoria: document.getElementById("edit-categoria").value,
            tipo: document.getElementById("edit-tipo").value
        };
        
        const imagemInput = document.getElementById("edit-imagem");
        
        const arquivoImagem = imagemInput && imagemInput.files.length > 0 
            ? imagemInput.files[0] 
            : null;

        try {
            const responsePet = await fetch(`${API_URL}/pets/${petId}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosPet)
            });

            if (!responsePet.ok) {
                const erro = await responsePet.json();
                throw new Error(erro.detail || "Falha ao salvar os dados.");
            }
            
            editFeedback.textContent = "Dados do pet salvos! Verificando imagem...";

            if (arquivoImagem) {
                const formDataImagem = new FormData();
                formDataImagem.append("image", arquivoImagem); 

                const responseImagem = await fetch(`${API_URL}/pets/${petId}/upload`, {
                    method: "POST",
                    body: formDataImagem
                });

                if (!responseImagem.ok) {
                    throw new Error("Dados salvos, mas falha ao atualizar a imagem.");
                }
            }

            editFeedback.textContent = "Animal editado com sucesso!";
            editFeedback.className = "text-green-600";
            
            await carregarPets(petsGrid); 
            fecharModalEdicao();

        } catch (error) {
            console.error("Erro na edição:", error);
            editFeedback.textContent = `Erro: ${error.message}`;
            editFeedback.className = "text-red-600";
        }
    }

    async function handleExclusao() {
        const petId = document.getElementById("edit-id").value;
        
        if (!confirm(`Tem certeza que deseja EXCLUIR o pet ID ${petId}? Essa ação é irreversível.`)) {
            return;
        }

        editFeedback.textContent = "Excluindo...";
        editFeedback.className = "text-red-600";

        try {
            const response = await fetch(`${API_URL}/pets/${petId}`, {
                method: "DELETE" 
            });

            if (!response.ok) {
                 const erro = await response.json();
                 throw new Error(erro.detail || "Falha ao excluir o pet.");
            }

            editFeedback.textContent = "Pet excluído com sucesso!";
            editFeedback.className = "text-green-600";
                        
            await carregarPets(petsGrid); 
            fecharModalEdicao();

        } catch (error) {
            console.error("Erro na exclusão:", error);
            editFeedback.textContent = `Erro na exclusão: ${error.message}`;
            editFeedback.className = "text-red-600";
        }
    }

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
        card.className = "bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative group";

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

        const editButton = document.createElement('button');
        editButton.className = 'absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10'; 
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-5.464 5.464l-1.55 3.102 3.102-1.55 7.424-7.424-1.55-3.102-3.102 1.55-7.424 7.424z" />
        </svg>`;

        editButton.onclick = () => abrirModalEdicao(pet);
        
        card.appendChild(editButton); 
        
        return card;
    }

}); 