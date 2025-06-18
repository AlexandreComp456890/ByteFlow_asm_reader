import { Interpreter } from "../../js/Runtime/Interpreter.js" 
import { ExecutionContext } from "../../js/Runtime/ExecutionContext.js";

let memory = [];
let baseAddresses = [];
let rowsPerPage = 16;
let currentPage = 0;
let count = 0;

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
        celulaTipo.textContent = `Type ${interp.typeOfInstr}`;
        novaLinha.appendChild(celulaTipo);

        const celulaCodificado = document.createElement("td");
        celulaCodificado.textContent = ExecutionContext.fixToHex(interp.currentEncodedInst);
        novaLinha.appendChild(celulaCodificado);

        const celulaInstrucao = document.createElement("td");
        celulaInstrucao.textContent = instrucao;
        novaLinha.appendChild(celulaInstrucao);

        tbody.appendChild(novaLinha);
    }
}

function stepingCode(interp,clock) {
    count = 0;
    const userGo = document.getElementById("stepInto");
    userGo.addEventListener("click", () => {
        const inlineCode = interp.stepInto();
        if (inlineCode.error !== undefined) {
            alert(inlineCode.error);
            return;
        } 
        if (inlineCode.done) {
            interp.typeOfInstr = "None";
            interp.currentEncodedInst = 0;
            alert("Execution finished.");
        }
        count++;
        atualizarRegistradores(interp);
        setCPUvalues(interp, clock);
        renderTable(currentPage);

        destacarLinhaExecucao(ExecutionContext.programCounter);
    });
}


function loadFullCode(interp) {
    const userGo = document.getElementById("runCode");
    userGo.addEventListener("click", () => {
        interp.run();
        atualizarRegistradores(interp);
        setCPUvalues(interp);
        renderTable(currentPage);
    });
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

function updatePaginationButtons() {
    document.getElementById('prevBtn').disabled = currentPage === 0;
    document.getElementById('nextBtn').disabled = (currentPage + 1) * rowsPerPage > memory.length;
}

function destacarLinhaExecucao(pc) {
    const tabela = document.getElementById("execucaoTabela").querySelector("tbody");
    const linhas = tabela.querySelectorAll("tr");

    linhas.forEach(linha => linha.classList.remove("highlight"));

    for (const linha of linhas) {
        const celulaPC = linha.cells[0].textContent.trim();
        if (celulaPC === ExecutionContext.fixToHex(pc)) {
            linha.classList.add("highlight");
            linha.scrollIntoView({ behavior: "smooth", block: "center" });
            break;
        }
    }
}

function destacarRegistradoresUsados(regIndices) {
    const linhas = document.querySelectorAll("#registradoresTabela tbody tr");
    linhas.forEach((linha) => linha.classList.remove("highlight"));

    regIndices.forEach(index => {
        if (linhas[index]) {
            linhas[index].classList.add("highlight");
            linhas[index].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
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

function atualizarRegistradores(interp) {
    const valores = Object.values(interp.context.registers);
    const linhas = document.querySelectorAll("#registradoresTabela tbody tr");

    linhas.forEach((linha, index) => {
        const celulas = linha.querySelectorAll("td");
        if (celulas.length === 3 && valores[index] !== undefined) {
            celulas[2].textContent = ExecutionContext.fixToHex(valores[index]);
        }
    });
}

function setCPUvalues(interp, clock) {
    const valoresCPU = document.getElementsByClassName("cpuValues");

    valoresCPU[0].textContent = ExecutionContext.fixToHex(ExecutionContext.programCounter - 4);
    const ns = (1 / clock) * count * 1e9;
    let formattedNs;
    valoresCPU[1].textContent = (!isNaN(clock) && clock > 0)
        ? formattedNs = parseFloat(ns.toPrecision(3)).toString() + " ns"
        : "N/A";
    valoresCPU[2].textContent = Array.isArray(interp.currentEncodedInst)
        ? interp.currentEncodedInst.map(encode => ExecutionContext.fixToHex(encode)).join(", ")
        : ExecutionContext.fixToHex(interp.currentEncodedInst);
    valoresCPU[3].textContent = ` ${interp.typeOfInstr}-Type`;
}

window.addEventListener("DOMContentLoaded", function () {
    const code = localStorage.getItem("assemblyCode");
    const freq = Number(localStorage.getItem("frequency"));
    if (code) {
        const linhas = code.split("\n").map(l => l.trim()).filter(l => l !== "");
        const interpreter = new Interpreter(linhas);

        adicionarLinhaTabela(interpreter);
        atualizarRegistradores(interpreter);
        renderTable(currentPage);
        destacarLinhaExecucao(ExecutionContext.programCounter);

        stepingCode(interpreter, freq);
        loadFullCode(interpreter);
    }
});