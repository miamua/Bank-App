const registerForm = document.querySelector("#register");
const registerUsername = document.querySelector("#registerUsername");
const registerPassword = document.querySelector("#registerPassword");
const registerMoney = document.querySelector("#registerMoney");

registerForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/register',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            username: registerUsername.value,
            password: registerPassword.value,
            money: registerMoney.value

        })
    });
    const data = await response.json();
    console.log('RegisterResult:', data);
    if(response.status === 200){
        alert("Registration successful, Please login");
        window.location.href = "/login";
      }
});