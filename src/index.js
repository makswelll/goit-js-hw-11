import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { pixabayUrl } from './js/pixabay.js';
import { photosFetch } from './js/axios.js';

const selectors = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-input'),
};
