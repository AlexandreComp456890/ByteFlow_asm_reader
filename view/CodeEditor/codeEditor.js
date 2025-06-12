// Variável global para armazenar a instância do editor CodeMirror
let editor;

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
    // Inicializa o CodeMirror a partir da <textarea> com ID "assemblyCode"
    editor = CodeMirror.fromTextArea(document.getElementById("assemblyCode"), {
        lineNumbers: true, // Exibe numeração das linhas
        mode: "gas",       // Define a linguagem Assembly (sintaxe GAS)
        theme: "dracula"   // Aplica o tema visual "dracula"
    });

    // Associa o clique do botão "saveCode" à função salvarCodigo()
    document.getElementById("saveCode").addEventListener("click", salvarCodigo);

    // Associa o clique do botão "runCode" à função rodarCodigo()
    document.getElementById("runCode").addEventListener("click", rodarCodigo);
});

// Função para salvar o conteúdo digitado no editor em um arquivo .asm
function salvarCodigo() {
    // Obtém e remove espaços extras do conteúdo digitado
    const conteudo = editor.getValue().trim();

    // Verifica se o conteúdo não está vazio
    if (conteudo) {
        // Cria um blob com o conteúdo (tipo texto)
        const blob = new Blob([conteudo], { type: "text/plain" });

        // Gera uma URL temporária para o blob
        const url = URL.createObjectURL(blob);
        // Cria um link <a> para download do arquivo

        const link = document.createElement("a");
        link.download = "codigo.asm"; // Nome do arquivo a ser salvo
        link.href = url;

        // Simula um clique no link para iniciar o download
        link.click();

        // Libera a URL criada da memória
        URL.revokeObjectURL(url);
    } else {
        // Alerta o usuário caso o editor esteja vazio
        alert("Enter some code before saving.");
    }
}

// Função para rodar o código digitado
function rodarCodigo() {
    // Obtém e remove espaços extras do conteúdo digitado
    const conteudo = editor.getValue().trim();
    //const clock = document.getElementById();
    console.log(conteudo);
    // Verifica se há conteúdo
    if (conteudo) {
        // Abre uma nova janela com o simulador ou executor
        localStorage.setItem("assemblyCode", conteudo);
        abrirNovaJanela();
    } else {
        // Alerta o usuário caso o editor esteja vazio
        alert("Enter some code before running.");
    }
}

// Função que abre uma nova aba/janela com a página de execução do código
function abrirNovaJanela() {
    window.open('../CodeRun/codeRun.html', '_blank'); // Abre em nova aba
}
