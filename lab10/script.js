const state = {
    currentUser: null,
    friends: [],
    filteredFriends: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    currentPage: 1,
    itemsPerPage: 30,
    isLoading: false,
    error: null,
    searchTerm: '',
    filters: {
        gender: 'all',
        age: 'all'
    },
    sortBy: 'name-asc',
    loadedPages: 0
};

const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('signupForm');
const currentUserElement = document.getElementById('current-user');
const logoutBtn = document.getElementById('logout-btn');
const friendsContainer = document.getElementById('friends-container');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const genderFilter = document.getElementById('gender-filter');
const ageFilter = document.getElementById('age-filter');
const sortBy = document.getElementById('sort-by');
const pagination = document.getElementById('pagination');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,15}$/;

const userInfoModal = document.createElement('div');
userInfoModal.className = 'user-info-modal hidden';
document.body.appendChild(userInfoModal);

function init() {
    checkAuth();
    setupEventListeners();
    updateURL();
}

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        state.currentUser = JSON.parse(user);
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');

    currentUserElement.innerHTML = `
        <span>My profile</span>
        <i class="fas fa-user"></i>
    `;

    fetchFriends();
}

function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    searchInput.addEventListener('input', debounce(handleSearch, 300));
    clearSearch.addEventListener('click', clearSearchHandler);
    genderFilter.addEventListener('change', handleFilterChange);
    ageFilter.addEventListener('change', handleFilterChange);
    sortBy.addEventListener('change', handleSortChange);

    currentUserElement.addEventListener('click', showUserInfo);


    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-btn')) {
            handlePageChange(parseInt(e.target.dataset.page));
        }

        if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
            const btn = e.target.classList.contains('favorite-btn') ? e.target : e.target.closest('.favorite-btn');
            const id = btn.dataset.id;
            toggleFavorite(id);
        }
    });

    document.querySelector('.favorites-btn').addEventListener('click', function() {
        if (this.classList.contains('active')) {
            showAllFriends();
        } else {
            showFavorites();
        }
    });

    window.addEventListener('scroll', handleScroll);

    window.addEventListener('popstate', handlePopState);
}

function switchTab(e) {
    const tab = e.target.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    document.querySelectorAll('.auth-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        document.getElementById('login-error').textContent = 'Please fill in all fields';
        return;
    }

    state.currentUser = {
        name: email.split('@')[0],
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    showApp();
}

function togglePassword(id) {
    const input = document.getElementById(id);
    const icon = input.parentElement.querySelector('.toggle-password');

    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈";
    } else {
        input.type = "password";
        icon.textContent = "👁️";
    }
}

function populateCities() {
    const country = document.getElementById('country').value;
    const city = document.getElementById('city');
    city.innerHTML = '';
    city.disabled = !country;
    if (country === 'Ukraine') {
        ['Kyiv', 'Lviv', 'Odessa'].forEach(c => city.innerHTML += `<option value="${c}">${c}</option>`);
    } else if (country === 'Poland') {
        ['Warsaw', 'Krakow', 'Gdansk'].forEach(c => city.innerHTML += `<option value="${c}">${c}</option>`);
    }
}

function handleRegister(e) {
    e.preventDefault();
    let valid = true;

    function validate(id, condition, msg = null) {
        const input = document.getElementById(id);
        const error = document.getElementById(id + 'Error');
        if (!condition) {
            input.classList.add('invalid');
            input.classList.remove('valid');
            error.style.display = 'block';
            if (msg) error.innerText = msg;
            valid = false;
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
            error.style.display = 'none';
        }
    }

    const today = new Date();
    const dob = new Date(document.getElementById('dob').value);
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    const isFutureDate = dob > today;
    const isTooYoung = age < 12 || (age === 12 && m < 0);


    validate('firstName', firstName.value.length >= 3 && firstName.value.length <= 15);
    validate('lastName', lastName.value.length >= 3 && lastName.value.length <= 15);
    validate('email', emailRegex.test(email.value));
    validate('phone', phoneRegex.test(phone.value));
    validate('dob', !isFutureDate && !isTooYoung);
    validate('password', password.value.length >= 6);
    validate('confirmPassword', confirmPassword.value === password.value && confirmPassword.value.length >= 6);
    validate('country', country.value !== '');
    validate('city', city.value !== '');
    const sexSelected = document.querySelector('input[name="sex"]:checked');
    const sexError = document.getElementById('sexError');
    if (!sexSelected) {
        sexError.style.display = 'block';
        valid = false;
    } else {
        sexError.style.display = 'none';
    }

    if(valid) {
        state.currentUser = {
            name: `${firstName.value} ${lastName.value}`,
            email: email.value,
        };

        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        registerForm.reset();
        showApp();
    }

}

