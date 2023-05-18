let accounts = document.querySelector("#allaccounts");

const listTemplate = (entry) => `
  <li>
    <h3>${entry.username}</h3>
    <p>${entry._id}</p>
    <p>${entry.money}</p>
    <input type="number" name="amount" id="${entry._id}" step="100" min="0" required>
    <button data-function="deposit" data-postid="${entry._id}">Deposit</button>
    <button data-function="withdraw" data-postid="${entry._id}">Withdraw</button>
    <button data-function="delete" data-postid="${entry._id}">Remove Account</button>
  </li>
`;


const deleteAccount = async (e) => {
 const res = await fetch(`/account/${e.target.dataset.postid}/delete`, {
    method: "POST",
  });

  listAccounts();
};


const addButtonListeners = () => {
  const deleteBtns = document.querySelectorAll('[data-function="delete"]');
  deleteBtns.forEach((btn) => btn.addEventListener("click", deleteAccount));

  const depositBtns = document.querySelectorAll('[data-function="deposit"]');
  depositBtns.forEach((btn) => btn.addEventListener("click", deposit));

  const withdrawBtns = document.querySelectorAll('[data-function="withdraw"]');
  withdrawBtns.forEach((btn) => btn.addEventListener("click", withdraw));
};

/*
const listAccounts = async () => {
  const res = await fetch("/accounts");
  entries = await res.json();
  accounts.innerHTML = entries.map(listTemplate).join("");
  addButtonListeners();
};
*/
const listAccounts = async () => {
    const user = await fetch("/user");
    entry = await user.json();
    console.log(entry);
    //accounts.innerHTML = entries.map(listTemplate).join("");
    accounts.innerHTML = `
    <li>
      <h3>${entry.username}</h3>
      <p>${entry._id}</p>
      <p>${entry.money}</p>
      <input type="number" name="amount" id="amount" step="100" min="0" required>
      <button data-function="deposit" data-postid="${entry._id}">Deposit</button>
      <button data-function="withdraw" data-postid="${entry._id}">Withdraw</button>
      <button data-function="delete" data-postid="${entry._id}">Remove Account</button>
    </li>
  `;
    addButtonListeners();
  };



const deposit = async (e) =>{
const res = await fetch("/user");
entry = await res.json();
const response = await fetch(`/accounts/${e.target.dataset.postid}/transaction`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      amount: document.querySelector("#amount").value,
      action: "deposit",
    })
  });
  console.log(response);
  listAccounts();

}

const withdraw = async (e) =>{
    const res = await fetch("/user");
    entry = await res.json();
    const response = await fetch(`/accounts/${e.target.dataset.postid}/transaction`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          amount: document.querySelector(`#amount`).value,
          action: "withdraw",
        })
      });
      console.log(response);
      if(response.status === 400){
        alert("Insufficient funds.")

      }
      listAccounts();
    }

listAccounts();
