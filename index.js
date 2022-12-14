"use strict";


/* 
ATENTIE:
Sunt 4 seturi de date cu care ne putem loga(Reprezinta proprietatile "username" si "pin" ale celor 4 conturi):
    username - js | pin - 1111
    username - jd | pin - 2222
    username - stw | pin - 3333
    username - ss | pin - 4444
*/


// Datele initiale.
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111
};
const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222
};
const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333
};
const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, -90],
    interestRate: 1,
    pin: 4444
};
const accounts = [account1, account2, account3, account4];
// Selectam elementele.
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const formLogin = document.querySelector("form.login");
const formTransfer = document.querySelector("form.form--transfer");
const formClose = document.querySelector("form.form--close");
const formLoan = document.querySelector("form.form--loan");
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



// Creeam proprietatea "username" pentru fiecare cont: account1, account2, account3 si account4.
const createUsernames = function() {
    accounts.forEach(function(elem) {
        elem.username = elem.owner.split(" ").map(elem => elem[0]).join("").toLowerCase();
    });
};
createUsernames();



// Afisam balanta contului logat.
const displayBalance = function(acc) {
    labelBalance.textContent = `${acc.movements.reduce((rez, elem) => rez + elem)}???`;
};
// Afisam tranzactiile contului logat.
const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = "";
    let movs = sort ? acc.movements.slice(0).sort((a, b) => a - b) : acc.movements.slice(0);
    movs.forEach(function(elem, index) {
        let html = `<div class="movements__row">
                        <div class="movements__type movements__type--${(elem > 0 ? "deposit" : "withdrawal")}">${(index + 1)} ${(elem > 0 ? "deposit" : "withdrawal")}</div>
                        <div class="movements__value">${elem}???</div>
                    </div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};
// Afisam suma totala depusa, suma totala scoasa si bonusul cumulat pentru contul logat.
const displaySummary = function(acc) {
    labelSumIn.textContent = `${(acc.movements.filter(elem => elem > 0).reduce((rez, elem) => rez + elem))}???`;
    labelSumOut.textContent = `${(Math.abs(acc.movements.filter(elem => elem < 0).reduce((rez, elem) => rez + elem)))}???`;
    labelSumInterest.textContent = `${(acc.movements.filter(elem => elem > 0).map(elem => elem * acc.interestRate * 0.01).filter(elem => elem >= 1).reduce((rez, elem) => rez + elem))}???`;
};
// Afisam toate detaliile despre contul logat.
const displayUI = function(acc) {
    displaySummary(acc);
    displayBalance(acc);
    displayMovements(acc);
};



/*
LOGIN: Pentru a te loga la un cont, trebuie sa folosesti "username"-ul si "pin"-ul contului respectiv, care sunt proprietati ale obiectului respectiv.
Sunt 4 seturi de date cu care ne putem loga(Reprezinta proprietatile "username" si "pin" ale celor 4 conturi):
   username - js | pin - 1111
   username - jd | pin - 2222
   username - stw | pin - 3333
   username - ss | pin - 4444
*/
let currentAccount;
let timer;
formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    if (inputLoginUsername.value === "" || inputLoginPin.value === "") {
        alert("Trebuie sa introduceti un username si un pin!");
        return;
    }
    currentAccount = accounts.find(elem => (elem.username === inputLoginUsername.value) && (elem.pin === Number(inputLoginPin.value)));
    if (currentAccount) {
        isSorted = false;
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginUsername.blur();
        inputLoginPin.blur();
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        displayUI(currentAccount);
        containerApp.style.opacity = "1";
        // Ne afiseaza data sub "Current balance":
        let actualDate = new Date();
        let date = String(actualDate.getDate()).padStart(2, 0);
        let month = String(actualDate.getMonth() + 1).padStart(2, 0);
        let year = actualDate.getFullYear();
        let hours = String(actualDate.getHours()).padStart(2, 0);
        let minutes = String(actualDate.getMinutes()).padStart(2, 0);
        labelDate.textContent = `${date}/${month}/${year}, ${hours}:${minutes}`;
        // Timer
        if (timer) clearInterval(timer);
        startLogOutTimer();
    } else {
        alert("Datele de logare sunt incorecte!");
        return;
    }
});



/* 
TRANSFER: Putem transfera o suma de bani altui cont.
Conditii:
   - Username-ul contului caruia vrem sa ii transferam bani sa fie corect.
   - Username-ul contului caruia vrem sa ii transferam bani sa fie diferit de cel in care suntem logati. (Nu iti poti transfera bani tie.)
   - Suma de transferat sa fie mai mare decat 0.
   - Suma de transferat sa fie mai mica sau egala decat balanta contului ce transfera bani.
*/
formTransfer.addEventListener("submit", function(e) {
    e.preventDefault();
    const receiverAcc = accounts.find(elem => elem.username === inputTransferTo.value);
    if (!receiverAcc) {
        alert("Nu exista un cont cu acest username!");
        return;
    }
    if (receiverAcc === currentAccount) {
        alert("Nu iti poti transfera bani tie!");
        return;
    }
    if ((Number(inputTransferAmount.value) > 0) && (Number(inputTransferAmount.value) <= Number.parseInt(labelBalance.textContent))) {
        receiverAcc.movements.push(Number(inputTransferAmount.value));
        currentAccount.movements.push(-Number(inputTransferAmount.value));
        displayUI(currentAccount);
        inputTransferTo.blur();
        inputTransferAmount.blur();
        inputTransferTo.value = inputTransferAmount.value = "";
    } else {
        alert("Transfer nereusit!");
        return;
    }
});



/*
CLOSE: Ca sa stergem un cont, trebuie sa fim logat in acesta si sa scriem username-ul si pin-ul asociate contului.
*/
formClose.addEventListener("submit", function(e) {
    e.preventDefault();
    if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
        let index = accounts.findIndex(elem => elem.username === currentAccount.username);
        accounts.splice(index, 1);
        containerApp.style.opacity = "0";
    } else {
        alert("Nu am putut sterge contul!");
        return;
    }
});



/*
LOAN:
    Putem face un imprumut cu 2 conditii:
        1. Suma pe care vrem sa o imprumutam sa fie > 0.
        2. Sa avem minim o depunere >= cu 10% din imprumutul pe care dorim sa-l facem. 
        (Exemplu: Daca vrem sa imprumutam 1000, trebuie sa avem o depunere(Sau mai multe, dar minim una) cu o valoare de minim 100.)
*/
formLoan.addEventListener("submit", function(e) {
    e.preventDefault();
    if (currentAccount.movements.some(elem => elem >= 0.1 * Number(inputLoanAmount.value)) && Number(inputLoanAmount.value) > 0) {
        currentAccount.movements.push(Number(inputLoanAmount.value));
        displayUI(currentAccount);
        inputLoanAmount.blur();
        inputLoanAmount.value = "";
    } else {
        alert("Nu am putut face acest imprumut!");
        return;
    }
});



/* 
SORT: Ne ordoneaza tranzactiile contului curent.
*/
let isSorted = false;
btnSort.addEventListener("click", function(e) {
    e.preventDefault();
    displayMovements(currentAccount, !isSorted);
    isSorted = isSorted ? false : true;
});



// Timer: De fiecare data cand ne logam, in partea de jos dreapta(Sub fereastra de "Close account") va porni un cronometru de la 5 minute. Daca trec cele 5 minute, automat vom primi logout.
const startLogOutTimer = function() {
    let time = 300;
    let tick = function() {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;
    };
    tick();
    timer = setInterval(function() {
        time--;
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = "Log in to get started";
            containerApp.style.opacity = "0";
        };
    }, 1000);
};



