const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage ={
  get(){
    return JSON.parse(localStorage.getItem("transactions")) || []
  },

  set(transactions){
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }
}

// funções de entradas, saídas e total

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },

  //metodo para remover um valor  ************
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },

  incomes() {
    //função para somar as entradas
    let income = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },

  expenses() {
    //função para somar as saídas
    let expenses = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });
    return expenses;
  },

  total() {
    //função para somar as entradas
    return Transaction.incomes() + Transaction.expenses();
  },
};

// funcção para montar a mascara do html
const DOM = {
  transactionContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index
    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
              <td class="description">${transaction.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="date">${transaction.date}</td>
              <td>
                <img onClick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação" />
              </td>
    `;
    return html;
  },

  //retornando valores no documento html e formatando valores
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expensesDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionContainer.innerHTML = "";
  },
};

//conversor de casas decimais e moeda e datas
const Utils = {
  // formatando a data
  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatAmount(value) {
    value = value * 100;
    return Math.round(value)
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  // validando campos do form
  validateFilds() {
    //desestruturando o objeto que vem do formulario
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFilds();
      const transaction = Form.formatValues();

      Transaction.add(transaction);

      Form.clearFields();

      Modal.close();
      
    } catch (error) {
      alert(error.message);
    }
  },
};

//iniciando o app e add as transações em tela
const App = {
  init() {
    Transaction.all.forEach((transaction,index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();
    Storage.set(Transaction.all)
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
