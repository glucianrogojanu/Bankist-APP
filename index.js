"use strict";


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
    labelBalance.textContent = `${acc.movements.reduce((rez, elem) => rez + elem)}€`;
};
// Afisam tranzactiile contului logat.
const displayMovements = function(acc) {
    containerMovements.innerHTML = "";
    acc.movements.forEach(function(elem, index) {
        let html = `<div class="movements__row">
                        <div class="movements__type movements__type--${(elem > 0 ? "deposit" : "withdrawal")}">${(index + 1)} ${(elem > 0 ? "deposit" : "withdrawal")}</div>
                        <div class="movements__value">${elem}€</div>
                    </div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};
// Afisam suma totala depusa, suma totala scoasa si bonusul cumulat pentru contul logat.
const displaySummary = function(acc) {
    labelSumIn.textContent = `${(acc.movements.filter(elem => elem > 0).reduce((rez, elem) => rez + elem))}€`;
    labelSumOut.textContent = `${(Math.abs(acc.movements.filter(elem => elem < 0).reduce((rez, elem) => rez + elem)))}€`;
    labelSumInterest.textContent = `${(acc.movements.filter(elem => elem > 0).map(elem => elem * acc.interestRate * 0.01).filter(elem => elem >= 1).reduce((rez, elem) => rez + elem))}€`;
};
// Afisam toate detaliile despre contul logat.
const displayUI = function(acc) {
    displaySummary(acc);
    displayBalance(acc);
    displayMovements(acc);
};



/*
LOGIN: Pentru a te loga la un cont, trebuie sa folosesti "username"-ul si "pin"-ul contului respectiv, care sunt proprietati ale obiectului respectiv.
Sunt 4 seturi de date cu care ne putem loga:
   username - js | pin - 1111
   username - jd | pin - 2222
   username - stw | pin - 3333
   username - ss | pin - 4444
*/
let currentAccount;
formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    if (inputLoginUsername.value === "" || inputLoginPin.value === "") {
        alert("Trebuie sa introduceti un username si un pin!");
        return;
    }
    currentAccount = accounts.find(elem => (elem.username === inputLoginUsername.value) && (elem.pin === Number(inputLoginPin.value)));
    if (currentAccount) {
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginUsername.blur();
        inputLoginPin.blur();
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        displayUI(currentAccount);
        containerApp.style.opacity = "1";
    } else {
        alert("Datele de logare sunt incorecte!");
        return;
    }
});



/* 
TRANSFER: Putem transfera o suma de bani altui cont.
Conditii:
   - Username-ul contului caruia vrem sa ii transferam bani sa fie corect.
   - Username-ul contului caruia vrem sa ii transferam bani sa fie diferit de al tau. (Nu iti poti transfera bani tie.)
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
CLOSE: Ca sa stergem un cont, trebuie sa fim logat in acesta, si sa scriem username-ul si pin-ul asociate contului.
*/
formClose.addEventListener("submit", function(e) {
    e.preventDefault();
    if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
        let index = accounts.findIndex(elem => elem.username === currentAccount.username);
        accounts.splice(index, 1);
        containerApp.style.opacity = "0";
    }
});
