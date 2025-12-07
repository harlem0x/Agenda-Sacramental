// js/firebase-config.js

// Importa as funções necessárias usando os URLs do CDN para garantir a compatibilidade
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// SUAS CREDENCIAIS REAIS (Combinadas da Versão 2)
const firebaseConfig = {
    apiKey: "AIzaSyBHHfgfeV1lXiSFEIwGAs2LFAYTzqAnuw8",
    authDomain: "agenda-sacramental-9cc49.firebaseapp.com",
    
    // IMPORTANTE: Adicionar a databaseURL no formato correto.
    databaseURL: "https://agenda-sacramental-9cc49-default-rtdb.firebaseio.com", 
    
    projectId: "agenda-sacramental-9cc49",
    storageBucket: "agenda-sacramental-9cc49.firebasestorage.app",
    messagingSenderId: "662847791966",
    appId: "1:662847791966:web:93eecf296f1a10a948e5cf"
};

// 1. Inicializa o App
const app = initializeApp(firebaseConfig);

// 2. Obtém a instância do Realtime Database
const database = getDatabase(app);

// 3. Exporta para que o script.js possa usá-la
export { database };