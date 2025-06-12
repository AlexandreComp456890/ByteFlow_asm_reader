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
    const clockFreq = document.getElementById("clockFrequency").value.trim();
    // Verifica se o conteúdo não está vazio
    if (conteudo) {
        // Cria um blob com o conteúdo (tipo texto)
        const addClock = (clock) => {
            return `Config_CPU = [${clock}]\n`
        }
        const blob = new Blob([addClock(clockFreq), conteudo], { type: "text/plain" });

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
    const clockFreq = document.getElementById("clockFrequency").value.trim();
    // Verifica se há conteúdo
    if (conteudo) {
        // Abre uma nova janela com o simulador ou executor
        verificarClock(clockFreq);
        localStorage.setItem("assemblyCode", conteudo);
        
        abrirNovaJanela();
    } else {
        // Alerta o usuário caso o editor esteja vazio
        alert("Enter some code before running.");
    }
}

function verificarClock(clockString){
    const clockDefiner = /^([0-9.]+)([a-zA-Z]+)$/;
    if (clockDefiner.test(clockString)) {
        const match = clockString.match(clockDefiner);
        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        const multiplicador = (string) => {
            switch (string){
                case "GHZ":
                    return 1000000000;
                case "MHZ":
                    return 1000000;
                case "KHZ":
                    return 1000;
                case "HZ":
                    return 1;
                default:
                    console.warn("Clock frequency poorly made. Running without time couter.")
                    return 0;
            }
        }
        const fatorMultiplicativo = multiplicador(unit.toUpperCase());
        
        if(fatorMultiplicativo === 0) return;
        localStorage.setItem("frequency", value*fatorMultiplicativo);
    }else{
        console.warn("Clock frequency not set or poorly made. Running without time couter.")
    }
}

// Função que abre uma nova aba/janela com a página de execução do código
function abrirNovaJanela() {
    window.open('../CodeRun/codeRun.html', '_blank'); // Abre em nova aba
}
