export default class budgetCategories {

    constructor(querySelectorString) {

        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = budgetCategories.html();

        this.root.querySelector(".new-entry").addEventListener('click', () => {
            this.onNewEntryBtnClick();
        });

        //load initial data from local storage
        this.budgetCatgoriesChart();
        this.load();


    }

    static html() {
        return `
        <table class=" budget-tracker ">
            <thead>
                <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody class="entries"></tbody>
            <tbody>
                <tr>
                    <td colspan="3" class="controls">
                        <button type="button" class="new-entry btn btn-outline-primary" style="font-size:12px">New Entry</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="summary">
                        <strong>Total Budget: <span class="total">0.0$</span></strong>
                    </td>
                </tr>
            </tfoot>
        </table>
        `;
    }

    static entryHtml() {
        return `<tr>
                    <td>
                        <input type="text" class="input input-type"
                            placeholder="description like (wages bills etc..)">
                    </td>
                    <td>
                        <input type="number" class="input input-amount">
                    </td>
                    <td>
                        <button type="button" class="delete-entry btn btn-outline-danger" style="font-size:13px">Delete</button>
                    </td>
                </tr>`;
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("budgetCategories") || "[]");

        for (const entry of entries) {
            this.addEntry(entry);
        }
        this.updateSummary();

    }

    updateSummary() {
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = parseFloat(row.querySelector(".input-amount").value);
            return total + amount;
        }, 0);
        const totalFormated = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(total);
        this.root.querySelector(".total").textContent = totalFormated;
    }

    save() {
        const data = this.getEntryRows().map(row => {
            return {
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value)
            };
        });
        localStorage.setItem("budgetCategories", JSON.stringify(data));

        this.updateSummary();
        this.incomeExpenseChart();
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", budgetCategories.entryHtml());

        const row = this.root.querySelector(".entries tr:last-of-type");
        row.querySelector(".input-type").value = entry.type || "Food";
        row.querySelector(".input-amount").value = entry.amount || 0;
        row.querySelector(".delete-entry").addEventListener('click', e => {
            this.onDeleteEntryBtnClick(e);
        });

        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
        });


    }

    getEntryRows = () => {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }


    onNewEntryBtnClick() {
        this.addEntry();
    }

    onDeleteEntryBtnClick(e) {
        e.target.closest("tr").remove();
        this.save();
    }

    budgetCatgoriesChart() {
        // const datas = JSON.parse(localStorage.getItem("budgetCategories") || "{}");
        // const labels = Object.keys(datas);
        // const values = Object.values(datas);

        const budgetArray = JSON.parse(localStorage.getItem('budgetCategories')) || [];
        const valuesBudget = budgetArray.map(value => value.amount);
        const labelsBudget = budgetArray.map(label => label.type);


        // setup 

        const data = {
            labels: labelsBudget,
            datasets: [{
                label: '',
                data: valuesBudget,
                backgroundColor: [
                    'rgba(54,162,235,255)',
                    'rgba(201,203,207,255)',
                    'rgba(255,99,132,255)',
                    'rgba(75,192,192,255)',
                    'rgba(255,159,64,255)',
                    'rgba(153,102,255,255)',
                    'rgba(255,205,86,255)'
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
            document.getElementById('myChartBudgetCategories'),
            config
        );
        this.updateTotalBudget(valuesBudget);
    }
    updateTotalBudget(values) {
        const totalBudget = values.reduce((acc, curr) => acc + parseFloat(curr), 0);
        const formattedTotalBudget = `₹ ${totalBudget.toFixed(2).replace(/\B(?=(\d{2})+(?!\d))/g, ",")}`;
        document.getElementById('myTotalBudget').textContent = `Total Budget: ${formattedTotalBudget}`;
    }

}