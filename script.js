function copyWallet(id) {
    const walletText = document.getElementById(id).textContent.trim();
    navigator.clipboard.writeText(walletText).then(() => {
        const thank = document.getElementById('thank');
        thank.style.display = 'block';
        setTimeout(() => { thank.style.display = 'none'; }, 3000);
    });
}

// Conversion rates (1 PHP -> other currencies)
const rates = {
    USD: 0.01735,
    EUR: 0.015,
    JPY: 2.70,
    GBP: 0.013,
    AUD: 0.024,
    SGD: 0.022
};

const currencySelect = document.getElementById('currency');
const feeCells = document.querySelectorAll('#feesTable td[data-php]');
const totalCell = document.getElementById('totalFee');

function updateFees() {
    const targetCurrency = currencySelect.value;
    let totalCollected = 0;

    feeCells.forEach(cell => {
        const totalPHP = Number(cell.getAttribute('data-php'));
        const paidPHP = Number(cell.getAttribute('data-paid')) || 0;
        totalCollected += paidPHP;

        let displayAmount = '';

        
        let totalConverted = totalPHP;
        let paidConverted = paidPHP;
        let symbol = '₱';

        if (targetCurrency !== 'PHP') {
            const rate = rates[targetCurrency] || 1;
            totalConverted = totalPHP * rate;
            paidConverted = paidPHP * rate;

            switch (targetCurrency) {
                case 'USD': symbol = '$'; break;
                case 'EUR': symbol = '€'; break;
                case 'JPY': symbol = '¥'; break;
                default: symbol = targetCurrency + ' ';
            }
        }

        
        if (paidPHP >= totalPHP) {
            displayAmount = `${symbol}${totalConverted.toFixed(2)} ✅ Done`;
        } else if (paidPHP > 0) {
            displayAmount = `${symbol}${paidConverted.toFixed(2)} / ${symbol}${totalConverted.toFixed(2)}`;
        } else {
            displayAmount = `${symbol}${totalConverted.toFixed(2)}`;
        }

        cell.textContent = displayAmount;
    });

    // Update total collected
    let totalConverted = totalCollected;
    let totalPHP = Number(totalCell.getAttribute('data-php'));
    let symbol = '₱';
    if (currencySelect.value !== 'PHP') {
        const rate = rates[currencySelect.value] || 1;
        totalConverted = totalCollected * rate;
        totalPHP = totalPHP * rate;
        switch (currencySelect.value) {
            case 'USD': symbol = '$'; break;
            case 'EUR': symbol = '€'; break;
            case 'JPY': symbol = '¥'; break;
            default: symbol = currencySelect.value + ' ';
        }
    }
    totalCell.textContent = `${symbol}${totalConverted.toFixed(2)} / ${symbol}${totalPHP.toFixed(2)}`;
}

// Initial update
updateFees();

// Update on currency change
currencySelect.addEventListener('change', updateFees);

function showUSDT() {
    const network = document.getElementById("usdtNetwork").value;
    const display = document.getElementById("usdtDisplay");

    const wallets = {
        bep20: "0x26766Fe0d0049035e9ade42a3d1EEa457ED5f8fD",
        trc20: "TYjdB1GMiAhUTQjWzMCYLa7vYkXq2yPu5v",
        solana: "3UsWAcWyy97XTJNyzFTUMUHZMrxJTXzFV67utymaM59d",
        matic: "0x640fe8b9f4531731908f5547d294bba3ac0dccd2",
        avax: "0x640fe8b9f4531731908f5547d294bba3ac0dccd2",

    };

    if (wallets[network]) {
        display.innerHTML = `
            <div class="wallet-info">
                <div class="wallet">${wallets[network]}</div>
                <button onclick="navigator.clipboard.writeText('${wallets[network]}')">Copy</button>
            </div>
            <p class="warning">⚠️ Please make sure to use the selected network only.</p>
        `;
    } else {
        display.innerHTML = "";
    }
}