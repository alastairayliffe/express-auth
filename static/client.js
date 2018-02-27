
    let email = document.getElementById('email');
    let password = document.getElementById('pwd');
    let submit = document.getElementById('submit');

submit.addEventListener('click', showUsername);

function showUsername(){
    const user = email.value;
    const pwd = password.value;

    let userData = {
        username: user,
        password: pwd
    };
    
fetch ('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: new Headers({
    'Content-Type': 'application/json'
    })
}).then(res => res.json())
.catch(error => console.error('Error:', error));

};