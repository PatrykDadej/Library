/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
const gridSelector = document.querySelector('.mainGrid');
const createBookSelector = document.querySelector('.createBook');
const addNewBookSelector = document.querySelectorAll('[data-popup-target]');
const closeSelector = document.querySelectorAll('[data-popup-close]');
const overlaySelector = document.querySelector('#overlay');
const numberOfBooksSelector = document.querySelector('.numberBooks');
const totalPagesReadInLibrarySelector = document.querySelector('.numberPagesRead');
const totalPagesToGoInLibrarySelector = document.querySelector('.numberPagesToGo');
const cancelButtonSelector = document.querySelector('.cancel');
let titleValueSelector = document.querySelector('#title').value;
let authorValueSelector = document.querySelector('#author').value;
let pagesValueSelector = document.querySelector('#pages').value;
let progressValueSelector = document.querySelector('#pagesRead').value;
let formSelector = document.querySelector('#addBookForm');
const editFormSelector = document.querySelector('#editBookForm');
let editIconSelector = document.querySelectorAll('.editThisBook');
let toBeEdited;
let totalPagesInLibrary = [];
let totalPagesRead = [];
const myLibrary = [];

function refreshEventListeners() {
  editIconSelector = document.querySelectorAll('.editThisBook');
  editIconSelector.forEach((edit) => {
    edit.addEventListener('click', () => {
      const popup = document.querySelector(edit.dataset.popupTarget);
      openPopup(popup);
      editFormSelector.reset();
      const selectedBookContainer = edit.closest('.bookContainer');
      toBeEdited = selectedBookContainer;
      document.querySelector('#titleEdit').value = selectedBookContainer.querySelector('.titleData').textContent;
      document.querySelector('#authorEdit').value = selectedBookContainer.querySelector('.authorData').textContent.split('Author: ')[1];
      document.querySelector('#pagesEdit').value = selectedBookContainer.querySelector('.pagesData').textContent.split('Pages: ')[1];
      document.querySelector('#pagesReadEdit').value = selectedBookContainer.querySelector('.pagesReadData').textContent.split('Pages: ')[1];
      const editBookSelector = document.querySelector('.editBook');
      editBookSelector.addEventListener('click', () => {
        toBeEdited.querySelector('.titleData').textContent = document.querySelector('#titleEdit').value;
        toBeEdited.querySelector('.authorData').textContent = `Author: ${document.querySelector('#authorEdit').value}`;
        toBeEdited.querySelector('.pagesData').textContent = `Pages: ${document.querySelector('#pagesEdit').value}`;
        toBeEdited.querySelector('.pagesReadData').textContent = `Pages: ${document.querySelector('#pagesReadEdit').value}`;
        closePopup(popup);
        updateStats();
      });
    });
  });
}

function openPopup(popup) {
  if (popup == null) return;
  popup.classList.add('active');
  overlaySelector.classList.add('active');
}

function closePopup(popup) {
  if (popup == null) return;
  popup.classList.remove('active');
  overlaySelector.classList.remove('active');
}

function updateStats() {
  const numberOfBooks = document.querySelector('.mainGrid').childElementCount - 1;
  numberOfBooksSelector.textContent = numberOfBooks;

  totalPagesInLibrary = [];
  totalPagesRead = [];

  for (
    let nthChild = 2, count = 1;
    count <= numberOfBooks;
    nthChild++, count++
  ) {
    const currentBookPages = document.querySelector(
      `.bookContainer:nth-child(${nthChild})>[class$='Data']>p:nth-child(3)`,
    );
    totalPagesInLibrary.push(currentBookPages.textContent.split(' ')[1]);

    const currentBookRead = document.querySelector(
      `.bookContainer:nth-child(${nthChild})>[class$='Data']>p:nth-child(4)`,
    );
    totalPagesRead.push(currentBookRead.textContent.split(' ')[1]);
  }
  const totalPagesInLibrarySum = totalPagesInLibrary.reduce(
    (a, b) => Number(a) + Number(b),
    0,
  );

  const totalPagesReadInLibrarySum = totalPagesRead.reduce(
    (a, b) => Number(a) + Number(b),
    0,
  );

  totalPagesReadInLibrarySelector.textContent = totalPagesInLibrarySum;
  totalPagesToGoInLibrarySelector.textContent = totalPagesInLibrarySum - totalPagesReadInLibrarySum;
}


addNewBookSelector.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = document.querySelector(button.dataset.popupTarget);
    openPopup(popup);
    formSelector.reset();
  });
});

