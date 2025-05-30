function showForm(form) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('form').forEach(f => f.classList.add('hidden'));
    document.querySelector(`.tab[onclick*='${form}']`).classList.add('active');
    document.getElementById(`${form}Form`).classList.remove('hidden');
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

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^\+380\d{9}$/;

document.getElementById('signupForm').addEventListener('submit', function (e) {
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

    if (valid) {
        const form = this;
        document.getElementById('signupSuccess').innerText = 'Registration successful!';


        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        form.reset();
        document.querySelectorAll('input').forEach(i => i.classList.remove('valid'));
        document.getElementById('city').disabled = true;
    }
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
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

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    validate('loginUsername', loginUsername.value.length >= 3 && loginUsername.value.length <= 15, 'Must be 3–15 characters.');
    validate('loginPassword', loginPassword.value.length >= 6, 'At least 6 characters.');

    if (valid) {
        const form = this;
        document.getElementById('loginSuccess').innerText = 'Login successful!';
        form.reset();
        document.querySelectorAll('#loginForm input').forEach(i => i.classList.remove('valid'));
    }
});


