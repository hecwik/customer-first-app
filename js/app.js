/*
1. Skapa en sida i Vanilj Javascript med ECMASCRIPT 6 syntax
2. Hämta data från detta API https://reqres.in/api/users/
3. Presentera datat på ett sätt som gör att användaren förstår vad listan är 
   till för använd gärna SCSS / CSS för detta
4. Gör varje person klickbar så att de öppnas i en modal 
   och gör api anropet https://reqres.in/api/users/ANVÄNDARID
5. Strukturera projektet enligt best practices, mappar, kod fördelning kommentarer etc.
6. Lägg upp på github och skicka tillbaka
*/

// Get API data async, including pagination variables as arguments
async function fetchData(page, perPage) {
  const response = await fetch(
    `https://reqres.in/api/users?page=${page}&per_page=${perPage}`
  );

  const data = await response.json();

  return data;
}

// Funktion som skapar tabell och rader
function createTableItems(data) {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  // För varje "användare", skapa en klickbar rad i tabellen.
  // Klickar man på en rad så kommer en detaljvy upp med den användarens bild.
  data.forEach((user) => {
    const row = document.createElement("tr");
    row.addEventListener("click", () => {
      displayModal(user);
    });

    const idCell = document.createElement("td");
    const profileImgCell = document.createElement("td");
    const emailCell = document.createElement("td");
    const firstNameCell = document.createElement("td");
    const lastNameCell = document.createElement("td");

    // Ange vad som ska visas i vilken tabell-cell.
    idCell.textContent = user.id;
    emailCell.textContent = user.email;
    firstNameCell.textContent = user.first_name;
    lastNameCell.textContent = user.last_name;

    const profileImg = document.createElement("img");
    profileImg.src = user.avatar;
    profileImg.alt = `${user.first_name} ${user.last_name}`;
    profileImgCell.appendChild(profileImg);

    row.appendChild(idCell);
    row.appendChild(profileImgCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(emailCell);

    tableBody.appendChild(row);
  });
}

// Paginering
let currentPage = 1;

function handlePagination(page) {
  const perPage = 6;
  
  fetchData(page, perPage)
    .then((data) => {
      createTableItems(data.data);

      const nextPageButton = document.getElementById("next-page-button");
      const previousPageButton = document.getElementById(
        "previous-page-button"
      );

      // Här hanteras huruvida knappar visas beroende på vilken sida man befinner sig på.
      if (currentPage === 1) {
        previousPageButton.disabled = true;
      } else {
        previousPageButton.disabled = false;
      }

      if (currentPage >= data.total_pages) {
        nextPageButton.disabled = true;
      } else {
        nextPageButton.disabled = false;
      }
    })
    .catch((error) => { // Error handling för att se fel i konsollen.
      console.log("Error", error);
    });
}

// Funktion för att visa modalfönster
function displayModal(user) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  // Hämta data från API beroende på vilken user det är.
  fetch(`https://reqres.in/api/users/${user.id}`)
    .then(response => response.json())
    .then(() => {
      modalContent.innerHTML = `
        <h2>${user.first_name} ${user.last_name}</h2>
        <p>Email: ${user.email}</p>
        <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}">
        `;

      modal.style.display = "block";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Funktion för att dölja modalfönster.
function hideModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", hideModal);

// Hanterar paginering för föregående sida.
// Kollar att currentPage är större än 1. Då  decrement:ar currentpage med 1.
function handlePreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    handlePagination(currentPage);
  }
}

// Hanterar paginering för nästa sida. Increment:ar currentPage.
function handleNextPage() {
  currentPage++;
  handlePagination(currentPage);
}

handlePagination(currentPage);

// Skapa nästa och
const previousPageButton = document.getElementById("previous-page-button");
previousPageButton.addEventListener("click", handlePreviousPage);

const nextPageButton = document.getElementById("next-page-button");
nextPageButton.addEventListener("click", handleNextPage);
