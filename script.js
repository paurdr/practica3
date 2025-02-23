const DEBOUNCE_DELAY = 300; //ms
let debounceTimer = null;

// Seleccionamos el input y el contenedor de resultados
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

//funcion para mostrar la portada del libro
function getCoverURL(coverId) {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

//funcion para devolver la informacion basica del libro
function createBookCard(book) {
  const card = document.createElement('div');
  card.classList.add('book-card');

  // Imagen de portada
  const img = document.createElement('img');
  if (book.cover_i) {
    img.src = getCoverURL(book.cover_i);
    img.alt = book.title;
  } else {
    // Imagen por defecto si no hay portada
    img.src = 'https://via.placeholder.com/200x300?text=Sin+Imagen';
    img.alt = 'Imagen no disponible';
  }
  card.appendChild(img);

  // Contenedor de información
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('book-info');

  // Título del libro
  const title = document.createElement('div');
  title.classList.add('book-title');
  title.textContent = book.title;
  infoDiv.appendChild(title);

  // Nombre(s) del autor
  const author = document.createElement('div');
  author.classList.add('book-author');
  if (book.author_name && book.author_name.length > 0) {
    author.textContent = book.author_name.join(', ');
  } else {
    author.textContent = 'Anónimo';
  }
  infoDiv.appendChild(author);

  card.appendChild(infoDiv);
  return card;
}

//funcion para buscar en la API proporcinada
async function searchBooks(query) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Error al obtener datos de la API');
    }
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error('Error en searchBooks:', error);
    return [];
  }
}

//limpiar resultados de busquedas anteriores
function renderResults(books) {
  resultsContainer.innerHTML = '';
  if (books.length === 0) {
    resultsContainer.textContent = 'No se encontraron resultados.';
    return;
  }

  // Limitar la cantidad de resultados mostrados (por ejemplo, 30)
  books.slice(0, 30).forEach(book => {
    const card = createBookCard(book);
    resultsContainer.appendChild(card);
  });
}

//eventos en el buscador
function handleInputEvent() {
  const query = searchInput.value.trim();

// Si el campo está vacío, se muestra la imagen predeterminada
    if (query === '') {
        showDefaultImage();
        return;
    }
 //la búsqueda introducida debe tener al menos 3 caracteres, sino se descarta
  if (query.length < 3) {
    resultsContainer.innerHTML = '';
    return;
  }

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const books = await searchBooks(query);
    renderResults(books);
  }, DEBOUNCE_DELAY);
}

searchInput.addEventListener('input', handleInputEvent);
document.addEventListener('DOMContentLoaded', showDefaultImage);

function showDefaultImage() {
    resultsContainer.innerHTML = '';
    const defaultImg = document.createElement('img');
    // Usamos el archivo local "pasando_hojas.gif"
    defaultImg.src = 'Pasando-hojas.gif';
    defaultImg.alt = 'Gif de un libro ojeando las hojas';
    defaultImg.style.display = 'block';
    defaultImg.style.margin = '0 auto';
    resultsContainer.appendChild(defaultImg);
  }