const API_URL = "http://localhost:3000/auth";

const titulo = document.getElementById("titulo-formulario");
const form = document.getElementById("form-auth");
const formErros = document.getElementById("form-erros");
const btnEnviar = document.getElementById("btn-enviar");
const linkAlternar = document.getElementById("link-alternar");
const campoUsername = document.getElementById("username");
const campoPassword = document.getElementById("password");

let modoRegistro = false;

verificarSessaoExistente();

linkAlternar.addEventListener("click", (evento) => {
    evento.preventDefault();
    modoRegistro = !modoRegistro;
    formErros.textContent = "";

    if (modoRegistro) {
        titulo.textContent = "Criar conta";
        btnEnviar.textContent = "Cadastrar";
        linkAlternar.textContent = "Já tem conta? Entrar";
    } else {
        titulo.textContent = "Entrar";
        btnEnviar.textContent = "Entrar";
        linkAlternar.textContent = "Ainda não tem conta? Cadastre-se";
    }
});

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    formErros.textContent = "";

    const username = campoUsername.value.trim();
    const password = campoPassword.value;

    try {
        if (modoRegistro) {
            await registrar(username, password);
        }

        await entrar(username, password);
        window.location.href = "index.html";
    } catch (erro) {
        formErros.textContent = erro.message;
    }
});

async function registrar(username, password) {
    const resposta = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.errors ? dados.errors.join(" ") : dados.error);
    }
}

async function entrar(username, password) {
    const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.errors ? dados.errors.join(" ") : dados.error);
    }
}

async function verificarSessaoExistente() {
    try {
        const resposta = await fetch(`${API_URL}/me`, { credentials: "include" });

        if (resposta.ok) {
            window.location.href = "index.html";
        }
    } catch (erro) {
        // backend indisponível: permanece na tela de login
    }
}
