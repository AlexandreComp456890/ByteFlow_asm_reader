// Função para adicionar a classe 'active' ao link da página atual
function setActiveLink() {
    const path = window.location.pathname.split("/").pop();  // Pega só o nome do arquivo da URL atual
    const links = document.querySelectorAll(".nav-link"); // Seleciona todos os links do menu

    // Remove a classe 'active' de todos os links para resetar
    links.forEach(link => link.classList.remove("active"));

    // Adiciona a classe 'active' só no link da página atual
    if (path === "index.html") {
        document.getElementById("home").classList.add("active");
    } else if (path === "uploadCode.html") {
        document.getElementById("upload").classList.add("active");
    } else if (path === "codeEditor.html") {
        document.getElementById("editor").classList.add("active");
    }
}

// Executa a função assim que a página carregar
window.onload = setActiveLink;
