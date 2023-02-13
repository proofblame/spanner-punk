/* eslint-disable no-undef */
const BYTES_IN_MB = 1048576;

const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("uploadForm_File");
const sizeText = document.getElementById("uploadForm_Size");
const statusText = document.getElementById("uploadForm_Status");
const progressBar = document.getElementById("progressBar");
const selectedLabel = document.getElementById("uploadForm_Select");

if (!statusText) {
  throw new Error("Кнопка не найдена");
}

function loadHandler(event) {
  statusText.textContent = event.target.responseText;
  progressBar.value = 0;
}

if (!fileInput) {
  throw new Error("Кнопка не найдена");
}

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file.size > 5 * BYTES_IN_MB) {
    alert("Принимается файл до 5 МБ");
    this.value = null;
  }
});

if (!form) {
  throw new Error("Форма не найдена");
}

function progressHandler(event) {
  // считаем размер загруженного и процент от полного размера
  const loadedMb = (event.loaded / BYTES_IN_MB).toFixed(1);
  const totalSizeMb = (event.total / BYTES_IN_MB).toFixed(1);
  const percentLoaded = Math.round((event.loaded / event.total) * 100);

  progressBar.value = percentLoaded;
  sizeText.textContent = `${loadedMb} из ${totalSizeMb} МБ`;
  statusText.textContent = `Загружено ${percentLoaded}% | `;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const fileToUpload = fileInput.files[0];
  const formSent = new FormData();
  const xhr = new XMLHttpRequest();

  if (fileInput.files.length > 0) {
    formSent.append("file", fileToUpload);
    formSent.append("type", selectedLabel.value);

    // собираем запрос и подписываемся на событие progress
    xhr.upload.addEventListener("progress", progressHandler, false);
    xhr.addEventListener("load", loadHandler, false);
    // КУДА ОТПРАВЛИТЬ ФАЙЛ
    xhr.open("POST", "/api/v1/backend/convert-excel");
    xhr.send(formSent);
  } else {
    alert("Сначала выберите файл");
  }
  // setTimeout(() => {
  //   location.reload()
  // }, 2000)
  return false;
});
