let books = [
  // {
  //   id: '#',
  //   Name: 'a',
  //   Author: 'b',
  //   Genere: 'c',
  //   Edition: 'd',
  // }
  // {
  //   id: '#',
  //   Name: 'name',
  //   Author: 'author',
  //   Genere: 'genere',
  //   Edition: 'edition',
  // }
]
async function fetchdata() {
  const response = await fetch('http://localhost:5003/getAll');
  const data = await response.json();
  books = data['data'];
  // console.log(data['data']);
  // console.log(books);
  checkBooks();
  addBooks();
  removeShadow();
}
function removeShadow() {
  document.querySelector(".shading-div-on").classList.add("shading-div-off");
}
function addShadow() {
  document.querySelector(".shading-div-on").classList.remove("shading-div-off");
}
document.addEventListener("DOMContentLoaded", function () {
  // fetch data and store in books, FETCHING BOOKS logo will be running 
  // checkBooks();
  setTimeout(() => {
    fetchdata();
  }, 1000);

  // console.log(books);
})

const noBooksAvilWithBtn = document.querySelector(".ad-bok-btn-li-emty-on");
const modalPrompt = document.querySelector(".modal-prompt-on");

function checkBooks() {
  const booksLength = books.length;
  const fetchingBookMessage = document.querySelector(".fetching-book-message-off");
  const AddBookBtnTopRight = document.querySelector(".add-book-btn-class-on");
  fetchingBookMessage.classList.remove("fetching-book-message-on");
  if (booksLength === 0) {
    noBooksAvilWithBtn.classList.remove("ad-bok-btn-li-emty-off");
    AddBookBtnTopRight.classList.add("add-book-btn-class-off");
  }
  else {
    noBooksAvilWithBtn.classList.add("ad-bok-btn-li-emty-off");
    AddBookBtnTopRight.classList.remove("add-book-btn-class-off");
  }
}

