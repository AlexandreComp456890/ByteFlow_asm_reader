// Variável global do editor
let editor;

// Variável global para armazenar o código submetido em vetor
let codigoSubmetido = [];

document.addEventListener("DOMContentLoaded", function () {
    // Inicializa o editor CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById("assemblyCode"), {
        lineNumbers: true,
        mode: "gas",
        theme: "dracula"
    });

    // Botões
    document.getElementById("saveCode").addEventListener("click", salvarCodigo);
    document.getElementById("runCode").addEventListener("click", rodarCodigo);
    document.getElementById("submitCode").addEventListener("click", enviarCodigo);
});

// Salvar o código em arquivo .asm
function salvarCodigo() {
    const conteudo = editor.getValue();
    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "codigo.asm";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

// Simular execução
function rodarCodigo() {
    const conteudo = editor.getValue();
    console.log("Rodando o código...");
    console.log(conteudo);
    alert("Função 'Run' ainda não implementada.");
}

// Submeter código e salvar em vetor
function enviarCodigo() {
    const conteudo = editor.getValue();
    codigoSubmetido = conteudo.split('\n'); // quebra linha por linha

    console.log("Código submetido (vetor):", codigoSubmetido);
    alert("Código armazenado em variável (veja console).");
}