closeSelector.forEach((button) => {
  button.addEventListener('click', () => {
    const parentPopup = button.closest('.popup');
    closePopup(parentPopup);
  });
});

overlaySelector.addEventListener('click', () => {
  const allActivePopups = document.querySelector('.popup.active');
  closePopup(allActivePopups);
});

cancelButtonSelector.addEventListener('click', () => {
  const parentPopup = cancelButtonSelector.closest('.popup');
  closePopup(parentPopup);
});

function Book(id, title, author, pages, pagesRead) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.pagesRead = pagesRead;
}

function validator() {
  if (
    titleValueSelector === ''
    || authorValueSelector === ''
    || pagesValueSelector === ''
    || progressValueSelector === ''
  ) {
    alert('Please complete the form');
    return false;
  }
  if (Number(pagesValueSelector) < Number(progressValueSelector)) {
    alert(
      "Number of pages you've read must be smaller than total number of pages",
    );
    return false;
  }
  return true;
}

createBookSelector.addEventListener('click', () => {
  titleValueSelector = document.querySelector('#title').value;
  authorValueSelector = document.querySelector('#author').value;
  pagesValueSelector = document.querySelector('#pages').value;
  progressValueSelector = document.querySelector('#pagesRead').value;
  formSelector = document.querySelector('#addBookForm');

  if (validator() === false) {
    /* empty */
  } else if (validator() === true) {
    const allActivePopups = document.querySelector('.popup.active');
    const nextNumber = myLibrary.length + 1;
    this[`Book${nextNumber}`] = new Book(
      nextNumber,
      titleValueSelector,
      authorValueSelector,
      pagesValueSelector,
      progressValueSelector,
    );

    myLibrary.push(this[`Book${nextNumber}`]);
    formSelector.reset();
    closePopup(allActivePopups);
    this[`Book${nextNumber}div`] = document.createElement('div');
    this[`Book${nextNumber}div`].classList.add('bookContainer');
    gridSelector.appendChild(this[`Book${nextNumber}div`]);

    //   Close & Edit Button
    const closeButton = document.createElement('img');
    closeButton.classList.add('delete');
    closeButton.setAttribute('src', 'delete.svg');
    this[`Book${nextNumber}div`].appendChild(closeButton);
    closeButton.addEventListener('click', () => {
      const closestBook = closeButton.closest('.bookContainer');
      closestBook.remove();
      updateStats();
    });

    const editButton = document.createElement('img');
    editButton.classList.add('editThisBook');
    editButton.setAttribute('src', 'edit.svg');
    editButton.setAttribute('data-popup-target', '#popupEdit');
    this[`Book${nextNumber}div`].appendChild(editButton);

    // Add Container With New Book
    this[`Book${nextNumber}div-Data`] = document.createElement('div');
    this[`Book${nextNumber}div-Data`].classList.add('bookData');
    this[`Book${nextNumber}div`].appendChild(this[`Book${nextNumber}div-Data`]);

    this[`Book${nextNumber}title`] = document.createElement('p');
    this[`Book${nextNumber}title`].textContent = ` ${
      this[`Book${nextNumber}`].title
    }`;
    this[`Book${nextNumber}title`].classList.add('titleData');
    this[`Book${nextNumber}div-Data`].appendChild(
      this[`Book${nextNumber}title`],
    );

    this[`Book${nextNumber}author`] = document.createElement('p');
    this[`Book${nextNumber}author`].textContent = `Author: ${
      this[`Book${nextNumber}`].author
    }`;
    this[`Book${nextNumber}author`].classList.add('authorData');
    this[`Book${nextNumber}div-Data`].appendChild(
      this[`Book${nextNumber}author`],
    );

    this[`Book${nextNumber}pages`] = document.createElement('p');
    this[`Book${nextNumber}pages`].textContent = `Pages: ${
      this[`Book${nextNumber}`].pages
    }`;
    this[`Book${nextNumber}pages`].classList.add('pagesData');
    this[`Book${nextNumber}div-Data`].appendChild(
      this[`Book${nextNumber}pages`],
    );

    this[`Book${nextNumber}pagesRead`] = document.createElement('p');
    this[`Book${nextNumber}pagesRead`].textContent = `Pages: ${
      this[`Book${nextNumber}`].pagesRead
    }`;
    this[`Book${nextNumber}pagesRead`].classList.add('pagesReadData');
    this[`Book${nextNumber}div-Data`].appendChild(
      this[`Book${nextNumber}pagesRead`],
    );

    updateStats();
    refreshEventListeners();
  }
});
