// Header
const harold = document.getElementById('harold')

// Bank
const balanceDisplay = document.getElementById('span-balance-display')
const loanText = document.getElementById('p-loan-text')
const loanDisplay = document.getElementById('span-loan-display')

// Work
const payDisplay = document.getElementById('span-pay-display')
const repayLoanButton = document.getElementById('repay-loan')

// Laptop menu
const laptopsMenu = document.getElementById('select-laptops-menu')
const laptopFeatures = document.getElementById('p-laptop-features')

// Laptop display
const laptopImage = document.getElementById('img-laptop-image')
const laptopTitle = document.getElementById('h1-laptop-title')
const laptopDescription = document.getElementById('p-laptop-description')
const laptopPrice = document.getElementById('h2-laptop-price')
const buyNowButton = document.getElementById('buy')

let balance = 0
let pay = 0
let loan = 0
let laptopsOwned = 0
const salary = 100

let laptops = []

displayBalance()
displayPay()
updateHarold()

// #region Get a loan

/**
 * Prompts the user input for a loan value and handles the input.
 */
function getLoan() {
    inputLoan = prompt("How much would you like to borrow?")
    if (inputLoan !== null && isLoanValid(parseInt(inputLoan))) {
        loan = parseInt(inputLoan)
        balance += loan
        
        // Makes the loan button and text visible
        repayLoanButton.style.visibility = "visible"
        loanText.style.visibility = "visible"
        loanDisplay.style.visibility = "visible"
        displayLoan()
    }
    displayBalance()
}

/**
 * Checks whether the user input loan is valid.
 * @param {Number} inputLoan - The user input loan.
 * @returns A boolean indicating success and an alert explaining the error.
 */
function isLoanValid(inputLoan) {
    if (inputLoan > 2*balance) {
        alert("Your balance is too low to borrow this amount!")
        return false
    } else if (loan > 0) {
        alert("You haven't paid off your previous loan yet!")
        return false
    }
    return true
}

/**
 * Displays the current balance
 */
function displayBalance() {
    balanceDisplay.innerText = `€${balance}`
}

/**
 * Displays the current outstanding loan
 */
function displayLoan() {
    loanDisplay.innerText = `€${loan}`
}

// #endregion


// #region Work

/**
 * Adds the salary to the pay.
 */
function work() {
    pay += salary
    displayPay()
}

/**
 * Display the current pay.
 */
function displayPay() {
    payDisplay.innerText = `€${pay}`
}

// #endregion


// #region Bank

/**
 * Moves the pay to the balance.
 */
function bank() {
    // If the user has an outstanding loan 10% of their pay goes to the loan
    if (loan > 0) {
        loan -= 0.1*pay
        pay *= 0.9
    }
    balance += pay
    pay = 0
    displayBalance()
    displayPay()
    displayLoan()
}

// #endregion


// #region Repay loan

/**
 * Uses the pay to pay off as much of the outstanding loan as possible.
 */
function repayLoan() {
    if (loan > pay) {
        loan -= pay
        pay = 0
        displayLoan()
    } else {
        pay -= loan
        loan = 0

        // Makes the loan button and text hidden as the loan is paid off
        repayLoanButton.style.visibility = 'hidden'
        loanText.style.visibility = 'hidden'
        loanDisplay.style.visibility = 'hidden'
    }
    displayPay()
}

// #endregion


// #region Laptops

// Fetches the laptops from the API
fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops));

/**
 * Adds the laptops to the menu.
 * @param {Array} laptops - The array of laptop objects.
 */
function addLaptopsToMenu(laptops) {
    laptops.forEach(laptop => addLaptopToMenu(laptop))
    // Simulates change event to display laptop information when the page is opened
    laptopsMenu.dispatchEvent(new Event('change'))
}

/**
 * Adds a single laptop to the menu.
 * @param {Object} laptop - A laptop object.
 */
function addLaptopToMenu(laptop) {
    let laptopElement = document.createElement('option')
    laptopElement.value = laptop.id
    laptopElement.appendChild(document.createTextNode(laptop.title))
    laptopsMenu.appendChild(laptopElement)
}

/**
 * Handles a change to the laptop menu.
 * @param {Event} e - The event that triggers this functions.
 */
const handleLaptopMenuChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex]
    laptopFeatures.innerText = ""
    displayInformation(selectedLaptop)
    
}

laptopsMenu.addEventListener('change', handleLaptopMenuChange)

