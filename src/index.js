let addToy = false;
let toyCollection; // Define toyCollection outside DOMContentLoaded event listener

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  toyCollection = document.getElementById('toy-collection'); // Assign value to toyCollection

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Step 1: Fetch Andy's Toys
  fetchToys();

  // Step 2: Add Toy Info to the Card
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(toyForm);
    const toyData = {
      name: formData.get('name'),
      image: formData.get('image'),
      likes: 0
    };
    createToy(toyData);
  });

  // Step 4: Increase a Toy's Likes
  toyCollection.addEventListener('click', (event) => {
    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.dataset.toyId;
      const toyCard = event.target.closest('.card');
      increaseLikes(toyId, toyCard);
    }
  });
});

// Function to fetch Andy's Toys
function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));
}

// Function to create a new toy
function createToy(toyData) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(newToy => {
    const toyCard = createToyCard(newToy);
    toyCollection.appendChild(toyCard);
  })
  .catch(error => console.error('Error creating toy:', error));
}

// Function to increase a toy's likes
function increaseLikes(toyId, toyCard) {
  const likeCount = toyCard.querySelector('p');
  const currentLikes = parseInt(likeCount.textContent);
  const newLikes = currentLikes + 1;
  
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(() => {
    likeCount.textContent = `${newLikes} Likes`;
  })
  .catch(error => console.error('Error increasing likes:', error));
}

// Function to create a toy card
function createToyCard(toy) {
  const toyCard = document.createElement('div');
  toyCard.classList.add('card');

  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;

  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.classList.add('toy-avatar');

  const likeCount = document.createElement('p');
  likeCount.textContent = `${toy.likes} Likes`;

  const likeButton = document.createElement('button');
  likeButton.textContent = 'Like ❤️';
  likeButton.classList.add('like-btn');
  likeButton.dataset.toyId = toy.id;

  toyCard.appendChild(toyName);
  toyCard.appendChild(toyImage);
  toyCard.appendChild(likeCount);
  toyCard.appendChild(likeButton);

  return toyCard;
}
  
  
/*
function fetchAndyToys() {
  fetch(baseUrl)
  .then(res=>res.json())
  .then(data=>{
    
    data.forEach(toy => {
      const toysContainer=document.querySelector('.container')
      const toyDiv = document.createElement('div');
      toyDiv.classList.add('card');

    
      const naming = document.createElement('h2')
      naming.textContent= toy.name
      toyDiv.appendChild(naming)
      
      const img = document.createElement('img') 
      img.src=toy.image
      img.classList.add('toy-avatar')
      toyDiv.appendChild(img)

      const noOfLikes= document.createElement('p')
      noOfLikes.textContent=toy.likes;
      toyDiv.appendChild(noOfLikes)

      const likeBtn= document.createElement('button')
      likeBtn.textContent='like'
      likeBtn.classList.add('toy_id')
      toyDiv.appendChild(likeBtn)

      toysContainer.appendChild(toyDiv);

    })
      
  })
  .catch(error=>{
    console.error('error fetching', error)
  })
}
*/
