let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  init()
  getToys()
});

function init(){
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container"); 
  const toyCardContainer = document.querySelector("#toy-collection")
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  toyFormContainer.addEventListener("submit", createToy)
  toyCardContainer.addEventListener("click", likeToy)
}

function getToys(){
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(toys => writeToys(toys))
}

function writeToys(toys){
  let toyContainer = document.querySelector("#toy-collection")
  toys.forEach(toy => {
    let toyDiv = document.createElement('div')
    toyDiv.className = "card"
    buildCard(toyDiv, toy)
    toyContainer.appendChild(toyDiv)
  })
}

function buildCard(toyDiv, toy){
  let toyHeader = document.createElement('h2')
  toyHeader.innerText = toy.name
  let toyImg = document.createElement('img')
  toyImg.src = toy.image
  toyImg.className = "toy-avatar"
  let toyLikes = document.createElement('p')
  toyLikes.innerText = `${toy.likes} likes`
  let toyButton = document.createElement("button")
  toyButton.innerText = "Like"
  toyButton.className = "like-btn"
  let toyId = document.createElement('input')
  toyId.setAttribute("type", "hidden")
  toyId.value = toy.id

  
  toyDiv.append(toyHeader, toyImg, toyLikes, toyButton, toyId)
}


function createToy(e){
  e.preventDefault()
  let newToy = {
    "name": e.target.name.value,
    "image": e.target.image.value,
    "likes": 0
  }

  fetch("http://localhost:3000/toys", 
  {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    "body": JSON.stringify(newToy)
  })
  .then(res => res.json())
  .then(toy => toyToArray(toy))
  .then(toyArr => writeToys(toyArr))

  e.target.reset()
}

function toyToArray(toy){
  let arr = [toy]
  return arr
}
function likeToy(e){
  let currentLikes = parseInt(e.target.parentElement.querySelector("p").innerText.split(" ")[0])
  let id = e.target.parentElement.querySelector("input").value

  let newLikes = ++currentLikes

  fetch(`http://localhost:3000/toys/${id}`, 
  {
    "method": "PATCH",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    "body": JSON.stringify({
      "likes": newLikes
    })
  })
  .then(res => res.json())
  .then(toy => {
    e.target.parentElement.querySelector("p").innerText = `${toy.likes} Likes`
  })
}


/* <div class="card">
    <h2>Woody</h2>
    <img src=toy_image_url class="toy-avatar" />
    <p>4 Likes </p>
    <button class="like-btn">Like <3</button>
  </div> */
