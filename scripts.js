const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

// array de objetos
const transactions = [
  {
    id: 1,
    descriition: "Luz",
    amount: -50000,
    date: "23/02/2021",
  },
  {
    id: 2,
    descriition: "Criação web site",
    amount: 500000,
    date: "23/02/2021",
  },
  {
    id: 3,
    descriition: "Internet",
    amount: -20000,
    date: "23/02/2021",
  },
  {
    id: 4,
    descriition: "Services",
    amount: 300000,
    date: "29/02/2021",
  },
];

// funções de entradas, saídas e total

const Transaction = {
  all: transactions,

  add(transaction){
    Transaction.all.push(transaction);
    console.log(Transaction.all)
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
              <td class="description">${transaction.descriition}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="date">${transaction.date}</td>
              <td>
                <img src="./assets/minus.svg" alt="remover transação" />
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
};

//conversor de casas decimais e moeda
const Utils = {
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




transactions.forEach(function (transaction) {
  DOM.addTransaction(transaction);
});

DOM.updateBalance();

