import incomeCategories from "./incomeCategories.js";
new incomeCategories("#incomeCategoriesForm");

import budgetCategories from "./budgetCategories.js";
new budgetCategories("#budgetCategoriesForm");

import expense from "./expense.js";
new expense("#transactions")


const budgetExpenseChart = (totalExpense) => {

    const budgetArray = JSON.parse(localStorage.getItem('budgetCategories')) || [];
    const valuesBudget = budgetArray.map(value => value.amount);
    const totalBudget = valuesBudget.reduce((acc, curr) => acc + parseFloat(curr), 0);
    const formattedTotalBudget = `₹ ${totalBudget.toFixed(2).replace(/\B(?=(\d{2})+(?!\d))/g, ",")}`;

    const data = {
        labels: ["Budget", "Expense"],
        datasets: [{
            label: '',
            data: [totalBudget, totalExpense],
            backgroundColor: [
                'rgba(255,99,132,255)',
                'rgba(153,102,255,255)'
            ],
            hoverOffset: 4
        }]
    };

    // config 
    const config = {
        type: 'doughnut',
        data: data,
    };

    // render init block
    const myChart = new Chart(
        document.getElementById('myBudgetExpenseChart'),
        config
    );


}

const savingsChart = (totalIncome, totalExpense) => {

    const savings = totalIncome - totalExpense;

    const data = {
        labels: ["Income", "Expense", "Savings"],
        datasets: [{
            label: '',
            data: [totalIncome, totalExpense, savings],
            backgroundColor: [
                'rgba(255,99,132,255)',
                'rgba(75,192,192,255)',
                'rgba(153,102,255,255)'
            ],
            hoverOffset: 4
        }]
    };

    // config 
    const config = {
        type: 'doughnut',
        data: data,
    };

    // render init block
    const myChart = new Chart(
        document.getElementById('mySavingsSummaryChart'),
        config
    );
    document.getElementById("SavingsSummary").innerHTML = `Your Estimated Savings: ₹ ${savings.toFixed(2).replace(/\B(?=(\d{2})+(?!\d))/g, ",")}`;

}


const incomeExpenseChart = (totalIncome, totalExpense) => {

    // setup 

    const data = {
        labels: ["Income", "Expense"],
        datasets: [{
            label: '',
            data: [totalIncome, totalExpense],
            backgroundColor: [
                'rgba(255,99,132,255)',
                'rgba(75,192,192,255)'
            ],
            hoverOffset: 4
        }]
    };

    // config 
    const config = {
        type: 'doughnut',
        data: data,
    };

    // render init block
    const myChart = new Chart(
        document.getElementById('myIncomeExpenseChart'),
        config
    );


    const netIncome = totalIncome - totalExpense;
    document.getElementById("netIncome").innerHTML = `Net Income: ₹ ${netIncome.toFixed(2).replace(/\B(?=(\d{2})+(?!\d))/g, ",")}`;

}

function netIncome() {
    const income = JSON.parse(localStorage.getItem('myIncome')) || [];
    const values = Object.values(income);
    let totalIncome = 0;
    for (let i = 0; i < values.length; i++) {
        totalIncome += parseFloat(values[i]);
    }

    const expenseArray = JSON.parse(localStorage.getItem('myExpense')) || [];
    const valuesExp = expenseArray.map(expense => expense.amount);
    let totalExpense = 0;
    for (let i = 0; i < valuesExp.length; i++) {
        totalExpense += parseFloat(valuesExp[i]);
    }

    incomeExpenseChart(totalIncome, totalExpense);
    savingsChart(totalIncome, totalExpense);
    budgetExpenseChart(totalExpense);
}
netIncome();


