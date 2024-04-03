
document.addEventListener('DOMContentLoaded', function () {

  const cartBtn = document.getElementById('cartBtn');


  cartBtn.addEventListener('click', function () {
    console.log("click")
    window.location.href = 'order-form.html';
  });
});

document.addEventListener('DOMContentLoaded', function () {

  const clearCartBtn = document.getElementById('clearCartBtn');

  clearCartBtn.addEventListener('click', function () {

    localStorage.removeItem('productList');
    updateCartTotalItem()
    updateCartTotalPrice()
    const container = document.getElementById('cartProductItemContainer');
    container.innerHTML = '<div class="text-center">Cart is empty</div>';

  });
});

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes("order-form.html")) {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener('click', function(event) {
      event.preventDefault();

      removeAlerts();

        const inputName = document.getElementById('inputName').value.trim();
        const inputEmail = document.getElementById('inputEmail').value.trim();
        const inputPhone = document.getElementById('inputPhone').value.trim();
        const inputAddress = document.getElementById('inputAddress').value.trim();
        const inputCity = document.getElementById('inputCity').value.trim();
        const inputZip = document.getElementById('inputZip').value.trim();
        let isValid = true;

        const onlyLettersRegex = /^[A-Za-z\s]{2,50}$/;
        const containsAtRegex = /@/;
        const phoneRegex = /^[0-9\d\s()-]{1,50}$/;
        const onlyNumbersRegex = /[0-9]/;
        
        if (!onlyLettersRegex.test(inputName)) {
            displayAlert("Name must be between 2 and 50 characters long and contain only letters.", document.getElementById('inputName'));
            isValid = false;
        }

        if (inputEmail.length > 50 || !containsAtRegex.test(inputEmail)) {
          displayAlert('E-postadressen får inte vara längre än 50 tecken och måste innehålla @.', document.getElementById('inputEmail'));
          isValid = false;
        }

        if (!phoneRegex.test(inputPhone)) {
            displayAlert('Numret får endast innehålla siffror, paranteser, bindestreck och max 50 tecken långt.', document.getElementById('inputPhone'));
            isValid = false;
          }

        if (inputAddress.length < 2 || inputAddress.length > 50) {
          displayAlert('Addressen får endast vara minst 2 tecken och max 50 tecken.', document.getElementById('inputAddress'));
          isValid = false;
        }

        if (!onlyLettersRegex.test(inputCity)) {
          displayAlert('Staden får endast innehålla 2-50 tecken.', document.getElementById('inputCity'))
          isValid = false;
        }

        if (!inputZip.length === 5 || !onlyNumbersRegex.test(inputZip)) {
          displayAlert('Postkoden får endast vara 5 siffror', document.getElementById('inputZip'));
          isValid = false;
        }

        if (isValid) {
          window.location.href = 'purchaseConfirmationPage.html'; 
      }

    });
}});

function displayAlert(message, inputField) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-danger');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;

    inputField.parentNode.insertBefore(alertDiv, inputField.nextSibling);
}

function removeAlerts() {
    const alerts = document.querySelectorAll('.alert-danger');
    alerts.forEach(alert => alert.remove());
}

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


  const totalPrice = productList.reduce((total, product) => total + product.price, 0);

  const cartTotalPrice = document.getElementById('cartTotalPrice');


  cartTotalPrice.textContent = "Total: $" + totalPrice; 
}

