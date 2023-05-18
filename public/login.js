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

const currentHref = window.location.href.toLowerCase();
const endsWithLoginHTML = currentHref.endsWith("login.html");
  if (response.status === 200) {
    if(endsWithLoginHTML){
      window.location.href = "/secrets";
    }else{
      window.location.reload();
    }
    
  }
});





