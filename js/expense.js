export default class expense {

    constructor(querySelectorString) {

        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = expense.html();

        this.root.querySelector(".new-entry").addEventListener('click', () => {
            this.onNewEntryBtnClick();
        });

        //load initial data from local storage
        this.load();
    }

    static html() {
        return `
        <table class="budget-tracker expenseTable">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="entries"></tbody>
            <tbody>
                <tr>
                    <td colspan="5" class="controls">
                        <button type="button" class="new-entry btn btn-outline-primary" style="font-size:12px">New Entry</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="summary">
                        <strong>Total Transcation: <span class="total">0.0$</span></strong>
                    </td>
                </tr>
            </tfoot>
        </table>
        `;
    }

    static entryHtml() {
        return `<tr>
                    <td>
                        <input type="date" class="input input-date">
                    </td>
                    <td>
                        <input type="text" class="input input-description"
                            placeholder="description like (wages bills etc..)">
                    </td>
                    <td>
                        <select class="input input-type">
                        </select>
                    </td>
                    <td>
                        <input type="number" class="input input-amount">
                    </td>
                    <td>
                        <button type="button" class="delete-entry btn btn-outline-danger" style="font-size:12px">Delete</button>
                    </td>
                </tr>`;
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("myExpense") || "[]");

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
        const totalFormated = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(total);
        this.root.querySelector(".total").textContent = totalFormated;

    }

    save() {
        const data = this.getEntryRows().map(row => {
            return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
            };
        });
        localStorage.setItem("myExpense", JSON.stringify(data));


        this.updateSummary();
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", expense.entryHtml());

        const row = this.root.querySelector(".entries tr:last-of-type");
        row.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "");
        row.querySelector(".input-description").value = entry.description || "";
        const typeSelect = row.querySelector(".input-type");
        const budgetCategories = JSON.parse(localStorage.getItem("budgetCategories") || "[]");
        budgetCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.type;
            option.text = category.type;
            typeSelect.appendChild(option);
        });
        typeSelect.value = entry.type || "";
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



}