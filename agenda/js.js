
/* <label class="item">
<input type="checkbox">
<div>TESTE ITEM</div>
<input type="button" value="X">
</label> */


// let banco = [
//     {'tarefa':'Estudar JS','status':''},
//     {'tarefa':'Estudar Python','status':'checked'},
//     {'tarefa':'Estudar Django','status':''},   
// ]


//const fatura = // Criação do objeto fatura.
//const faturaJSON = JSON.stringify(fatura); // Transforma o objeto literal em JSON.
//const novamenteObjFatura = JSON.parse(faturaJSON); // Transforma o JSON em objeto literal.


const data = new Date().toLocaleDateString(); //TRAZ A DATA DO DIA
const campoData = document.querySelector('.datadia')
campoData.textContent = data

const getBanco = () => JSON.parse(localStorage.getItem('tarefas')) ?? []; //SE TIVER ALGUMA COISA NO LOCALSTORAFGE PEGA,SE NÃO FICA VAZIO
const setBanco = (banco) => localStorage.setItem('tarefas', JSON.stringify(banco)); // ADICIONA NO localStorage

//data-indice=${indice} --> ATRIBUTOS EXTRAS 

const criarItem = (tarefa, status, indice) => {

    const item = document.createElement('label');
    item.classList.add('item');
    item.innerHTML = `
        <input class="check" type="checkbox" ${status} data-indice=${indice}> 
        <div class="tarefa">${tarefa}</div>
        <input class="fechar" type="button" value="Excluir" data-indice=${indice}>
        `
    document.querySelector('#lista').appendChild(item)

}


const limparTarefas = () => {
    const lista = document.querySelector('#lista')
    while (lista.firstChild) {                   //ENQUANTO EXISTIR O PRIMEIRO FILHO (firstChild--> primeiro filho)
        lista.removeChild(lista.lastChild);       //REMOVE O ULTIMO FILHO (lastChild-->ultimo filho)

    }
}

//forEach --> PERCORRE O BANCO
const atualizarTela = () => {
    limparTarefas();
    const banco = getBanco();  // PEGA TUDO DO BANCO (localStorage)

    banco.forEach((item, indice) => criarItem(item.tarefa, item.status, indice));  //cria a variavel (item) e manda pra função criarItem como parametro
    //cria a variavel (indice) e manda pra função criarItem como parametro
}

const inserirItem = (evento) => {   //RECEBE O EVENTO(tecla que foi digitada(keypress))
    const tecla = evento.key;       //(key)-->PROPRIEDADE QUE RESPONSAVEL PELA TECLA DIGITADA 
    const tarefa = evento.target.value;  // NOME DIGITADO NO CAMPO INPUT NOVA TARAFA
    if (tarefa === '') {   // PARA A EXECUÇÃO DA FUNÇÃO
        return
    }
    if (tecla === 'Enter') {
        const banco = getBanco();   // LER BANCO
        banco.push({ 'tarefa': tarefa, 'status': '' }) // ADICIONAR NO FINAL DO BANCO
        setBanco(banco);  // ADICIONA NO localStorage 
        atualizarTela()
        evento.target.value = ''   // LIMPA O CAMPO(input)DA TAREFA DIGITADA
    }
}

const removerItem = (indice) => {
    const banco = getBanco();  // LER BANCO localStorage
    banco.splice(indice, 1);   //(splice)--> remove item do banco apartir do (indice) informado   //(indice, 1) indice->que foi recebido  / 1-->quantos itens apartir do item que foi recebido
    setBanco(banco); //ATUALIZA BANCO NOVAMENTE localStorege
    atualizarTela()

}

const atualizarItem = (indice) => {
    const banco = getBanco();  // LER BANCO localStorege

    const status = banco[indice].status  // VERIFICA STATUS

    //banco[indice].status = banco[indice].status === '' ? 'checked' : ''  // USANDO O TERNÁRIO
    //setBanco(banco)

    if (status === '') {     //SE ESTATUS ESTIVAR SEM CHECKED, MUDA PRA CHECKED
        banco[indice].status = 'checked'
        setBanco(banco)  // ATUALIZA BANCO localStorage
        atualizarTela()
    } else {
        banco[indice].status = '';  //SE ESTATUS ESTIVAR COM CHECKED, MUDA PRA ''
        setBanco(banco) // ATUALIZA BANCO localStorage
        atualizarTela()
    }
}

const clickItem = (evento) => {      //RECEBE O EVENTO(CLIK)
    const elemento = evento.target   //IDENTIFICA QUAL É O ELEMENTO
    if (elemento.type === 'button') {  // SE FOR NO BOTTÃO FECHAR
        const indice = elemento.dataset.indice  // PEGA O INDECE DO ELEMENTO USANDO O COMANDO (dataset)
        removerItem(indice)
    } else if (elemento.type === 'checkbox') {

        const indice = elemento.dataset.indice  // PEGA O INDECE DO ELEMENTO USANDO O COMANDO (dataset)
        atualizarItem(indice)
    }

}

document.querySelector("#novoItem").addEventListener('keypress', inserirItem);
document.querySelector("#lista").addEventListener('click', clickItem);


atualizarTela()