function handleLogout() {
    localStorage.removeItem('currentUser');
    state.currentUser = null;
    showAuth();
}

function showUserInfo() {
    friendsContainer.classList.add('hidden');
    pagination.classList.add('hidden');

    userInfoModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>User Profile</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="user-details">
                    <p><strong>Name:</strong> ${state.currentUser.name}</p>
                    <p><strong>Email:</strong> ${state.currentUser.email}</p>
                </div>
            </div>
        </div>
    `;

    userInfoModal.classList.remove('hidden');

    document.querySelector('.close-modal').addEventListener('click', hideUserInfo);
}

function hideUserInfo() {
    userInfoModal.classList.add('hidden');
    friendsContainer.classList.remove('hidden');
    pagination.classList.remove('hidden');
}

async function fetchFriends() {
    try {
        if (state.isLoading) return;

        state.isLoading = true;
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        const response = await fetch(
            `https://randomuser.me/api/?page=${state.currentPage}&results=${state.itemsPerPage}&seed=friendconnect`
        );

        if (!response.ok) throw new Error('Failed to fetch friends');

        const data = await response.json();

        const newFriends = data.results.map(user => ({
            id: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            firstName: user.name.first,
            lastName: user.name.last,
            age: user.dob.age,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            picture: user.picture.large,
            location: `${user.location.city}, ${user.location.country}`,
            registered: new Date(user.registered.date)
        }));

        state.friends = [...state.friends, ...newFriends];
        state.loadedPages = state.currentPage;

        applyFiltersAndSort();
        renderFriends();
        renderPagination();

    } catch (err) {
        state.error = err.message;
        errorMessage.textContent = `Error: ${err.message}`;
        errorMessage.classList.remove('hidden');
        state.currentPage--;
    } finally {
        state.isLoading = false;
        loadingIndicator.classList.add('hidden');
    }
}

function showForm(form) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('form').forEach(f => f.classList.add('hidden'));
    document.querySelector(`.tab[onclick*='${form}']`).classList.add('active');
    document.getElementById(`${form}Form`).classList.remove('hidden');
}

function applyFiltersAndSort() {
    let filtered = [...state.friends];

    if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filtered = filtered.filter(friend =>
            friend.name.toLowerCase().includes(term)
        );
    }

    if (state.filters.gender !== 'all') {
        filtered = filtered.filter(friend => friend.gender === state.filters.gender);
    }

    if (state.filters.age !== 'all') {
        const [min, max] = state.filters.age.split('-').map(Number);
        if (max) {
            filtered = filtered.filter(friend => friend.age >= min && friend.age <= max);
        } else {
            filtered = filtered.filter(friend => friend.age >= min);
        }
    }

    const [sortKey, sortDirection] = state.sortBy.split('-');

    filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortKey) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'age':
                comparison = a.age - b.age;
                break;
            case 'registered':
                comparison = a.registered - b.registered;
                break;
        }

        return sortDirection === 'desc' ? -comparison : comparison;
    });

    state.filteredFriends = filtered;
}

