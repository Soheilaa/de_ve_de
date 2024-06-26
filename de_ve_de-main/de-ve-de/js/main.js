import { db } from './firebase.js';
import { addMovie , displayAllMovies  } from './movieFunctions.js';
import { searchMovies , displayFavorites  } from './movieFunctions.js';
import { createButton , updateButtonClass } from './uiFunctions.js';
import { displayWatchedMovies , displayUnwatchedMovies } from './movieFunctions.js';

document.getElementById('addMovieButton').addEventListener('click', addMovie);
document.getElementById('showAllMovies').addEventListener('click', displayAllMovies);
document.getElementById('showFavoritesButton').addEventListener('click', displayFavorites);
document.getElementById('showWatchedButton').addEventListener('click', displayWatchedMovies);
document.getElementById('showUnwatchedButton').addEventListener('click', displayUnwatchedMovies);
document.getElementById('searchBtn').addEventListener('click', searchMovies);


export {createButton,updateButtonClass,displayAllMovies } 