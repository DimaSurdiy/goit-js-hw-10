import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import countriesTpl from './templates/countries.hbs';
import countryCardTpl from './templates/countryCard.hbs';
var debounce = require('lodash.debounce');

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, 300));

function onSearch(e) {
  const searchQuery = e.target.value.trim();

  if (searchQuery === '') {
    clearCountryList();
    clearCountryInfo();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
        clearCountryInfo();
      }

      if (data.length === 1) {
        renderCountryInfo(data);
        clearCountryList();
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearCountryInfo();
      clearCountryList();
    });
}

function renderCountryList(countries) {
  refs.countryList.innerHTML = countriesTpl(countries);
}

function renderCountryInfo(country) {
  refs.countryInfo.innerHTML = countryCardTpl(country);
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
