import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-input'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let currentPage = 1;
let currentQuery = '';

const lightbox = new SimpleLightbox('.gallery a', {});

async function fetchImages(query, page) {
  try {
    const apiKey = '39775537-79ed589ac33c4e83a26f05279';
    const perPage = 40;
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function updateGallery(images) {
  const gallery = selectors.galleryEl;
  const cards = images.hits.map(image => createImageCard(image));
  gallery.innerHTML = '';
  gallery.insertAdjacentHTML('beforeend', cards.join(''));

  if (images.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  }

  lightbox.refresh();
}

//----- РЕНДЕР----------------------

function createImageCard(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  return `
    <div class="photo-card">
      <a href="${largeImageURL}" target="_blank">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>`;
}

// ---------- НОВА СТОРІНКА КАРТИНОК---------------

async function loadMoreImages() {
  currentPage += 1;
  const data = await fetchImages(currentQuery, currentPage);
  if (data.hits.length === 0) {
    selectors.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    updateGallery(data);
    smoothScrollToGallery();
  }
}

//---------- ПЛАВНИЙ СКРОЛ---------------

function smoothScrollToGallery() {
  const gallery = selectors.galleryEl;
  if (gallery) {
    const cardHeight = gallery.firstElementChild
      ? gallery.firstElementChild.clientHeight
      : 0;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

selectors.formEl.addEventListener('submit', async event => {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.target.searchQuery.value;
  selectors.loadMoreBtn.style.display = 'none';
  const data = await fetchImages(currentQuery, currentPage);
  updateGallery(data);
  if (data.hits.length > 0) {
    selectors.loadMoreBtn.style.display = 'block';
  }
});

selectors.loadMoreBtn.addEventListener('click', loadMoreImages);
