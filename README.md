# 🐾 AchaPet Frontend

**HTML + TailwindCSS + JavaScript**

Interface web do sistema **AchaPet**, responsável por exibir, cadastrar, editar e excluir pets perdidos ou para adoção.
Conecta diretamente ao backend FastAPI em **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.

API disponível em: https://github.com/rebecamariamg/achapet-backend

---

## 📁 Estrutura do Projeto

O projeto é organizado em páginas independentes, cada uma com seu próprio HTML, JavaScript e estilização via Tailwind.

```
/
├── adocao/
│   ├── adocao.html
│   └── adocao.js
│
├── cadastro/
│   ├── cadastro.html
│   └── cadastro.js
│
├── edicao/
│   ├── edicao.html
│   └── edicao.js
│
├── home/
│   ├── home.html
│   └── home.js
│
├── perdidos/
│   ├── perdidos.html
│   └── perdidos.js
│
├── .vscode/               # Configurações do editor
└── assets/ (opcional)     # Imagens, ícones, logos
```

Cada página do frontend se comunica com a API utilizando **fetch()** e o base URL:

```js
const API_URL = "http://127.0.0.1:8000";
```

---

## 🎨 Estilos

O projeto usa **TailwindCSS** direto pelo CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Isso permite estilização rápida e responsiva sem instalação adicional.

---

## 🔌 Conexão com o Backend

Para que o frontend funcione corretamente:

1. O backend FastAPI deve estar rodando:

   ```bash
   uvicorn app.main:app --reload
   ```
2. As rotas consumidas pelo frontend são:

| Ação             | Método | Rota                |
| ---------------- | ------ | ------------------- |
| Listar pets      | GET    | `/pets/`            |
| Atualizar pet    | PUT    | `/pets/{id}`        |
| Excluir pet      | DELETE | `/pets/{id}`        |
| Upload da imagem | POST   | `/pets/{id}/upload` |

---

## 🧩 Funcionalidades Principais

### ✔ Listagem de Pets

Carrega automaticamente os pets e cria cards estilizados:

```js
const response = await fetch(`${API_URL}/pets/`);
const pets = await response.json();
```

### ✔ Edição com Modal

Abre modal, preenche os campos e envia:

```js
const responsePet = await fetch(`${API_URL}/pets/${petId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosPet)
});
```

### ✔ Exclusão de Pets

Com confirmação:

```js
fetch(`${API_URL}/pets/${petId}`, { method: "DELETE" });
```

### ✔ Upload de Imagem

Feito após editar dados:

```js
formDataImagem.append("image", arquivoImagem);
fetch(`${API_URL}/pets/${petId}/upload`, { method: "POST", body: formDataImagem });
```

---

## 🚀 Como Rodar o Frontend

### 1️⃣ Certifique-se de que o backend está funcionando

```bash
source venv/bin/activate
uvicorn app.main:app --reload
```

### 2️⃣ Abra o frontend no navegador

Não precisa instalar nada!
Basta abrir qualquer página `.html`, por exemplo:

```
home/home.html
```

ou

```
perdidos/perdidos.html
```

Clique duas vezes ou abra via Live Server (VS Code).

---

## 🛠 Tecnologias Utilizadas

* **HTML5**
* **TailwindCSS**
* **JavaScript Vanilla**
* **Fetch API**
* Integração com **FastAPI + PostgreSQL**

