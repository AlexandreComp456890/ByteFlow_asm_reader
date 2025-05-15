const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const fileContent = document.getElementById("fileContent");
let arquivoSelecionado = null;

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    processarArquivo(file);
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    processarArquivo(file);
});

document.getElementById("uploadButton").addEventListener("click", () => {
    if (!arquivoSelecionado) {
        alert("Selecione ou arraste um arquivo primeiro.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const conteudo = e.target.result;
        fileContent.textContent = conteudo;
        fileContent.style.display = "block";

        const linhas = conteudo.split('\n');
        console.log("Linhas do arquivo:", linhas);
    };
    reader.readAsText(arquivoSelecionado);
});

function processarArquivo(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== "asm" && ext !== "txt") {
        alert("Apenas arquivos .asm ou .txt são aceitos.");
        return;
    }
    arquivoSelecionado = file;
    dropZone.textContent = `Arquivo selecionado: ${file.name}`;
}