document.addEventListener('DOMContentLoaded', function() {
    const releaseDateInput = document.getElementById('releaseDate');
    const calendarPopup = document.getElementById('calendarPopup');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarBody = document.getElementById('calendarBody');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const genreSelect = document.getElementById('genre');
    const favoritesList = document.getElementById('favoritesList');
    const showFavoritesButton = document.getElementById('showFavoritesButton');
    const showWatchedButton = document.getElementById('showWatchedButton');
    const showUnwatchedButton = document.getElementById('showUnwatchedButton');
    const showAllMoviesButton = document.getElementById('showAllMovies');
    const addMovieButton = document.getElementById('addMovieButton');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function populateMonthAndYear() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach((month, index) => {
            const option = document.createElement('span');
            option.textContent = month;
            option.addEventListener('click', function() {
                currentMonth = index;
                renderCalendar(currentMonth, currentYear);
                monthSelect.classList.remove('active');
            });
            monthSelect.appendChild(option);
        });

        for (let year = 1900; year <= 2100; year++) {
            const option = document.createElement('span');
            option.textContent = year;
            option.addEventListener('click', function() {
                currentYear = year;
                renderCalendar(currentMonth, currentYear);
                yearSelect.classList.remove('active');
            });
            yearSelect.appendChild(option);
        }
    }

    releaseDateInput.addEventListener('click', function() {
        calendarPopup.style.display = 'block';
        positionCalendarPopup();
    });

    function positionCalendarPopup() {
        const inputRect = releaseDateInput.getBoundingClientRect();
        calendarPopup.style.top = inputRect.bottom + 'px';
        calendarPopup.style.left = inputRect.left + 'px';
    }

    document.addEventListener('click', function(event) {
        if (!calendarPopup.contains(event.target) && event.target !== releaseDateInput) {
            calendarPopup.style.display = 'none';
            monthSelect.classList.remove('active');
            yearSelect.classList.remove('active');
        }
    });

    function renderCalendar(month, year) {
        calendarBody.innerHTML = '';
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = months[month] + ' ' + year;
        monthSelect.value = month;
        yearSelect.value = year;

        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            calendarBody.appendChild(dayElement);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            dayElement.addEventListener('click', function() {
                releaseDateInput.value = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                calendarPopup.style.display = 'none';
            });
            calendarBody.appendChild(dayElement);
        }
    }

    renderCalendar(currentMonth, currentYear);

    document.getElementById('prevMonth').addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    monthSelect.addEventListener('click', function() {
        monthSelect.classList.add('active');
    });

    yearSelect.addEventListener('click', function() {
        yearSelect.classList.add('active');
    });

    function addMovie() {
        const name = document.getElementById('name').value;
        const genre = genreSelect.value;
        const releaseDate = releaseDateInput.value;

        const movie = {
            name,
            genre,
            releaseDate,
            watched: false,
            favorite: false
        };

        favoritesList.innerHTML += `
            <li>
                <span class="movie-title">${movie.name}</span>
                <span class="movie-date">${movie.releaseDate}</span> 
                <span class="watched-status">
                    <span class="watched-text">Unwatched</span>
                    <i class="fa fa-eye-slash"></i>
                </span>
                <button class="delete-button" style="display: none;">Delete</button>
            </li>
        `;

        document.getElementById('movieForm').reset();
    }

    addMovieButton.addEventListener('click', addMovie);

    function filterMovies(filter) {
        const movies = favoritesList.getElementsByTagName('li');
        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
            const watched = movie.querySelector('.watched-status .watched-text').textContent === 'Watched';
            const isFavorite = movie.classList.contains('favorite');

            switch (filter) {
                case 'favorites':
                    movie.style.display = isFavorite ? 'list-item' : 'none';
                    break;
                case 'watched':
                    movie.style.display = watched ? 'list-item' : 'none';
                    break;
                case 'unwatched':
                    movie.style.display = !watched ? 'list-item' : 'none';
                    break;
                default:
                    movie.style.display = 'list-item';
                    break;
            }
        }
    }

    showFavoritesButton.addEventListener('click', function() {
        filterMovies('favorites');
    });

    showWatchedButton.addEventListener('click', function() {
        filterMovies('watched');
    });

    showUnwatchedButton.addEventListener('click', function() {
        filterMovies('unwatched');
    });

    showAllMoviesButton.addEventListener('click', function() {
        filterMovies('all');
    });

    favoritesList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const movieItem = event.target.closest('li');
            console.log(movieItem); // Check if movieItem is correctly identified
            favoritesList.removeChild(movieItem);
        }
    
        if (event.target.classList.contains('fa-eye') || event.target.classList.contains('fa-eye-slash')) {
            const movieItem = event.target.closest('li');
            const watchedText = movieItem.querySelector('.watched-text');
            const icon = event.target;
    
            if (watchedText.textContent === 'Watched') {
                watchedText.textContent = 'Unwatched';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                watchedText.textContent = 'Watched';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    
        // Toggle delete button visibility based on clicking the movie item
        if (event.target.closest('li')) {
            const movieItem = event.target.closest('li');
            const deleteButton = movieItem.querySelector('.delete-button');
            if (deleteButton) {
                deleteButton.style.display = deleteButton.style.display === 'block' ? 'none' : 'block';
            }
        }
    });    
});