// #endregion


// #region Display laptops

/**
 * Displays the laptops features below the menu.
 * @param {Object} laptop - a laptop object.
 */
function displayFeatures(laptop) {
    laptopFeatures.innerText  = laptop.specs.reduce((state, spec) => `${state}\n` + spec)
}

/**
 * Displays the laptops price.
 * @param {Object} laptop - a laptop object.
 */
function displayPrice(laptop) {
    laptopPrice.innerText = `${laptop.price} EURO`
}

/**
 * Displays the laptops name.
 * @param {Object} laptop - a laptop object.
 */
function displayTitle(laptop) {
    laptopTitle.innerText = laptop.title
}

/**
 * Displays the laptops description.
 * @param {Object} laptop - a laptop object.
 */
function displayDescription(laptop) {
    laptopDescription.innerText = laptop.description
}

/**
 * Tries common image file extensions to find the correct image URL in case something went wrong.
 * @param {Object} laptop - a laptop object.
 * @returns The correct URL if the file extension happens to be different, an empty string if the correct URL can't be found using this method.
 */
function getRightImageURL(laptop) {
    for (let fileExt of ['.png', '.jpg', '.jpeg']) {
        url = `https://noroff-komputer-store-api.herokuapp.com/assets/images/${laptop.id}${fileExt}`
        urlRight = fetch(url).then((response) => response.ok)
        if (urlRight) {
            return url
        }
    }
    return ""
}

/**
 * Gets the image and displays it.
 * @param {Object} laptop - a laptop object.
 */
function getImage(laptop) {
    laptopImage.alt = `image of ${laptop.title}`
    url = `https://noroff-komputer-store-api.herokuapp.com/${laptop.image}`
    fetch(url)
        .then(function (response) {
            if (response.status === 404) {
                url = getRightImageURL(laptop)
                if (url !== "") {
                    fetch(url)
                }
            }
            laptopImage.src = url
            laptopImage.alt = `Picture of ${laptop.title}` 
        })
        .catch(() => console.log("Something went wrong with fetching the image"));
}

/**
 * A helper function that calls all the laptop information display functions.
 * @param {Object} laptop - a laptop object.
 */
function displayInformation(laptop) {
    displayFeatures(laptop)
    displayPrice(laptop)
    displayTitle(laptop)
    displayDescription(laptop)
    getImage(laptop)
}

/**
 * Updates the header image based on the amount of purchases.
 */
function updateHarold() {
    if (laptopsOwned >= 6) {
        harold.src = "images/Harold4.jpg"
        harold.alt = "Harold loves you for buying more laptops than anyone would ever need in their life!"
    } else if (laptopsOwned >= 4) {
        harold.src = "images/Harold3.jpg"
        harold.alt = "Harold is excited that you're buying so many laptops!"
    } else if (laptopsOwned >= 2) {
        harold.src = "images/Harold2.jpg"
        harold.alt = "Harold approves of your laptop purchases so far."
    } else {
        harold.src = "images/Harold.jpg"
        harold.alt = "Hide The Pain Harold behind his trusty laptop."
    }
}

/**
 * Buys the selected laptop.
 */
function buyNow() {
    laptop = laptops[laptopsMenu.selectedIndex]
    if (balance >= laptop.price) {
        balance -= laptop.price
        alert(`You are now the proud owner of a ${laptop.title}!`)
        laptopsOwned++
        updateHarold()
        displayBalance()
        
        // Removes the selected laptop from the menu.
        laptops.splice(laptopsMenu.selectedIndex, 1)
        laptopsMenu.remove(laptopsMenu.selectedIndex)
        if (laptops.length === 0) {
            soldOut()
        } else {
            let newLaptop = laptops[laptopsMenu.selectedIndex]
            displayInformation(newLaptop)
        }
    } else {
        alert("Your balance is too low to buy this laptop!")
    }
}

/**
 * Changes the information display to reflect the fact that all laptops have been sold.
 */
function soldOut() {
    laptopImage.src = "images/soldOut.jpg"
    laptopTitle.innerText = "SOLD OUT"
    laptopTitle.style.color = "#C64756"
    laptopDescription.innerText = "You bought every laptop!\nWe're very thankful, but what are you going to do with 6 laptops?!"
    laptopPrice.innerText = ""
    buyNowButton.style.visibility = 'hidden'
    laptopsMenu.style.visibility = 'hidden'
    laptopFeatures.innerText = "None"
}

// #endregion
