export default class incomeCategories {

    constructor() {
        this.storedIncomeCategories = JSON.parse(localStorage.getItem('IncomeCategories')) || [];
        this.myIncome = JSON.parse(localStorage.getItem('myIncome')) || {};
        this.selectElement = document.getElementById('incomeSrcSelect');
        this.updateSelectOptions();
        this.button = document.getElementById('storeIncomeButton');
        this.button.addEventListener('click', this.storeIncome.bind(this));
        this.incomeCatgoriesChart();

    }

    storeIncome(e) {
        e.preventDefault();
        const newIncomeSrc = document.getElementById('newIncomeSrc').value;
        const selectedValue = document.getElementById('incomeSrcSelect').value;
        const incomeAmt = document.getElementById('incomeAmt').value;
        if (newIncomeSrc) {
            this.storedIncomeCategories.push(newIncomeSrc);
            localStorage.setItem('IncomeCategories', JSON.stringify(this.storedIncomeCategories));
            this.updateSelectOptions();
        }
        if (selectedValue && incomeAmt) {
            this.myIncome[selectedValue] = incomeAmt;
            localStorage.setItem('myIncome', JSON.stringify(this.myIncome));
        }
        else {//both selectedValue && incomeAmt are empty
            if (!newIncomeSrc) {
                alert("please fill the (source and amount) or new source fields")
            }

        }
        location.reload();
    }

    updateSelectOptions() {
        this.selectElement.innerHTML = ''; // Clear existing options
        this.storedIncomeCategories.forEach((value) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            this.selectElement.appendChild(option);
        });
    }

    incomeCatgoriesChart() {
        const datas = JSON.parse(localStorage.getItem("myIncome") || "{}");
        const labels = Object.keys(datas);
        const values = Object.values(datas);

        // setup 

        const data = {
            labels: labels,
            datasets: [{
                label: '',
                data: values,
                backgroundColor: [
                    'rgba(255,159,64,255)',
                    'rgba(153,102,255,255)',
                    'rgba(255,205,86,255)',
                    'rgba(54,162,235,255)',
                    'rgba(201,203,207,255)',
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
            document.getElementById('myChartIncomeCategories'),
            config
        );

    }

}
