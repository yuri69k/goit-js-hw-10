import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { listCountriesMarkup, infoCountryMarkup } from './markup.Countries';
import { refs } from './refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require(`lodash.debounce`);

const DEBOUNCE_DELAY = 300;
const MAX_CONTRIES = 10;
refs.countryInput.addEventListener(
  `input`,
  debounce(onFetchCountries, DEBOUNCE_DELAY)
);

function onFetchCountries(evt) {
  const nameCountry = evt.target.value.trim();

  clearCountries();

  if (nameCountry === ``) {
    return;
  }

  fetchCountries(nameCountry)
    .then(countries => {
      if (countries.length > MAX_CONTRIES) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        return infoCountryMarkup(countries);
      }

      return listCountriesMarkup(countries);
    })
    .catch(error => {
      if (error.message === '404') {
        clearCountries();
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function clearCountries() {
  refs.countryList.innerHTML = ``;
  refs.countryInfo.innerHTML = ``;
}