function createCard(product) {
  updateCartTotalItem();
  const id = product.id;
  const title = product.title;
  const price = product.price;

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

document.addEventListener('DOMContentLoaded', function () {
  updateCartTotalPrice();
  updateCartTotalItem();
  
  const productList = JSON.parse(localStorage.getItem('productList')) || [];

  const productQuantityMap = new Map();

  productList.forEach(product => {
    const productId = product.id;
    productQuantityMap.set(productId, (productQuantityMap.get(productId) || 0) + 1);
  });

  const container = document.getElementById('cartProductItemContainer');

  productQuantityMap.forEach((quantity, productId) => {

    const productDetails = productList.find(product => product.id === productId);


    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'border-0', 'shadow', 'mb-4');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'd-flex', 'align-items-center');

    const img = document.createElement('img');
    img.classList.add('card-img-top', 'me-3');
    img.src = productDetails.image;
    img.alt = 'Product Image';
    img.style.width = "100px"; 

    const title = document.createElement('h5');
    title.classList.add('card-title', 'flex-grow-1', 'mb-0');
    title.textContent = productDetails.title;

    const price = document.createElement('p');
    price.classList.add('card-text', 'fw-bold', 'mb-0', 'ms-auto');
    price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('text-center', 'ms-auto');


    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-';
    decreaseBtn.classList.add('btn', 'btn-primary', 'me-2');
    decreaseBtn.addEventListener('click', () => {
      if (productQuantityMap.get(productId) > 1) {

        productQuantityMap.set(productId, productQuantityMap.get(productId) - 1);

        quantityText.textContent = productQuantityMap.get(productId);

        updateLocalStorage(productList, productId);
   
        price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;
        updateCartTotalPrice();
        updateCartTotalItem();
      } else {
        cardDiv.remove();
        const index = productList.findIndex(product => product.id === productId);

        if (index !== -1) {
          productList.splice(index, 1);
          localStorage.setItem('productList', JSON.stringify(productList));

          updateCartTotalPrice();
          updateCartTotalItem();
        }
      }
    });

  
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.classList.add('btn', 'btn-primary');
    increaseBtn.addEventListener('click', () => {
      productList.push(productDetails);
      
      localStorage.setItem('productList', JSON.stringify(productList));
      
      productQuantityMap.set(productId, productQuantityMap.get(productId) + 1);
      
      quantityText.textContent = productQuantityMap.get(productId);
    
      price.innerHTML = `<strong>Price:</strong> $${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;
      updateCartTotalPrice();
      updateCartTotalItem();
    });

    const quantityText = document.createElement('span');
    quantityText.textContent = quantity;

    quantityContainer.appendChild(decreaseBtn);
    quantityContainer.appendChild(quantityText);
    quantityContainer.appendChild(increaseBtn);

    cardBodyDiv.appendChild(img);
    cardBodyDiv.appendChild(title);
    cardBodyDiv.appendChild(price);
    cardBodyDiv.appendChild(quantityContainer);

    cardDiv.appendChild(cardBodyDiv);

    container.appendChild(cardDiv);
  });
});

function updateLocalStorage(productList, productId) {

  const index = productList.findIndex(product => product.id === productId);
  if (index !== -1) {

    productList.splice(index, 1);

    localStorage.setItem('productList', JSON.stringify(productList));
  }
}




document.addEventListener('DOMContentLoaded', function () {

  const productList = JSON.parse(localStorage.getItem('productList')) || [];

  const productQuantityMap = new Map();

  productList.forEach(product => {
    const productId = product.id;
    productQuantityMap.set(productId, (productQuantityMap.get(productId) || 0) + 1);
  });

  const container = document.getElementById('orderdItemContainer');

  productQuantityMap.forEach((quantity, productId) => {

    const productDetails = productList.find(product => product.id === productId);

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'mb-3');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'd-flex', 'align-items-center');

    const img = document.createElement('img');
    img.classList.add('card-img-top', 'me-3');
    img.src = productDetails.image;
    img.alt = 'Product Image';
    img.style.width = "100px"; 

    const title = document.createElement('h5');
    title.classList.add('card-title', 'mb-0');
    title.textContent = productDetails.title;

    const price = document.createElement('p');
    price.classList.add('card-text', 'fw-bold', 'mb-0', 'ms-auto');
    price.textContent = `$${(productDetails.price * productQuantityMap.get(productId)).toFixed(2)}`;

    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('text-center', 'ms-auto');


    const quantityText = document.createElement('span');
    quantityText.textContent = quantity;

    quantityContainer.appendChild(quantityText);

    cardBodyDiv.appendChild(img);
    cardBodyDiv.appendChild(title);
    cardBodyDiv.appendChild(price);
    cardBodyDiv.appendChild(quantityContainer);


    cardDiv.appendChild(cardBodyDiv);


    container.appendChild(cardDiv);
  });
});

document.addEventListener('DOMContentLoaded', function () {

  const cartBtn = document.getElementById('keepShoppingBtn');

  cartBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
    localStorage.removeItem('productList');
    updateCartTotalItem()
    updateCartTotalPrice()
  });
});