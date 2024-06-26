
import { db } from './firebase.js';
import {  displayAllMovies } from './main.js';
import { updateFavoriteStatus } from './movieFunctions.js';


// Function to update the watch status of a movie
export function updateWatchStatus(movieId, isWatched) {
    db.collection('movies').doc(movieId).update({
        watched: isWatched
    })
    .then(() => {
        console.log(`Movie marked as ${isWatched ? 'watched' : 'unwatched'}`);
        displayAllMovies(); // Refresh the displayed list after updating status
    })
    .catch((error) => {
        console.error('Error updating watch status: ', error);
    });
}

// Function to mark a movie as favorite or not favorite
export function toggleFavoriteStatus(movieId) {
    db.collection('movies').doc(movieId).get()
        .then((doc) => {
            if (doc.exists) {
                const isFavorite = doc.data().favorite || false;
                updateFavoriteStatus(movieId, !isFavorite);
            } else {
                console.error('Movie not found');
            }
        })
        .catch((error) => {
            console.error('Error getting movie: ', error);
        });
}

// Function to create a button with a click event listener
export function createButton(text, onClick, id) {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id; // Set the button id
    button.addEventListener('click', onClick);
    return button;
}

// Function to update the button class based on its functionality
export function updateButtonClass(button, isActive) {
    button.classList.toggle('watched', isActive);
    button.classList.toggle('unwatched', !isActive);
    button.classList.toggle('favorite', isActive);
}


