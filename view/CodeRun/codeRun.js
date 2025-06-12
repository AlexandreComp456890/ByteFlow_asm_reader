import { Interpreter } from "../../js/Runtime/Interpreter.js"
import { ExecutionContext } from "../../js/Runtime/ExecutionContext.js";

let memory = [];
let baseAddresses = [];
let rowsPerPage = 16;
let currentPage = 0;

let interp = new Interpreter();

function adicionarLinhaTabela(interp) {
    const tabela = document.getElementById("execucaoTabela");
    const tbody = tabela.querySelector("tbody");

    const allLines = interp.context.allLines;

    for (const endereco in allLines) {
        const instrucao = allLines[endereco];

        const novaLinha = document.createElement("tr");

        const celulaEndereco = document.createElement("td");
        celulaEndereco.textContent = ExecutionContext.fixToHex(Number(endereco));
        novaLinha.appendChild(celulaEndereco);
        
        const celulaTipo = document.createElement("td");
        celulaTipo.textContent = "";
        novaLinha.appendChild(celulaTipo);

        const celulaCodificado = document.createElement("td");
        celulaCodificado.textContent = "";
        novaLinha.appendChild(celulaCodificado);

        const celulaInstrucao = document.createElement("td");
        celulaInstrucao.textContent = instrucao;
        novaLinha.appendChild(celulaInstrucao);

        tbody.appendChild(novaLinha);
    }
}

function prepararMemoria() {
    const enderecos = Object.keys(ExecutionContext.memory);
    const valores = Object.values(ExecutionContext.memory);

    memory = [];
    baseAddresses = [];

    for (let i = 0; i < enderecos.length; i += 8) {
        const row = [];
        for (let j = 0; j < 8; j++) {
            const index = i + j;
            if (index < valores.length) {
                row.push(ExecutionContext.fixToHex(Number(valores[index])));
            }
        }
        memory.push(row);
        baseAddresses.push(ExecutionContext.fixToHex(Number(enderecos[i])));
    }
}

function renderTable(page) {
    prepararMemoria();
    const tabela = document.getElementById("memoriaTabela");
    const tbody = tabela.querySelector("tbody");
    tbody.innerHTML = "";

    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    for (let i = start; i < end && i < memory.length; i++) {
        const novaLinha = document.createElement("tr");

        const celulaEndereco = document.createElement("td");
        celulaEndereco.textContent = baseAddresses[i];
        novaLinha.appendChild(celulaEndereco);

        for (let j = 0; j < 8; j++) {
            const celulaValor = document.createElement("td");
            celulaValor.id = `cell-${i}-${j}`;
            celulaValor.textContent = memory[i][j];
            novaLinha.appendChild(celulaValor);
        }

        tbody.appendChild(novaLinha);
    }

    document.getElementById('pageNumber').textContent = `Page ${page + 1}`;
    updatePaginationButtons();
}

function updateCell(rowIndex, colIndex, newValue) {
    memory[rowIndex][colIndex] = newValue;

    const targetPage = Math.floor(rowIndex / rowsPerPage);
    if (targetPage !== currentPage) {
        currentPage = targetPage;
    }
    
    renderTable(currentPage);
    
    setTimeout(() => {
        const cell = document.getElementById(`cell-${rowIndex}-${colIndex}`);
        if (cell) {
            cell.textContent = newValue;
            cell.classList.add("highlight");
            cell.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => cell.classList.remove("highlight"), 1500);
        }
    }, 50);
}

window.nextPage = () => {
    if ((currentPage + 1) * rowsPerPage < memory.length) {
        currentPage++;
        renderTable(currentPage);    
    }
}

window.prevPage = () => {
    if (currentPage > 0) {
        currentPage--;
        renderTable(currentPage);
    }
}

function updatePaginationButtons() {
    document.getElementById('prevBtn').disabled = currentPage === 0;
    document.getElementById('nextBtn').disabled = (currentPage + 1) * rowsPerPage > memory.length;
}

function atualizarRegistradores(interp){
    const valores = Object.values(interp.context.registers);
    const linhas = document.querySelectorAll("#registradoresTabela tbody tr");

    linhas.forEach((linha, index) => {
        const celulas = linha.querySelectorAll("td");
        if (celulas.length === 3 && valores[index] !== undefined) {
            celulas[2].textContent = ExecutionContext.fixToHex(valores[index]);
        }
    });
}

function setCPUvalues(interp){
    const valoresCPU = document.getElementsByClassName("cpuValues");

    valoresCPU[0].textContent = ExecutionContext.fixToHex(ExecutionContext.programCounter);
    valoresCPU[1].textContent = "N/A";
    valoresCPU[2].textContent = ExecutionContext.fixToHex(interp.context.cu);
    valoresCPU[3].textContent = `Type`;
}



window.addEventListener("DOMContentLoaded", function () {
    const code = localStorage.getItem("assemblyCode");
    if (code) {
        const linhas = code.split("\n").map(l => l.trim()).filter(l => l !== "");
        const interpreter = new Interpreter();
        interpreter.run(linhas);

        // Now `interpreter.context.allLines` is populated
        // Call your table rendering function here:
        adicionarLinhaTabela(interpreter);
        renderTable(currentPage);
        atualizarRegistradores(interpreter);
        setCPUvalues(interpreter);
    }
});

