// #tweet-form
document.getElementById("tweat-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  let content = document.getElementById("tweatContent").value;
  document.getElementById("tweatContent").value = "";
  // make fetch request to create tweet
  let request = fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
        // add token // document.cookie = "token=" + response.token + "; expires=" + new Date(Date.now() + 86400000).toUTCString() + "; path=/";
        
      "authorization": document.cookie
    },
    body: JSON.stringify({
      content: content
    })
  });
  // get response
  let response = await (await request).json();
  // check response
  if(request.status == 201 && response.status == "success"){
    alert("Tweat is geplaatst!");
    // reload page
    window.location.reload();
  }else{
    // show error message
    alert(response.message);
  }
});

// document on load
document.addEventListener("DOMContentLoaded", async ()=>{
  // load tweets
  await loadTweets();
  // add event listener to like tweet button
  document.querySelectorAll("#likeTweat").forEach(btn => {
    btn.addEventListener("click", likeTweat);
  });

});

// load tweets
async function loadTweets(){
  let request = await fetch("/api/posts?limit=30");
  let response = await request.json();
  // check response
  if(request.status == 200){
    // loop through tweets
    response.forEach(tweat => {

      document.getElementById("recentTweats").innerHTML += `
      <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-2 d-flex justify-content-center align-items-center">
              <img src="/images/profilepicture.jpg" alt="Tweat Author 5" class="img-fluid rounded-circle "
                style="width: 100px; height: 100px;">
            </div>
            <div class="col-md-10">
              <div class="card-body">
                <h5 class="card-title">${tweat.username} - ${tweat.created_at_amsterdam}</h5>
                <p class="card-text">${tweat.content}</p>
                <button class="btn btn-primary" id="likeTweat" data-id="${tweat.id}"><i class="bi bi-arrow-up-circle"></i></button>
                <button class="btn btn-primary"><i class="bi bi-chat-left-text"></i></button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }else{
    // show error message
    alert(response.message);
  }
}

async function likeTweat(e){
  // if e.target is not button, get parent
  element = e.target;
  if(e.target.tagName === "I"){
    element = e.target.parentElement;
  }

  // get id from button
  let id = element.getAttribute("data-id");
  // make fetch request to like tweet
  let request = await fetch("/api/posts/" + id + "/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": document.cookie
    }
  });
  // get response
  let response = await (await request).json();
  // check response
  if(request.status == 201 && response.status == "success" && response.message == "Post liked"){
    alert("Tweat is geliked!");
  }else if(request.status == 201 && response.status == "success" && response.message == "Post unliked"){
    alert("Tweat is unliked!");
  }else{
    // show error message
    alert(response.message);
  } 
}
