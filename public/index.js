const BYTES_IN_MB = 1048576

const form = document.getElementById('uploadForm')
const fileInput = document.getElementById('uploadForm_File')
const sizeText = document.getElementById('uploadForm_Size')
const statusText = document.getElementById('uploadForm_Status')
const progressBar = document.getElementById('progressBar')

fileInput.addEventListener('change', function () {
  const file = this.files[0]
  if (file.size > 5 * BYTES_IN_MB) {
    alert('Принимается файл до 5 МБ')
    this.value = null
  }
});

form.addEventListener('submit', function (event) {
  event.preventDefault()
  const fileToUpload = fileInput.files[0]
  const formSent = new FormData()
  const xhr = new XMLHttpRequest()

  if (fileInput.files.length > 0) {
    formSent.append('file', fileToUpload)

    // собираем запрос и подписываемся на событие progress
    xhr.upload.addEventListener('progress', progressHandler, false)
    xhr.addEventListener('load', loadHandler, false)
    // КУДА ОТПРАВЛИТЬ ФАЙЛ
    xhr.open('POST', 'http://localhost:3000/post')
    xhr.send(formSent)
  }
  else {
    alert('Сначала выберите файл')
  }
  setTimeout(() => {
    location.reload()
  }, 2000)
  return false
});

function progressHandler(event) {
  // считаем размер загруженного и процент от полного размера
  const loadedMb = (event.loaded / BYTES_IN_MB).toFixed(1)
  const totalSizeMb = (event.total / BYTES_IN_MB).toFixed(1)
  const percentLoaded = Math.round((event.loaded / event.total) * 100)

  progressBar.value = percentLoaded
  sizeText.textContent = `${loadedMb} из ${totalSizeMb} МБ`
  statusText.textContent = `Загружено ${percentLoaded}% | `


}

function loadHandler(event) {
  statusText.textContent = event.target.responseText
  progressBar.value = 0

}
