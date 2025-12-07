import { database } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

function getDataAtualISO() {
    return new Date().toISOString().split('T')[0];
}

function getDataHoraAtual() {
    const agora = new Date();
    return agora.toLocaleString('pt-BR');
}

// *** FUNÇÃO DE TOGGLE REMOVIDA ***
// *** LISTENERS DE CHANGE REMOVIDOS ***

// LISTENERS RESTANTES
document.getElementById("submitButton").addEventListener("click", (e) => {
    e.preventDefault();
    salvarAgenda();
});

document.getElementById('data').addEventListener("change", carregarAgendaPorData);

// SALVAR
function salvarAgenda() {
    const data = document.getElementById("data").value;
    const anuncios = document.getElementById("anuncios").value;

    // --- LÓGICA SIMPLIFICADA DE CAPTURA DE VALOR ---
    // A prioridade é sempre o campo de texto 'Outro' se ele estiver preenchido.

    // 1. PRESIDIDA
    const presididaSelect = document.getElementById("presidida").value;
    const presididaOutro = document.getElementById("presididaOutro").value.trim();
    // Se o campo Outro tiver valor, usa Outro; caso contrário, usa o Select.
    const presidida = presididaOutro !== '' ? presididaOutro : presididaSelect;

    // 2. DIRIGINDO
    const dirigindoSelect = document.getElementById("dirigindo").value;
    const dirigindoOutro = document.getElementById("dirigindoOutro").value.trim();
    const dirigindo = dirigindoOutro !== '' ? dirigindoOutro : dirigindoSelect;

    // 3. REGENTE
    const regenteSelect = document.getElementById("regente").value;
    const regenteOutro = document.getElementById("regenteOutro").value.trim();
    const regente = regenteOutro !== '' ? regenteOutro : regenteSelect;

    // --- FIM DA LÓGICA SIMPLIFICADA ---

    const primeiro_hino = document.getElementById("primeiro_hino").value;
    const hino_sacramental = document.getElementById("hino_sacramental").value;
    const ultimo_hino = document.getElementById("ultimo_hino").value;
    const primeira_oracao = document.getElementById("primeira_oracao").value;
    const ultima_oracao = document.getElementById("ultima_oracao").value;
    const primeiro_orador = document.getElementById("primeiro_orador").value;
    const segundo_orador = document.getElementById("segundo_orador").value;
    const terceiro_orador = document.getElementById("terceiro_orador").value;

    if (!data) {
        alert("Por favor, selecione a data da reunião.");
        return;
    }

    const dataFormatada = data.replace(/-/g, '_');

    const dadosAgenda = { 
        data, anuncios, presidida, dirigindo, regente, // Os valores finais
        primeiro_hino, hino_sacramental, ultimo_hino,
        primeira_oracao, ultima_oracao,
        primeiro_orador, segundo_orador, terceiro_orador,
        dataEnvio: new Date().toISOString()
    };

    set(ref(database, "agendas/" + dataFormatada), dadosAgenda)
        .then(() => alert(`Agenda de ${data} salva com sucesso!`))
        .catch(error => console.error("Erro ao salvar:", error));
}

// LIMPAR CAMPOS
function limparCampos() {
    document.getElementById("anuncios").value = "";
    document.getElementById("presidida").value = "";
    document.getElementById("dirigindo").value = "";
    document.getElementById("regente").value = "";
    document.getElementById("primeiro_hino").value = "";
    document.getElementById("hino_sacramental").value = "";
    document.getElementById("ultimo_hino").value = "";
    document.getElementById("primeira_oracao").value = "";
    document.getElementById("ultima_oracao").value = "";
    document.getElementById("primeiro_orador").value = "";
    document.getElementById("segundo_orador").value = "";
    document.getElementById("terceiro_orador").value = "";

    // Apenas limpar os inputs "Outro", sem esconder/mostrar
    document.getElementById("presididaOutro").value = "";
    document.getElementById("regenteOutro").value = "";
    document.getElementById("dirigindoOutro").value = "";
    
    // LINHAS DE display: none; FORAM REMOVIDAS
}

// CARREGAR POR DATA
function carregarAgendaPorData() {
    const data = document.getElementById("data").value;
    if (!data) return;

    const dataFormatada = data.replace(/-/g, '_');
    const dbRef = ref(database, "agendas/" + dataFormatada);

    onValue(dbRef, (snapshot) => {
        limparCampos();

        if (!snapshot.exists()) return;

        const dados = snapshot.val();
        
        // --- LÓGICA SIMPLIFICADA DE CARREGAMENTO DE VALOR ---
        
        // Função auxiliar para carregar o valor
        function carregarValor(selectId, inputOutroId, valor) {
            const select = document.getElementById(selectId);
            const inputOutro = document.getElementById(inputOutroId);
            
            // Verifica se o valor guardado está nas opções padrão
            if ([...select.options].map(o => o.value).includes(valor)) {
                // Se estiver, seleciona no dropdown
                select.value = valor;
                inputOutro.value = ''; // Garante que o campo Outro fica vazio
            } else {
                // Se não estiver (é um nome customizado/Outro), limpa o dropdown e preenche o input Outro
                select.value = ''; 
                inputOutro.value = valor;
            }
        }
        
        // Aplica a lógica para cada campo
        carregarValor('presidida', 'presididaOutro', dados.presidida);
        carregarValor('dirigindo', 'dirigindoOutro', dados.dirigindo);
        carregarValor('regente', 'regenteOutro', dados.regente);
        
        // Campos restantes
        document.getElementById("anuncios").value = dados.anuncios || "";
        document.getElementById("primeiro_hino").value = dados.primeiro_hino || "";
        document.getElementById("hino_sacramental").value = dados.hino_sacramental || "";
        document.getElementById("ultimo_hino").value = dados.ultimo_hino || "";
        document.getElementById("primeira_oracao").value = dados.primeira_oracao || "";
        document.getElementById("ultima_oracao").value = dados.ultima_oracao || "";
        document.getElementById("primeiro_orador").value = dados.primeiro_orador || "";
        document.getElementById("segundo_orador").value = dados.segundo_orador || "";
        document.getElementById("terceiro_orador").value = dados.terceiro_orador || "";
    }, { onlyOnce: true });
}

// INICIALIZAÇÃO
function carregarDados() {
    const dataInput = document.getElementById("data");
    dataInput.value = getDataAtualISO(); 
    
    // Apenas carrega os dados
    carregarAgendaPorData();
    
    // *** AS CHAMADAS A toggleOutroInput FORAM REMOVIDAS ***
}

window.addEventListener("load", carregarDados);