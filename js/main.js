//! variables of inputs (to create)
const titleProduct = document.getElementById("title");
const priceProduct = document.getElementById("price");
const taxesProduct = document.getElementById("taxes");
const adsProduct = document.getElementById("ads");
const discountProduct = document.getElementById("discount");
const totalPriceProduct = document.getElementById("total");
const countProduct = document.getElementById("count");
const categoryProduct = document.getElementById("category");
// btn
const submitProduct = document.getElementById("submit");

//! variables of outputs (to search)
const searchProduct = document.getElementById("search");
//btn
const btnTitleProduct = document.getElementById("searchTitle");
const btnCategoryProduct = document.getElementById("searchCategory");

let mood = "create";

let temp;

let products;
if (localStorage.products != null) {
  // get from local storage
  products = JSON.parse(localStorage.getItem("products"));
  displayProduct();
} else {
  products = [];
}

//? get total
function getTotal() {
  if (priceProduct.value != "") {
    let result =
      +priceProduct.value +
      +taxesProduct.value +
      +adsProduct.value -
      +discountProduct.value;

    if (result < 0) {
      result = 0;
    }
    totalPriceProduct.innerHTML = result;
    document.getElementById("total-box").style.backgroundColor = "green";
  } else {
    totalPriceProduct.innerHTML = "0";
    document.getElementById("total-box").style.backgroundColor = "";
  }
}
//? create product
function createProduct() {
  let product = {
    title: titleProduct.value,
    price: priceProduct.value,
    taxes: taxesProduct.value,
    ads: adsProduct.value,
    discount: discountProduct.value,
    totalPrice: totalPriceProduct.innerHTML,
    count: countProduct.value,
    category: categoryProduct.value,
  };

  if (mood === "create") {
    // Only validate inputs when in "create" mode
    if (
      titleProduct.value != "" &&
      priceProduct.value != "" &&
      taxesProduct.value != "" &&
      adsProduct.value != "" &&
      discountProduct.value != "" &&
      categoryProduct.value != ""
    ) {
      products.push(product);
    } else {
      validateInputs(); // Validate only when creating a new product
      return; // Exit the function if validation fails
    }
  } else {
    // Update mode: directly update the product without validation
    products[temp] = product;
    mood = "create";
    submitProduct.innerHTML = "Create";
    submitProduct.style.backgroundColor = "";
  }

  clearValidationClasses();
  getTotal();
  saveToLocalStorage();
  displayProduct();
  clearData(); // Clear inputs after creation
}
//clean data
function validateInputs() {
  // Select all input fields inside the .inputs div
  const inputs = document.querySelectorAll(".inputs input");

  // Loop through each input and check if it's empty
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("invalid"); // Add 'invalid' class if empty
      submitProduct.classList.add("disabled");

      input.addEventListener("input", function () {
        if (input.value.trim() !== "") {
          input.classList.remove("invalid");
          submitProduct.classList.remove("disabled");
        } // Remove 'invalid' class if empty if we start typing
      });
    } else {
      submitProduct.classList.remove("disabled");
      input.classList.remove("invalid"); // Remove 'invalid' class if not empty
    }
  });
}
function clearValidationClasses() {
  const inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input) => {
    input.classList.remove("invalid");
  });
  submitProduct.classList.remove("disabled");
}
submitProduct.addEventListener("click", function () {
  createProduct();
  document.getElementById("total-box").style.backgroundColor = "";
});
//? save to local storage
function saveToLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}
//? clear inputs
function clearData() {
  titleProduct.value = "";
  priceProduct.value = "";
  taxesProduct.value = "";
  adsProduct.value = "";
  discountProduct.value = "";
  totalPriceProduct.innerHTML = "0";
  countProduct.value = "";
  categoryProduct.value = "";
}
//? display
function displayProduct() {
  getTotal();
  let cartona = ``;
  for (let i = 0; i < products.length; i++) {
    cartona += `
        <tr>
          <td>${i + 1}</td>
          <td>${products[i].title}</td>
          <td>${products[i].price}</td>
          <td>${products[i].taxes}</td>
          <td>${products[i].ads}</td>
          <td>${products[i].discount}</td>
          <td>${products[i].totalPrice}</td>
          <td>${products[i].count}</td>
          <td>${products[i].category}</td>
          <td>
            <a><i id="update" onclick='updateProduct(${i})' class="fas fa-edit"></i></a>
          </td>
          <td>
            <a><i id="delete" onclick='deleteProduct(${i})' class="fas fa-trash"></i></a>
          </td>
        </tr>
      `;
  }

  document.getElementById("productsTable").innerHTML = cartona;
  let deleteAll = document.getElementById("delete-all");
  if (products.length > 0) {
    deleteAll.innerHTML = `
      <button class="btn" onclick='deleteAllProduct()'>Delete All (${products.length})</button>
    `;
  } else {
    deleteAll.innerHTML = "";
  }
}
//? delete //delete all
function deleteProduct(index) {
  console.log(index);

  products.splice(index, 1);
  saveToLocalStorage();
  displayProduct();
}
function deleteAllProduct() {
  products = [];
  saveToLocalStorage();
  displayProduct();
}
//count
//? update
function updateProduct(index) {
  clearValidationClasses();
  temp = index;
  titleProduct.value = products[index].title;
  priceProduct.value = products[index].price;
  taxesProduct.value = products[index].taxes;
  adsProduct.value = products[index].ads;
  discountProduct.value = products[index].discount;
  getTotal();
  countProduct.value = products[index].count;
  categoryProduct.value = products[index].category;

  submitProduct.innerHTML = "Update";
  submitProduct.style.backgroundColor = "green";
  scrollTo({
    top: 0,
    behavior: "smooth",
  });
  mood = "update";
}
//? search
let searchMood = "title";
btnTitleProduct.addEventListener("click", function () {
  searchMood = "title";
  modifyInput(searchMood);
  searchProduct.value = ``;
  displayProduct();
});
btnCategoryProduct.addEventListener("click", function () {
  searchMood = "category";
  modifyInput(searchMood);
  searchProduct.value = ``;
  displayProduct();
});
function modifyInput(name) {
  searchProduct.focus();
  searchProduct.placeholder = ` Search By ${name} `;
}
searchProduct.addEventListener("input", function () {
  let cartona = ``;
  //convert string to lower case
  let searchValue = this.value.toLowerCase();
  //check search mood
  let typeOfSearch = searchMood === "title" ? "title" : "category";

  //get filtered array from search
  let filteredProducts = products.filter((product) => {
    return product[typeOfSearch].toLowerCase().includes(searchValue);
  });

  //show data
  filteredProducts.forEach((product, index) => {
    cartona += `
        <tr>
          <td>${index + 1}</td>
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td>${product.taxes}</td>
          <td>${product.ads}</td>
          <td>${product.discount}</td>
          <td>${product.totalPrice}</td>
          <td>${product.count}</td>
          <td>${product.category}</td>
          <td>
            <a><i id="update" onclick='updateProduct(${index})' class="fas fa-edit"></i></a>
          </td>
          <td>
            <a><i id="delete" onclick='deleteProduct(${index})' class="fas fa-trash"></i></a>
          </td>
        </tr>
      `;
  });

  document.getElementById("productsTable").innerHTML = cartona;
  let deleteAll = document.getElementById("delete-all");
  if (products.length > 0) {
    deleteAll.innerHTML = `
      <button class="btn" onclick='deleteAllProduct()'>Delete All (${products.length})</button>
    `;
  } else {
    deleteAll.innerHTML = "";
  }
});

//! dark mood
const toggleIcon = document.getElementById("toggleIcon");
const body = document.body;

toggleIcon.addEventListener("click", () => {
  // Toggle between dark and light mode classes
  body.classList.toggle("light-mode");

  // Change the icon accordingly
  if (body.classList.contains("light-mode")) {
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
  } else {
    toggleIcon.classList.remove("fa-sun");
    toggleIcon.classList.add("fa-moon");
  }
});

// i need to refactor it first coding crud
