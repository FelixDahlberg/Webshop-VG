/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


document.addEventListener('DOMContentLoaded', function () {
  // Select the cart button
  const cartBtn = document.getElementById('cartBtn');

  // Add click event listener to the cart button
  cartBtn.addEventListener('click', function () {
    console.log("click")
    window.location.href = 'order-form.html';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Select the clear cart button
  const clearCartBtn = document.getElementById('clearCartBtn');

  // Add click event listener to the clear cart button
  clearCartBtn.addEventListener('click', function () {
    // Clear the productList in localStorage
    localStorage.removeItem('productList');
    updateCartTotalItem()
    updateCartTotalPrice()
    const container = document.getElementById('cartProductItemContainer');
    container.innerHTML = '<div class="text-center">Cart is empty</div>';

  });
});

document.addEventListener('DOMContentLoaded', function () {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn?.addEventListener('click', function (event) {
    event.preventDefault();

    const inputName = document.getElementById('inputName').value.trim();
    const inputEmail = document.getElementById('inputEmail').value.trim();
    const inputPhone = document.getElementById('inputPhone').value.trim();
    const inputAddress = document.getElementById('inputAddress').value.trim();
    const inputCity = document.getElementById('inputCity').value.trim();
    const inputZip = document.getElementById('inputZip').value.trim();

    let isValid = true;

    // Regular expression to match only letters
    const onlyLettersRegex = /^[A-Za-z\s]{2,50}$/;
    const containsAtRegex = /@/;
    const phoneRegex = /^[\d\s()-]{0,50}$/;
    const onlyNumbersRegex = /[0-9]/;


    // Check if the name field is between 2 and 50 characters and contains only letters
    if (!onlyLettersRegex.test(inputName)) {
      alert('Name must be between 2 and 50 characters long and contain only letters.');
      isValid = false;
    }

    if (inputEmail.length > 50 || !containsAtRegex.test(inputEmail)) {
      alert('E-postadressen får inte vara längre än 50 tecken och måste innehålla @.');
      isValid = false;
    }

    if (!phoneRegex.test(inputPhone)) {
      alert('Numret får endaste innehålla siffror, paranteser, bindestreck och max 50 tecken långt.');
      isValid = false;
    }

    if (inputAddress.length < 2 || inputAddress.length > 50) {
      alert('Addressen får endast vara minst 2 tecken och max 50 tecken.');
      isValid = false;
    }

    if (!onlyLettersRegex.test(inputCity)) {
      alert('Staden får endaste innehålla 2-50 tecken.')
      isValid = false;
    }

    if (!inputZip.length === 5 || !onlyNumbersRegex.test(inputZip)) {
      alert('Postkoden får endast vara 5 siffror');
      isValid = false;
    }

    if (isValid) {
      window.location.href = 'purchaseConfirmationPage.html'; // Redirect the user
    }

    // You can add additional custom validation logic here as needed
  });
});

fetch("https://fakestoreapi.com/products/category/electronics")
  .then((res) => res.json())
  .then((json) => {
    json.forEach((item) => {
      try {
        createCard(item);
      } catch (error) {

      }
    });
  });

function updateCartTotalItem() {
  const productList = JSON.parse(localStorage.getItem('productList')) || [];
  const navigationCartButtonItemNumber = document.getElementById('navigationCartButtonItemNumber');
  navigationCartButtonItemNumber.textContent = productList.length;
}

function updateCartTotalPrice() {
  const productList = JSON.parse(localStorage.getItem('productList')) || [];

  // Use reduce to sum up the prices of all products
  const totalPrice = productList.reduce((total, product) => total + product.price, 0);

  // Select the element where the total price will be displayed
  const cartTotalPrice = document.getElementById('cartTotalPrice');

  // Update the content of the cartTotalPrice element
  cartTotalPrice.textContent = "Total: $" + totalPrice; // Assuming prices are in decimals
}

function createCard(product) {
  updateCartTotalItem();
  let numberOf = 1;
  const id = product.id;
  const title = product.title;
  const price = product.price;
  //const category = product.category
  const description = product.description;
  const image = product.image;

  const cardIndex = document.querySelectorAll('.card').length;
  if (cardIndex % 3 === 0) {
    const newRow = document.createElement("div");
    newRow.classList.add("row", "d-flex", "justify-content-around");
    document.querySelector('#products').appendChild(newRow);
  }

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.classList.add("my-2");
  cardDiv.classList.add("py-5")
  cardDiv.style.width = "18rem";

  const img = document.createElement("img");
  img.classList.add("card-img-top");
  img.src = image;
  img.alt = `image describing ${title}`;
  img.style.height = "200px";

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");
  cardBodyDiv.classList.add("d-flex");
  cardBodyDiv.classList.add("flex-column");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = title.slice(0, 50);

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = description.slice(0, 100) + "...";

  const cardPrice = document.createElement("p");
  cardPrice.classList.add("card-text");
  cardPrice.classList.add("text-danger");
  cardPrice.textContent = "Price: " + price + "$";

  const btn = document.createElement("a");
  btn.classList.add("btn", "btn-dark", "mt-auto");
  btn.id = "addToCartId" + id;
  btn.type = "button";
  btn.textContent = "Add to cart";
  btn.onclick = function () {
    const product = { id, title, price, description, image };
    const productList = JSON.parse(localStorage.getItem('productList')) || [];
    productList.push(product);
    localStorage.setItem('productList', JSON.stringify(productList));
    updateCartTotalItem();
  };

  cardBodyDiv.appendChild(cardTitle);
  cardBodyDiv.appendChild(cardText);
  cardBodyDiv.appendChild(cardPrice);
  cardBodyDiv.appendChild(btn);

  cardDiv.appendChild(img);
  cardDiv.appendChild(cardBodyDiv);


  const card = document.querySelector('#products');
  card.appendChild(cardDiv);
};
/*
document.addEventListener('DOMContentLoaded', function () {
  updateCartTotalPrice();
  updateCartTotalItem()
  // Retrieve productList from localStorage
  const productList = JSON.parse(localStorage.getItem('productList')) || [];

  // Create a map to track the quantity of each product
  const productQuantityMap = new Map();

  // Update the quantity map based on the productList
  productList.forEach(product => {
    const productId = product.id;
    productQuantityMap.set(productId, (productQuantityMap.get(productId) || 0) + 1);
  });

  // Select the container where the cards will be appended
  const container = document.getElementById('cartProductItemContainer');

  // Iterate over each product in the quantity map
  productQuantityMap.forEach((quantity, productId) => {
    // Find the product details corresponding to the productId
    const productDetails = productList.find(product => product.id === productId);

    // Create elements for the card
    const colDiv = document.createElement('div');
    colDiv.classList.add('row');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('list-group-item', 'mb-4', 'shadow-sm', 'd-flex');

    const img = document.createElement('img');
    img.classList.add('card-img');
    img.src = productDetails.image;
    img.alt = 'Image not found';
    img.style.width = "auto";
    img.style.height = "30px";

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-column');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = productDetails.title;

    const price = document.createElement('p');
    price.classList.add('card-text');
    price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId))}`;

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('card-text');

    // Update the decrease button event listener
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-';
    decreaseBtn.classList.add('btn', 'btn-sm', 'btn-primary');
    decreaseBtn.addEventListener('click', () => {
      if (productQuantityMap.get(productId) > 1) {
        // Update productQuantityMap
        productQuantityMap.set(productId, productQuantityMap.get(productId) - 1);
        // Update the quantity text
        quantityText.textContent = productQuantityMap.get(productId);
        // Update productList and localStorage
        updateLocalStorage(productList, productId);
        // Update cart total price and total item
        price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId))}`;
        updateCartTotalPrice();
        updateCartTotalItem();
      } else {
        // Remove the product card entirely
        colDiv.remove();
        // Remove the product from the productList and localStorage
        const index = productList.findIndex(product => product.id === productId);
        if (index !== -1) {
          productList.splice(index, 1);
          localStorage.setItem('productList', JSON.stringify(productList));
          // Update cart total price and total item
          updateCartTotalPrice();
          updateCartTotalItem();
        }
      }
    });

    // Update the increase button event listener
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.classList.add('btn', 'btn-sm', 'btn-primary');
    increaseBtn.addEventListener('click', () => {
      productList.push(productDetails);
      // Update localStorage
      localStorage.setItem('productList', JSON.stringify(productList));
      // Update productQuantityMap
      productQuantityMap.set(productId, productQuantityMap.get(productId) + 1);
      // Update the quantity text
      quantityText.textContent = productQuantityMap.get(productId);
      // Update cart total price and total item
      price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId))}`;
      updateCartTotalPrice();
      updateCartTotalItem();
    });

    // Create the quantity text element
    const quantityText = document.createElement('span');
    quantityText.textContent = quantity;

    quantityContainer.appendChild(decreaseBtn);
    quantityContainer.appendChild(quantityText);
    quantityContainer.appendChild(increaseBtn);

    // Append elements to the cardDiv
    cardDiv.appendChild(img);
    cardDiv.appendChild(title);
    cardDiv.appendChild(price);
    cardDiv.appendChild(quantityContainer);

    // Append cardDiv to the colDiv
    colDiv.appendChild(cardDiv);

    // Append colDiv to the container
    container.appendChild(colDiv);
  });
});*/

document.addEventListener('DOMContentLoaded', function () {
  updateCartTotalPrice();
  updateCartTotalItem();
  
  // Retrieve productList from localStorage
  const productList = JSON.parse(localStorage.getItem('productList')) || [];

  // Create a map to track the quantity of each product
  const productQuantityMap = new Map();

  // Update the quantity map based on the productList
  productList.forEach(product => {
    const productId = product.id;
    productQuantityMap.set(productId, (productQuantityMap.get(productId) || 0) + 1);
  });

  // Select the container where the cards will be appended
  const container = document.getElementById('cartProductItemContainer');

  // Iterate over each product in the quantity map
  productQuantityMap.forEach((quantity, productId) => {
    // Find the product details corresponding to the productId
    const productDetails = productList.find(product => product.id === productId);

    // Create elements for the card
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'border-0', 'shadow', 'mb-4');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'd-flex', 'align-items-center');

    const img = document.createElement('img');
    img.classList.add('card-img-top', 'me-3');
    img.src = productDetails.image;
    img.alt = 'Product Image';
    img.style.width = "100px"; // Adjust image width as needed

    const title = document.createElement('h5');
    title.classList.add('card-title', 'flex-grow-1', 'mb-0');
    title.textContent = productDetails.title;

    const price = document.createElement('p');
    price.classList.add('card-text', 'fw-bold', 'mb-0', 'ms-auto');
    price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('text-center', 'ms-auto');

    // Update the decrease button event listener
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-';
    decreaseBtn.classList.add('btn', 'btn-primary', 'me-2');
    decreaseBtn.addEventListener('click', () => {
      if (productQuantityMap.get(productId) > 1) {
        // Update productQuantityMap
        productQuantityMap.set(productId, productQuantityMap.get(productId) - 1);
        // Update the quantity text
        quantityText.textContent = productQuantityMap.get(productId);
        // Update productList and localStorage
        updateLocalStorage(productList, productId);
        // Update cart total price and total item
        price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;
        updateCartTotalPrice();
        updateCartTotalItem();
      } else {
        // Remove the product card entirely
        cardDiv.remove();
        // Remove the product from the productList and localStorage
        const index = productList.findIndex(product => product.id === productId);
        if (index !== -1) {
          productList.splice(index, 1);
          localStorage.setItem('productList', JSON.stringify(productList));
          // Update cart total price and total item
          updateCartTotalPrice();
          updateCartTotalItem();
        }
      }
    });

    // Update the increase button event listener
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.classList.add('btn', 'btn-primary');
    increaseBtn.addEventListener('click', () => {
      productList.push(productDetails);
      // Update localStorage
      localStorage.setItem('productList', JSON.stringify(productList));
      // Update productQuantityMap
      productQuantityMap.set(productId, productQuantityMap.get(productId) + 1);
      // Update the quantity text
      quantityText.textContent = productQuantityMap.get(productId);
      // Update cart total price and total item
      price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;
      updateCartTotalPrice();
      updateCartTotalItem();
    });

    // Create the quantity text element
    const quantityText = document.createElement('span');
    quantityText.textContent = quantity;

    quantityContainer.appendChild(decreaseBtn);
    quantityContainer.appendChild(quantityText);
    quantityContainer.appendChild(increaseBtn);

    // Append elements to the cardBodyDiv
    cardBodyDiv.appendChild(img);
    cardBodyDiv.appendChild(title);
    cardBodyDiv.appendChild(price);
    cardBodyDiv.appendChild(quantityContainer);

    // Append cardBodyDiv to the cardDiv
    cardDiv.appendChild(cardBodyDiv);

    // Append cardDiv to the container
    container.appendChild(cardDiv);
  });
});


function updateLocalStorage(productList, productId) {
  // Find the index of the product to remove
  const index = productList.findIndex(product => product.id === productId);
  if (index !== -1) {
    // Remove the product from the productList
    productList.splice(index, 1);
    // Update localStorage
    localStorage.setItem('productList', JSON.stringify(productList));
  }
}
