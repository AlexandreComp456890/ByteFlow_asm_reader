// Função para adicionar a classe 'active' ao link da página atual
function setActiveLink() {
    const path = window.location.pathname.split("/").pop();  // Captura o nome da página atual
    const links = document.querySelectorAll(".nav-link"); // Seleciona todos os links

    // Remove a classe 'active' de todos os links
    links.forEach(link => link.classList.remove("active"));

    // Adiciona a classe 'active' ao link correspondente à página atual
    if (path === "index.html") {
        document.getElementById("home").classList.add("active");
    } else if (path === "uploadCode.html") {
        document.getElementById("upload").classList.add("active");
    } else if (path === "codeEditor.html") {
        document.getElementById("editor").classList.add("active");
    }
}

// Chama a função quando a página for carregada
window.onload = setActiveLink;