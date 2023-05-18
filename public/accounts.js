let accounts = document.querySelector("#allaccounts");
const logoutBtn = document.querySelector("#logoutBtn");

const listTemplate = (entry) => `
  <li>
    <h3>${entry.username}</h3>
    <p><b>Account Number:</b> ${entry._id}</p>
    <p><b>Balance:</b> ${entry.money} SEK</p>
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

const listAccounts = async () => {
  const res = await fetch("/accounts/all");
  entries = await res.json();
  accounts.innerHTML = entries.map(listTemplate).join("");
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
  listAccounts();
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
        amount: document.querySelector(`#${entry._id}`).value,
        action: "withdraw",
      }),
    }
  );
  console.log(response);
  if (response.status === 400) {
    alert("Insufficient funds.");
  }
  listAccounts();
};

logoutBtn.addEventListener("click", async () => {
  const res = await fetch("/logout", { method: "POST" });
  alert("Good bye!");
  window.location.href = "/";
});

listAccounts();
