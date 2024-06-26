import { db } from './firebase.js';
import { toggleFavoriteStatus , createButton , updateButtonClass } from  './uiFunctions.js';
import { updateWatchStatus } from './uiFunctions.js';


// Function to add a movie to the favorites
function addMovie() {
    const nameInput = document.getElementById('name');
    const genreSelect = document.getElementById('genre');
    const releaseDateInput = document.getElementById('releaseDate');
  
    const name = nameInput.value;
    const genre = genreSelect.value;
    const releaseDate = releaseDateInput.value;
  
    // Check if a movie with the same title already exists
    db.collection('movies')
      .where('name', '==', name)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Movie with the same title does not exist, proceed to add
          // Add the movie to the "movies" collection
          return db.collection('movies').add({
            name: name,
            genre: genre,
            releaseDate: releaseDate
          });
        } else {
          // Movie with the same title already exists, display an alert
          alert('Movie with the same title already exists!');
          return Promise.reject('Movie with the same title already exists!');
        }
      })
      .then(() => {
        console.log('Movie added to all movies list');
        displayAllMovies();
  
        // Reset input fields after successfully adding a movie
        nameInput.value = '';
        genreSelect.value = '';
        releaseDateInput.value = '';
      })
      .catch((error) => {
        console.error('Error adding movie: ', error);
      });
  }

// Function to display favorite movies
function displayAllMovies() {
    const favoritesList = document.getElementById('favoritesList');
  
    // Clear previous list
    favoritesList.innerHTML = '';
  
    // Fetch movies from Firestore and display them
    db.collection('movies').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const movieData = doc.data();
  
        // Create a list item
        const listItem = document.createElement('li');
  
        // Display movie details
        listItem.innerHTML = `${movieData.name} - ${movieData.genre} - ${movieData.releaseDate}`;
  
        // Create buttons for marking as watched, unwatched, and favorite
        const watchedButton = createButton('Watched', () => markAsWatched(doc.id));
        const unwatchedButton = createButton('Unwatched', () => markAsUnwatched(doc.id));
        const favoriteButton = createButton('Favorite', () => markAsFavorite(doc.id), `favoriteButton_${doc.id}`);
  
        // Append the buttons to the list item
        listItem.appendChild(watchedButton);
        listItem.appendChild(unwatchedButton);
        listItem.appendChild(favoriteButton);
        
  
        // Create a delete button
        const deleteButton = createButton('Delete', () => deleteMovie(doc.id));
  
        // Append the delete button to the list item
        listItem.appendChild(deleteButton);
  
        // Add initial styles based on movie data
        updateButtonClass(watchedButton, movieData.watched, movieData.favorite);
        updateButtonClass(unwatchedButton, !movieData.watched, movieData.favorite);
        updateButtonClass(favoriteButton, movieData.favorite);
        
        // Append the list item to the favorites list
        favoritesList.appendChild(listItem);
      });
    });
}

// Generic function to display movies based on criteria
function displayMoviesByCriteria(title, criteria) {
    const favoritesList = document.getElementById('favoritesList');

    // Clear previous list
    favoritesList.innerHTML = '';

    // Fetch movies from Firestore based on criteria
    let query = db.collection('movies');
    if (criteria) {
        query = query.where(Object.keys(criteria)[0], '==', Object.values(criteria)[0]);
    }

    query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const movieData = doc.data();

            // Create a list item
            const listItem = document.createElement('li');

            // Display movie details
            listItem.innerHTML = `${movieData.name} - ${movieData.genre} - ${movieData.releaseDate}`;

            // Create buttons for marking as watched, unwatched, and favorite
            const watchedButton = createButton('Watched', () => markAsWatched(doc.id));
            const unwatchedButton = createButton('Unwatched', () => markAsUnwatched(doc.id));
            const favoriteButton = createButton('Favorite', () => markAsFavorite(doc.id), `favoriteButton_${doc.id}`);

            // Append the buttons to the list item
            listItem.appendChild(watchedButton);
            listItem.appendChild(unwatchedButton);
            listItem.appendChild(favoriteButton);

            // Create a delete button
            const deleteButton = createButton('Delete', () => deleteMovie(doc.id));

            // Append the delete button to the list item
            listItem.appendChild(deleteButton);

            // Append the list item to the favorites list
            favoritesList.appendChild(listItem);
        });

        // Display the title for the current category
        console.log(title);
    });
}

// Function to display watched movies
function displayWatchedMovies() {
    displayMoviesByCriteria('Watched Movies', { watched: true });
}

// Function to display unwatched movies
function displayUnwatchedMovies() {
    displayMoviesByCriteria('Unwatched Movies', { watched: false });
}

