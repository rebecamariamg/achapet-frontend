const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-cadastro-animal");
    const feedback = document.getElementById("feedback-mensagem");
    const petsGrid = document.getElementById("pets-grid");

    form.addEventListener("submit", handleCadastro);
    async function handleCadastro(event) {
        event.preventDefault(); 
        feedback.textContent = "Enviando dados do pet...";
        feedback.className = "text-blue-600";

        const dadosPet = {
            nome: document.getElementById("nome").value,
            localizacao: document.getElementById("localizacao").value,
            telefone: document.getElementById("telefone").value,
            categoria: document.getElementById("categoria").value,
            tipo: document.getElementById("tipo").value
        };

        const imagemInput = document.getElementById("imagem");
        const arquivoImagem = imagemInput.files[0];

        try {
            const responsePet = await fetch(`${API_URL}/pets/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosPet)
            });

            if (!responsePet.ok) {
                const erro = await responsePet.json();
                throw new Error(erro.detail || "Falha ao cadastrar os dados do pet. Verifique os campos.");
            }

            const petCriado = await responsePet.json();
            const petId = petCriado.id;

            feedback.textContent = "Dados do pet salvos! Enviando imagem...";
            if (arquivoImagem) {
                const formDataImagem = new FormData();
                formDataImagem.append("image", arquivoImagem); 

                const responseImagem = await fetch(`${API_URL}/pets/${petId}/upload`, {
                    method: "POST",
                    body: formDataImagem
                });

                if (!responseImagem.ok) {
                    throw new Error("Dados salvos, mas falha ao enviar a imagem.");
                }
            }

            feedback.textContent = "Animal cadastrado com sucesso!";
            feedback.className = "text-green-600";
            form.reset();

        } catch (error) {
            console.error("Erro no cadastro:", error);
            feedback.textContent = `Erro: ${error.message}`;
            feedback.className = "text-red-600";
        }
    
    }
}); 