function renderFriends() {
    if (state.filteredFriends.length === 0) {
        friendsContainer.innerHTML = '<div class="no-results">No friends found matching your criteria</div>';
        pagination.classList.add('hidden');
        return;
    }

    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const paginatedFriends = state.filteredFriends.slice(start, end);

    friendsContainer.innerHTML = paginatedFriends.map(friend => `
        <div class="friend-card">
            <div class="card-header">
                <img src="${friend.picture}" alt="${friend.name}">
                <span class="card-badge">${friend.gender === 'male' ? 'male' : 'female'} ${friend.age}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${friend.name}</h3>
                <p class="card-text"><i class="fas fa-envelope"></i> ${friend.email}</p>
                <p class="card-text"><i class="fas fa-phone"></i> ${friend.phone}</p>
                <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${friend.location}</p>
            </div>
            <div class="card-footer">
                <button class="favorite-btn ${state.favorites.includes(friend.id) ? 'active' : ''}" data-id="${friend.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');

    pagination.classList.remove('hidden');
}

function renderPagination() {
    const totalPages = state.loadedPages + 1;

    if (totalPages <= 1) {
        pagination.classList.add('hidden');
        return;
    }

    let paginationHTML = '';

    paginationHTML += `
        <button class="page-btn ${state.currentPage === 1 ? 'disabled' : ''}" 
                ${state.currentPage === 1 ? 'disabled' : ''}
                data-page="${state.currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="page-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    paginationHTML += `
        <button class="page-btn ${state.currentPage === totalPages ? 'disabled' : ''}" 
                ${state.currentPage === totalPages ? 'disabled' : ''}
                data-page="${state.currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}


function handleSearch() {
    state.searchTerm = searchInput.value.trim();
    applyFiltersAndSort();
    renderFriends();
    renderPagination();
    updateURL();
}

function clearSearchHandler() {
    searchInput.value = '';
    state.searchTerm = '';
    applyFiltersAndSort();
    renderFriends();
    renderPagination();
    updateURL();
}

function handleFilterChange() {
    state.filters = {
        gender: genderFilter.value,
        age: ageFilter.value
    };
    applyFiltersAndSort();
    renderFriends();
    renderPagination();
    updateURL();
}

function handleSortChange() {
    state.sortBy = sortBy.value;
    applyFiltersAndSort();
    renderFriends();
    updateURL();
}

function handlePageChange(page) {
    if (page < 1) return;

    state.currentPage = page;

    if (page > state.loadedPages) {
        fetchFriends();
    } else {
        applyFiltersAndSort();
        renderFriends();
        renderPagination();

        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === state.currentPage);
        });
    }

    updateURL();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function showFavorites() {

    document.querySelector('.favorites-btn').classList.add('active');
    if (state.favorites.length === 0) {
        friendsContainer.innerHTML = '<div class="no-results">You have no favorites yet</div>';
        pagination.classList.add('hidden');
        return;
    }

    const favoriteFriends = state.friends.filter(friend =>
        state.favorites.includes(friend.id)
    );

    if (favoriteFriends.length === 0) {
        friendsContainer.innerHTML = '<div class="no-results">Your favorites will appear here</div>';
        pagination.classList.add('hidden');
        return;
    }

    friendsContainer.innerHTML = favoriteFriends.map(friend => `
        <div class="friend-card">
            <div class="card-header">
                <img src="${friend.picture}" alt="${friend.name}">
                <span class="card-badge">${friend.gender === 'male' ? '♂' : '♀'} ${friend.age}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${friend.name}</h3>
                <p class="card-text"><i class="fas fa-envelope"></i> ${friend.email}</p>
                <p class="card-text"><i class="fas fa-phone"></i> ${friend.phone}</p>
                <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${friend.location}</p>
            </div>
            <div class="card-footer">
                <button class="favorite-btn active" data-id="${friend.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="view-profile">View Profile</button>
            </div>
        </div>
    `).join('');

    pagination.classList.add('hidden');
}

function showAllFriends() {
    document.querySelector('.favorites-btn').classList.remove('active');
    applyFiltersAndSort();
    renderFriends();
    renderPagination();
}


function toggleFavorite(id) {
    const index = state.favorites.indexOf(id);
    if (index === -1) {
        state.favorites.push(id);
    } else {
        state.favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(state.favorites));

    if (document.querySelector('.favorites-btn').classList.contains('active')) {
        showFavorites();
    } else {
        renderFriends();
    }
}

function handleScroll() {
    if (state.isLoading ||
        document.querySelector('.favorites-btn').classList.contains('active')) {
        return;
    }

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollThreshold = 100;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;

    if (nearBottom && !state.isLoading) {
        const totalPages = Math.ceil(state.filteredFriends.length / state.itemsPerPage);

        if (state.currentPage < totalPages) {
            handlePageChange(state.currentPage + 1);
        } else if (state.currentPage === state.loadedPages) {
            handlePageChange(state.currentPage + 1);
        }
    }
}


function updateURL() {
    const params = new URLSearchParams();

    if (state.searchTerm) params.set('search', state.searchTerm);
    if (state.filters.gender !== 'all') params.set('gender', state.filters.gender);
    if (state.filters.age !== 'all') params.set('age', state.filters.age);
    if (state.sortBy !== 'name-asc') params.set('sort', state.sortBy);
    if (state.currentPage > 1) params.set('page', state.currentPage);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState(null, '', newUrl);
}


function handlePopState() {
    const params = new URLSearchParams(window.location.search);

    state.searchTerm = params.get('search') || '';
    state.filters.gender = params.get('gender') || 'all';
    state.filters.age = params.get('age') || 'all';
    state.sortBy = params.get('sort') || 'name-asc';
    state.currentPage = parseInt(params.get('page')) || 1;

    searchInput.value = state.searchTerm;
    genderFilter.value = state.filters.gender;
    ageFilter.value = state.filters.age;
    sortBy.value = state.sortBy;

    applyFiltersAndSort();
    renderFriends();
    renderPagination();
}


function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', init);