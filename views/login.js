const loginForm = document.querySelector("#login");
const loginUsername = document.querySelector("#loginUsername");
const loginPassword = document.querySelector("#loginPassword");
const loginBtn = document.querySelector("#loginBtn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: loginUsername.value,
      password: loginPassword.value,
    }),
  });
  console.log(response);
  const data = await response.json();
  console.log("LoginResult:", data.message);
  console.log(response.status);
  if(response.status === 200){
    window.location.href = "/secrets";
  }
  
});
