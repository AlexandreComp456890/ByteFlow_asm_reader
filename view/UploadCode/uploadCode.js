const fileInput = document.getElementById("fileInput"); // Seleciona o input de arquivo escondido
const dropZone = document.getElementById("dropZone"); // Seleciona a área de drop para arrastar/soltar arquivos
const fileContent = document.getElementById("fileContent"); // Seleciona o elemento para mostrar conteúdo do arquivo (não usado no código atual)
const uploadButton = document.getElementById("uploadButton"); // Seleciona o botão de executar ("Run")

let arquivoSelecionado = null; // Variável para armazenar o arquivo selecionado ou arrastado

// Abre o seletor de arquivo quando clica na área de drop
dropZone.addEventListener("click", () => fileInput.click());

// Evento quando um arquivo é arrastado sobre a área de drop
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Previne o comportamento padrão para permitir o drop
    dropZone.classList.add("dragover"); // Adiciona uma classe para mudar o estilo visual durante o drag
});

// Evento quando o arquivo sai da área de drop (arrastar para fora)
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover"); // Remove a classe que muda o estilo visual
});

// Evento quando o arquivo é solto na área de drop
dropZone.addEventListener("drop", (e) => {
    e.preventDefault(); // Previne o comportamento padrão do navegador
    dropZone.classList.remove("dragover"); // Remove a classe de estilo visual do drag
    const file = e.dataTransfer.files[0]; // Pega o primeiro arquivo do drop
    processarArquivo(file); // Processa o arquivo selecionado
});

// Evento quando o arquivo é selecionado pelo input escondido
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0]; // Pega o arquivo selecionado no input
    processarArquivo(file); // Processa o arquivo selecionado
});

// Evento quando o botão "Run" é clicado
uploadButton.addEventListener("click", () => {
    if (!arquivoSelecionado) { // Verifica se um arquivo foi selecionado antes
        alert("Please select or drag a file first."); // Alerta para escolher um arquivo antes
        return; // Sai da função para não continuar
    }

    const reader = new FileReader(); // Cria um leitor para ler o arquivo como texto
    reader.onload = function (e) {
        const clockDefiner = /^\s*Config_CPU\s*=\s*\[\s*([0-9.]+[A-Za-z]+)\s*,\s*([A-Za-z]\s*\=\s*[0-9])\s*,\s*([A-Za-z]\s*\=\s*[0-9])\s*,\s*([A-Za-z]\s*\=\s*[0-9])\s*\]\s*(?:#\s*(.*))\s*?$/i;
        const conteudo = e.target.result; // Obtém o conteúdo do arquivo lido

        let linhas = conteudo.split('\n'); // Divide o conteúdo em linhas
        if (clockDefiner.test(linhas[0])){
            const match = clockDefiner.exec(linhas[0])
            localStorage.setItem("frequency", match[1]);
        }else{
            console.warn("Clock frequency not set or poorly made. Running without time couter.")
        }
        linhas = linhas.splice(1); // Tira a linha de configuração do clock
        localStorage.setItem("assemblyCode", linhas.join("\n")); // Loga as linhas no console para debug

        // Abre uma nova janela para execução do código (simulador)
        abrirNovaJanela();
    };
    reader.readAsText(arquivoSelecionado); // Lê o arquivo selecionado como texto
});

// Função para processar e validar o arquivo selecionado
function processarArquivo(file) {
    const ext = file.name.split('.').pop().toLowerCase(); // Pega a extensão do arquivo em minúsculo
    if (ext !== "asm" && ext !== "txt") { // Verifica se a extensão é válida (.asm ou .txt)
        alert("Only .asm or .txt files are allowed."); // Alerta que só aceita esses formatos
        return; // Sai da função
    }
    arquivoSelecionado = file; // Salva o arquivo selecionado para uso posterior
    dropZone.textContent = `Selected file: ${file.name}`; // Atualiza o texto da área de drop com o nome do arquivo
}

// Função que abre uma nova janela para rodar o código
function abrirNovaJanela() {
    window.open('../CodeRun/codeRun.html', '_blank'); // Abre a página do simulador em uma nova aba
}
