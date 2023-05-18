let myAccount = document.querySelector("#myAccount");
const logoutBtn = document.querySelector("#logoutBtn");

const deleteAccount = async (e) => {
  const res = await fetch(`/account/${e.target.dataset.postid}/delete`, {
    method: "POST",
  });
  console.log(res);
  if (res.status === 204) {
    alert("Account have been removed");
    window.location.href = "/accounts";
  }
};

const addButtonListeners = () => {
  const deleteBtns = document.querySelectorAll('[data-function="delete"]');
  deleteBtns.forEach((btn) => btn.addEventListener("click", deleteAccount));

  const depositBtns = document.querySelectorAll('[data-function="deposit"]');
  depositBtns.forEach((btn) => btn.addEventListener("click", deposit));

  const withdrawBtns = document.querySelectorAll('[data-function="withdraw"]');
  withdrawBtns.forEach((btn) => btn.addEventListener("click", withdraw));
};

const renderAccount = async () => {
  const user = await fetch("/user");
  entry = await user.json();
  //console.log(entry);
  document.querySelector("#loggedinUsername").innerText = entry.username;
  myAccount.innerHTML = `
    <div>
    <h3><b>Account name:</b> ${entry.username}</h3>
    <p><b>Account number:</b> ${entry._id}</p>
    <p><b>Balance:</b> ${entry.money} SEK</p>
      <input type="number" name="amount" id="amount" step="100" min="0" required>
      <button data-function="deposit" data-postid="${entry._id}">Deposit</button>
      <button data-function="withdraw" data-postid="${entry._id}">Withdraw</button>
      <br><br>
      <button data-function="delete" data-postid="${entry._id}">Remove Account</button>
    </div>
  `;
  addButtonListeners();
};

const deposit = async (e) => {
  const res = await fetch("/user");
  entry = await res.json();
  const response = await fetch(
    `/accounts/${e.target.dataset.postid}/transaction`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        amount: document.querySelector("#amount").value,
        action: "deposit",
      }),
    }
  );
  console.log(response);
  renderAccount();
};

const withdraw = async (e) => {
  const res = await fetch("/user");
  entry = await res.json();
  const response = await fetch(
    `/accounts/${e.target.dataset.postid}/transaction`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        amount: document.querySelector(`#amount`).value,
        action: "withdraw",
      }),
    }
  );
  console.log(response);
  if (response.status === 400) {
    alert("Insufficient funds.");
  }
  renderAccount();
};

logoutBtn.addEventListener("click", async () => {
  const res = await fetch("/logout", { method: "POST" });
  alert("Good bye!");
  window.location.href = "/";
});

renderAccount();