function addBooks() {
  let booksList = books.map((book, index) => {
    return `<tr><td>${index + 1}</td>
  <td>${book.Name}</td>
 <td>${book.Author}</td>
 <td>${book.Genere}</td>
 <td>${book.Edition}</td>
 <td><button class="edit-btn" id=${book.id}>Edit</button><button id=${book.id} class="delete-btn">Delete</button></td></tr>`;
  }).join("");
  document.querySelector(".table").innerHTML = `<tr>
          <th>S No.</th>
          <th>Name</th>
          <th>Author</th>
          <th>Genere</th>
          <th>Edition</th>
          <th>Action</th>
        </tr>`;
  document.querySelector(".table").innerHTML += booksList;
}
// Blue Add Book Buttons Event Handler 
let AddBookBtns = document.querySelectorAll(".main-add-book-btn");
AddBookBtns.forEach((AddBookBtn) => {
  AddBookBtn.addEventListener("click", function () {
    modalPromptOn("ad-bok-btn-li-emty-off", "modal-prompt-off", "are-you-sure-on", "add-or-edit-on", ".add-or-edit-on .header .promptHeading", "Add a new book");
    addShadow();
    removeErrorAndClearDataOnInput();
    document.querySelector(".submit-btn").classList.replace("save-btn-on", "add-submit-btn-on");
  })

})
// let editRowIndex = null;
// when we add elements dinamically we have to call by event.target.dataset.id/class
document.querySelector('.table').addEventListener('click', function (e) {
  // console.log(e.target.id);
  if (e.target.className === 'delete-btn') {
    deleteBtn(e.target.id);
  } else if (e.target.className === "edit-btn") {
    editBtn(e.target.id);
  }
})
function editBtn(id) {
  // console.log(index);
  // editRowIndex = index-1;
  // console.log(id);
  modalPromptOn("ad-bok-btn-li-emty-off", "modal-prompt-off", "are-you-sure-on", "add-or-edit-on", ".add-or-edit-on .header .promptHeading", "Edit book details");
  addShadow();
  const formInputNames = ['Name', 'Author', 'Genere', 'Edition'];
  const bookDetails = books.find((book) => book.id == id);
  // console.log(bookDetails);
  // console.log(formInputValues); 
  formInputNames.forEach((idName) => {
    document.querySelector("#" + idName).value = bookDetails[idName];
  })
  document.querySelector(".submit-btn").classList.replace("add-submit-btn-on", "save-btn-on");

  const saveBtn = document.querySelector(".save-btn");
  // console.log(saveBtn);
  saveBtn.addEventListener("click", saveBtnEventHandler);
  // some times on editing 1 row it is effecting all rows 
  //1st editing after refresh, edits the selected row...
  //but 2nd editing after refresh, editing the entire rows
  //issue solved we have to remove event listeners after adding them
  function saveBtnEventHandler(e) {
    e.preventDefault();
    // console.log("save btn clicked");
    const [name, author, genere, edition] = formDetails();
    // console.log(formDetails());
    const formInputNames = ['name', 'author', 'genere', 'edition'];
    const formInputValues = [name, author, genere, edition];
    formInputNames.forEach((item, index) => {
      if (formInputValues[index] === "") {
        const element = document.querySelector("." + item + "-input");
        element.classList.add("input-error-on");
      } else {
        const element = document.querySelector("." + item + "-input");
        element.classList.remove("input-error-on");
      }
    })
    if (name && author && genere && edition) {
      processOnAndButtonsOff("Saving changes");
      setTimeout(() => {
        fetch('http://localhost:5003/update', {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            Name: name,
            Author: author,
            Genere: genere,
            Edition: edition,
            Id: id
          })
        }).then(response => response.json())
          .then(data => {
            if (data.success) {
              fetchdata();
              document.querySelector(".modal-prompt-on").classList.add("modal-prompt-off");
              removeShadow();
              processOffAndButtonsOn();
              confirmMessageDisplay("Changes Saved!!", "rgb(71, 199, 21)");
            }
          });
      }, 1000);
    }
    saveBtn.removeEventListener("click", saveBtnEventHandler);
  }
}
// saveBtn(id);
function deleteBtn(id) {
  // console.log("delete btn clicked");
  const book = books.find((book) => book.id == id);
  bookName = book.Name;
  modalPromptOn("ad-bok-btn-li-emty-off", "modal-prompt-off", "add-or-edit-on", "are-you-sure-on", ".are-you-sure-on .header .promptHeading", "deleteBookBtn", bookName);
  addShadow();
  yesDeleteBtn(id, bookName);
}

function yesDeleteBtn(id, bookName) {
  const yesDeleteBtn = document.querySelector(".yes-btn");
  yesDeleteBtn.addEventListener("click", yesBtnEventListener );
  function yesBtnEventListener(e){
      e.preventDefault();
      // console.log("yes btn clicked");
      // give confirm message
      processOnAndButtonsOff(`Deleting book`);
      setTimeout(() => {
        fetch('http://localhost:5003/delete/' + id, {
          method: 'DELETE'
        })
          .then(response => {
            fetchdata();
            document.querySelector(".modal-prompt-on").classList.add("modal-prompt-off");
            processOffAndButtonsOn();
            removeShadow();
            confirmMessageDisplay(`"${bookName}" deleted!!`, "red");
          });
      }, 1000);
    yesDeleteBtn.removeEventListener("click", yesBtnEventListener);
    }
}

function modalPromptOn(NoBooksAvailSwitchOff, ModalOff, secondaryPrompt, primaryPrompt, promptHeader, HeaderText, bookName) {
  noBooksAvilWithBtn.classList.add(NoBooksAvailSwitchOff);
  modalPrompt.classList.remove(ModalOff);
  modalPrompt.classList.remove(secondaryPrompt);
  modalPrompt.classList.add(primaryPrompt);
  document.querySelector(promptHeader).innerHTML = HeaderText;
  // special case comment 
  {
    // it is special case only for delete Book button
    //where prompt header has visibility none when
    //"are-you-sure-on" classes is added to prompt's main div
    //so I have used "promptHeader" to verify it is a 
    //delete btn
  }

  if (HeaderText === "deleteBookBtn") {
    document.querySelector(".delete-book-name").innerHTML = `"${bookName}" ?`;
  }
}

