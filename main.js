let books = [];
let booksSearch;
const RENDER_EVENT = "render_book";
const SAVED_EVENT = "saved_book";
const STORAGE_KEY = "BOOKS_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFormStorage();
  }
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });
});

function searchBook() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let dataStorage = JSON.parse(serializeData);

  booksSearch = [];
  const title = document.getElementById("searchBookTitle");
  const query = title.value;
  let data = dataStorage.filter((books) => books.title.toLowerCase().includes(query.toLowerCase()));

  data.map((d) => booksSearch.push(d));

  loadDataFormStorage();
}

document.addEventListener(RENDER_EVENT, function name() {
  const incompleteBookList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";

  const completeBookList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isReaded) incompleteBookList.append(bookElement);
    else completeBookList.append(bookElement);
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log("Local Storage Updated!");
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Anda tidak mendukung Local Storage");
    return false;
  }
  return true;
}

function loadDataFormStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  books = [];

  if (booksSearch != undefined) {
    booksSearch.map((book) => books.push(book));
  } else {
    if (data != null) {
      for (const book of data) {
        books.push(book);
      }
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isReaded) {
  return {
    id,
    title,
    author,
    year,
    isReaded,
  };
}

function addBook() {
  const title = document.getElementById("inputBookTitle");
  const author = document.getElementById("inputBookAuthor");
  const year = document.getElementById("inputBookYear");
  const isReaded = document.getElementById("inputBookIsComplete");

  const generatedID = generateId();
  const bookObject = generateTodoObject(generatedID, title.value, author.value, year.value, isReaded.checked);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${bookObject.id}`);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  if (bookObject.isReaded) {
    const unreadedButton = document.createElement("Button");
    unreadedButton.id = bookObject.id;
    unreadedButton.innerText = "Belum Selesai Dibaca";
    unreadedButton.classList.add("green");
    unreadedButton.addEventListener("click", function () {
      undoBookFromReaded(bookObject.id);
    });
    buttonContainer.append(unreadedButton);
  } else {
    const isReadedButton = document.createElement("button");
    isReadedButton.id = bookObject.id;
    isReadedButton.innerText = "Selesai Dibaca";
    isReadedButton.classList.add("green");
    isReadedButton.addEventListener("click", function () {
      addBookToReaded(bookObject.id);
    });
    buttonContainer.append(isReadedButton);
  }

  const deleteButton = document.createElement("button");
  deleteButton.id = bookObject.id;
  deleteButton.innerText = "Hapus Buku";
  deleteButton.classList.add("red");
  deleteButton.addEventListener("click", function () {
    if (confirm("Anda yakin ingin menghapus buku?")) {
      removeBook(bookObject.id);
    }
  });
  buttonContainer.append(deleteButton);

  container.append(buttonContainer);

  return container;
}

function addBookToReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