// Function to update the favorite status of a movie
function updateFavoriteStatus(movieId, isFavorite) {
    const favoriteButton = document.getElementById(`favoriteButton_${movieId}`);
    
    // Check if favoriteButton exists before updating
    if (favoriteButton) {
      // Toggle the 'favorite' class for the favorite button
      updateButtonClass(favoriteButton, isFavorite);
  
      // Update the favorite status in the database
      db.collection('movies').doc(movieId).update({
        favorite: isFavorite
      })
      .then(() => {
        console.log(`Movie marked as ${isFavorite ? 'favorite' : 'not favorite'}`);
        displayAllMovies(); // Refresh the displayed list after updating status
      })
      .catch((error) => {
        console.error('Error updating favorite status: ', error);
      });
    }
}

// Function to delete a movie by document ID
function deleteMovie(movieId) {
    db.collection('movies').doc(movieId).delete()
        .then(() => {
            console.log('Movie deleted successfully');
            displayAllMovies(); // Refresh the displayed list after deletion
        })
        .catch((error) => {
            console.error('Error deleting movie: ', error);
        });
}

 // Function to display favorite movies
 function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
  
    // Clear previous list
    favoritesList.innerHTML = '';
  
    // Fetch only favorite movies from Firestore
    db.collection('movies')
        .where('favorite', '==', true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const movieData = doc.data();
  
                // Create a list item
                const listItem = document.createElement('li');
  
                // Display movie details
                listItem.innerHTML = `${movieData.name} - ${movieData.genre} - ${movieData.releaseDate}`;
  
                // Create buttons for marking as watched, unwatched, and favorite
                const watchedButton = createButton('Watched', () => markAsWatched(doc.id));
                const unwatchedButton = createButton('Unwatched', () => markAsUnwatched(doc.id));
                const favoriteButton = createButton('Favorite', () => toggleFavoriteStatus(doc.id), `favoriteButton_${doc.id}`);
  
                // Append the buttons to the list item
                listItem.appendChild(watchedButton);
                listItem.appendChild(unwatchedButton);
                listItem.appendChild(favoriteButton);
  
                // Create a delete button
                const deleteButton = createButton('Delete', () => deleteMovie(doc.id));
  
                // Append the delete button to the list item
                listItem.appendChild(deleteButton);
  
                // Append the list item to the favorites list
                favoritesList.appendChild(listItem);
  
            });
  
            // Display the title for the current category
            console.log('Favorites');
        })
        .catch((error) => {
            console.error('Error fetching favorites: ', error);
        });
}
// Function to mark a movie as favorite
function markAsFavorite(movieId) {
    toggleFavoriteStatus(movieId);
}

// Function to mark a movie as not favorite
function markAsNotFavorite(movieId) {
    toggleFavoriteStatus(movieId);
}

// Function to mark a movie as watched
function markAsWatched(movieId) {
    updateWatchStatus(movieId, true);
}

// Function to mark a movie as unwatched
function markAsUnwatched(movieId) {
    updateWatchStatus(movieId, false);
}


// Function to search for movies
function searchMovies() {
    const searchInput = document.getElementById('searchInput');
  
    // Remove leading and trailing whitespaces from the search term
    const searchTerm = searchInput.value.trim().toLowerCase();
  
    // Clear previous list
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
  
    // Fetch movies from Firestore and display only exact matches
    db.collection('movies').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const movieData = doc.data();
        const movieName = movieData.name.toLowerCase();
  
        // Check if the movie name is an exact match with the search term
        if (movieName === searchTerm) {
          // Create a list item
          const listItem = document.createElement('li');
  
          // Display movie details
          listItem.innerHTML = `${movieData.name} - ${movieData.genre} - ${movieData.releaseDate}`;
  
          // Create buttons for marking as watched, unwatched, and favorite
          const watchedButton = createButton('Watched', () => markAsWatched(doc.id));
          const unwatchedButton = createButton('Unwatched', () => markAsUnwatched(doc.id));
          const favoriteButton = createButton('Favorite', () => markAsFavorite(doc.id));
    
          // Append the buttons to the list item
          listItem.appendChild(watchedButton);
          listItem.appendChild(unwatchedButton);
          listItem.appendChild(favoriteButton);
  
          // Create a delete button
          const deleteButton = createButton('Delete', () => deleteMovie(doc.id));
  
          // Append the delete button to the list item
          listItem.appendChild(deleteButton);
  
          // Append the list item to the favorites list
          favoritesList.appendChild(listItem);
        }
      });
    });
  }


  export { addMovie,displayAllMovies,updateFavoriteStatus, deleteMovie , 
          displayWatchedMovies ,displayUnwatchedMovies,displayFavorites,
          searchMovies }