function formDetails() {
  let formElement = document.forms.bookDetails;
  let formData = new FormData(formElement);
  let name = formData.get('name');
  let author = formData.get('author');
  let genere = formData.get('genere');
  let edition = formData.get('edition');
  return [name, author, genere, edition];
}

function processOffAndButtonsOn() {
  document.querySelector(".processing-message").classList.replace("processing-message-on", "processing-message-off");
  document.querySelector(".add-and-cancel-btns-on").classList.remove("add-and-cancel-btns-off");
  document.querySelector(".yes-no-btns-on").classList.remove("yes-no-btns-off");
}
function processOnAndButtonsOff(text) {
  document.querySelector(".processing-message").classList.replace("processing-message-off", "processing-message-on");
  document.querySelector(".processing-message .updating-message").innerHTML = text;
  document.querySelector(".add-and-cancel-btns-on").classList.add("add-and-cancel-btns-off");
  document.querySelector(".yes-no-btns-on").classList.add("yes-no-btns-off");
}
const AddBookSubmitBtn = document.querySelector(".add-submit-btn");
AddBookSubmitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const [name, author, genere, edition] = formDetails();
  // console.log(formDetails());
  const formInputNames = ['name', 'author', 'genere', 'edition'];
  const formInputValues = [name, author, genere, edition];
  formInputNames.forEach((item, index) => {
    if (formInputValues[index] === "") {
      const element = document.querySelector("." + item + "-input");
      element.classList.add("input-error-on");
    } else {
      const element = document.querySelector("." + item + "-input");
      element.classList.remove("input-error-on");
    }
  })
  if (name && author && genere && edition) {
    processOnAndButtonsOff(`Adding "${name}" to the Book Room`);
    setTimeout(() => {
      fetch('http://localhost:5003/insert', {
        headers: {
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          Name: name,
          Author: author,
          Genere: genere,
          Edition: edition
        })
      }).then(response => {
        fetchdata();
        document.querySelector(".modal-prompt-on").classList.add("modal-prompt-off");
        processOffAndButtonsOn();
        removeShadow();
        confirmMessageDisplay(`"${name}" Added!`, "rgb(71, 199, 21)");
      });
    }, 1000);
  }
})

// this is to Add Event Handler to all close buttons 
const allCloseBtnsClasses = ['.modal-prompt-on .header img', '.cancel-btn', '.no-btn'];
allCloseBtnsClasses.forEach((btnClass) => {
  let closeBtn = document.querySelector(btnClass);
  closeBtn.addEventListener("click", function () {
    modalPrompt.classList.add("modal-prompt-off");
    removeErrorAndClearDataOnInput();
    checkBooks();
    removeShadow();
  })
})

//???? error on enter 

// this function removes error messages and ENTERED DATA on inputs when we close the Modal Prompt
function removeErrorAndClearDataOnInput() {
  const formInputNames = ['name', 'author', 'genere', 'edition'];
  formInputNames.forEach((item, index) => {
    const element = document.querySelector("." + item + "-input");
    const inputElement = document.querySelector("." + item + "-input input");
    inputElement.value = "";
    element.classList.remove("input-error-on");

  })
}
// rgb(71, 199, 21)
// "BOOK ADDED!!" "CHANGES SAVED!!" "BOOK DELETED" message
function confirmMessageDisplay(message, backGroundColor) {
  const confirmMessageDisplay = document.querySelector(".book-added-msg-on");
  confirmMessageDisplay.classList.remove("book-added-msg-off");
  confirmMessageDisplay.textContent = message;
  confirmMessageDisplay.style.backgroundColor = backGroundColor;
  setTimeout(() => {
    confirmMessageDisplay.classList.add("book-added-msg-off");
  }, 1000)
}

// const deleteBtn = document.querySelector(".delete-btn");
// console.log(deleteBtn);

//why i cant access table data value directly even if it has a id or class attached to it



