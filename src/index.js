import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import countriesTpl from './templates/countries.hbs';
import countryCardTpl from './templates/countryCard.hbs';
var debounce = require('lodash.debounce');

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const countryName = event.target.value.trim();

  if (countryName === '') {
    clearCountryList();
    clearCountryInfoContainer();
    return;
  }

  fetchCountries(countryName).then(data => {
    const numberOfCountries = data.length;

    if (numberOfCountries > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      clearCountryList();
      clearCountryInfoContainer();
    }

    if (numberOfCountries >= 2 && numberOfCountries <= 10) {
      clearCountryInfoContainer();
      renderCountryList(data);
    }

    if (numberOfCountries === 1) {
      clearCountryList();
      renderCountryInfoContainer(data);
    }
  });
}

function renderCountryList(countries) {
  clearCountryList();
  refs.countryList.innerHTML = countriesTpl(countries);
}

function renderCountryInfoContainer(countries) {
  clearCountryInfoContainer();
  refs.countryInfoContainer.innerHTML = countryCardTpl(countries);
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfoContainer() {
  refs.countryInfoContainer.innerHTML = '';
}
