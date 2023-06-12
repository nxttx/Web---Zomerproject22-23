// add event listener to login form
document.getElementById("login-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(!document.getElementById("loginEmail").disabled){
  

    // make fetch request to login
    try {
      // disable submit button
      document.getElementById("loginBtn").setAttribute("disabled", true);

      let request = await fetch("/api/auth/requestCode?email=" + document.getElementById("loginEmail").value);
      let response = await request.json();
      if(response.status == "success"){
        // make id="loginEmail" non changeable
        document.getElementById("loginEmail").setAttribute("disabled", true);
        // remove d-none" from id="code"
        document.getElementById("code").classList.remove("d-none");
        // add required attribute to id="code"
        document.getElementById("code").setAttribute("required", true);
      }else{
        // show error message
        document.getElementById("loginEmail").classList.add("is-invalid");
        document.getElementById("loginEmail").nextElementSibling.innerHTML = response.message;
      }
    } catch (error) {
      // show error message
      alert("Er is iets fout gegaan. Probeer het later opnieuw. Als het probleem zich blijft voordoen, neem dan contact met ons op.");
    }

    // enable submit button
    document.getElementById("loginBtn").removeAttribute("disabled");

  }else{
    // make fetch request to check code and get token
    try {
      let request = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: document.getElementById("loginEmail").value,
          code: document.getElementById("loginCode").value
        })
      });
      let response = await request.json();
      if(response.status == "success"){
        // set token in cookie with expiry date of 1 day
        document.cookie = response.token + "; expires=" + new Date(Date.now() + 86400000).toUTCString() + "; path=/";
        // redirect to home
        window.location.href = "/dashboard";
      }else{
        // show error message
        document.getElementById("code").classList.add("is-invalid");
        document.getElementById("code").nextElementSibling.innerHTML = response.message;
      }
    }catch (error) { 
      // show error message
      alert("Er is iets fout gegaan. Probeer het later opnieuw. Als het probleem zich blijft voordoen, neem dan contact met ons op.");
    }
  }

});

// add event listener to signup form
document.getElementById("signup-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  // make fetch request to signup
  try{
    let request = fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: document.getElementById("signupEmail").value,
        username: document.getElementById("signupUsername").value
      })
      });
    let response = await request;
    if(response.status == 201){
      alert("Welkom bij de club! We hebben je ingeschreven, je kan nu inloggen.");
      // reload page
      window.location.reload();
    }else{
      let responseJson = await response.json();
      if(responseJson.message == "Email already exists"){
        alert("Er bestaat al een account met dit emailadres. Probeer in te loggen of gebruik een ander emailadres.");
      }else if(responseJson.message == "Username already exists"){
        alert("Er bestaat al een account met deze gebruikersnaam. Probeer in te loggen of gebruik een andere gebruikersnaam.");
      }else{
        alert("Er is iets fout gegaan. Probeer het later opnieuw. Als het probleem zich blijft voordoen, neem dan contact met ons op.");
      }
    }
  }catch(error){
    alert("Er is iets fout gegaan. Probeer het later opnieuw. Als het probleem zich blijft voordoen, neem dan contact met ons op.");
  }
});
