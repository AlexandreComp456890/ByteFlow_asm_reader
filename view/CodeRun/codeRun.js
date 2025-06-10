function adicionarLinhaTabela(idTabela, dados) {
    const tabela = document.getElementById(idTabela);
    const tbody = tabela.querySelector("tbody");

    const novaLinha = document.createElement("tr");

    dados.forEach(valor => {
        const celula = document.createElement("td");
        celula.textContent = valor;
        novaLinha.appendChild(celula);
    });

    tbody.appendChild(novaLinha);
}
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("execucaoTabela", ["PC1", "TipoX", "EncodingY", "LinhaZ"]);
adicionarLinhaTabela("memoriaTabela", ["0x00400000"]);
adicionarLinhaTabela("memoriaTabela", ["0x00400000"]);
adicionarLinhaTabela("memoriaTabela", ["0x00400000"]);
adicionarLinhaTabela("memoriaTabela", ["0x00400000"]);
adicionarLinhaTabela("memoriaTabela", ["0x00400000"]);
adicionarLinhaTabela("memoriaTabela", ["0x00400000"]);