import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
    event.preventDefault();
    clearMarkup();
    if (searchBox.value.trim() === '') {
        return;
    }

    fetchCountries(event.target.value.trim())
        .then (outputConditions)
        .catch (error => Notify.failure('Oops, there is no country with that name'));
}

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function outputConditions(countries) {
        if (countries.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (countries.length === 1) {
            countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
            countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
        } else {
            countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
        }
}

function renderCountryList(countries) {
    const markup = countries
    .map(({ name, flags }) => {
        return `<li class="country-list__item">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}">
                <h2 class="country-list__name">${name.official}</h2>
                </li>`;
    })
    .join('');
    return markup;
}

function renderCountryInfo(countries) {
    const markup = countries
    .map(({ capital, population, languages }) => {
        return `<ul class="country-info__list">
                <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
                <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
                <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages)}</p></li>
                </ul>`;
    })
    .join('');
    return markup;
}