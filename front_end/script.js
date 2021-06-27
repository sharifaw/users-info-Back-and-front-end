const div = document.getElementById('mainDiv');
const input = document.getElementById('filter-btn');
const addUserBtn = document.getElementById('addBtn');
const addUserDiv = document.getElementById('add_user');
const firstNameInput = document.getElementById('first_name');
const lastNameInput = document.getElementById('last_name');
const emailInput = document.getElementById('email');
const avatarInput = document.getElementById('avatar');
const submitButton = document.getElementById('submit');
const paragraph = document.getElementById("wrong_name");

let users = [];

fetch("http://localhost:2000/api/v1/users")
.then (response =>{ return response.json()})
.then (result => {
    console.log('result ',result);
    users = result;
    renderUsersList(users);
});

input.addEventListener('input',event =>{
    div.innerHTML = '';
    renderUsersList(users.filter(user =>{ 
       if (user.first_name.startsWith(`${event.target.value}` ) || user.last_name.startsWith(`${event.target.value}`))
       {
            return user;
       }
       else if (user.email.startsWith(`${event.target.value}`)){
           return user;
       }
    } ));
})


addUserBtn.addEventListener('click',event =>{
    event.preventDefault();
    addUserDiv.classList.remove("noneDisplay");
    addUserDiv.classList.add("inline-block");
    submitButton.addEventListener("click",event =>{
        event.preventDefault();
        let idCounter = 0;
        fetch("http://localhost:2000/api/v1/users")
        .then(response =>{ return response.json()})
        .then (result => { 
            idCounter = result.length+1;
        })
        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "id" : `${idCounter}`,
                "email": `${emailInput.value}`,
                "first_name": `${firstNameInput.value}`,
                "last_name": `${lastNameInput.value}`,
                "avatar": `${avatarInput.value}`
            })
        };

        let checkStatus = fetch(`http://localhost:2000/api/v1/users`,options)
        .then(response => {
            if (!response.ok) {
                paragraph.classList.remove("noneDisplay");
                paragraph.insertAdjacentHTML("afterbegin",`${firstNameInput.value} is already exists`)
                throw Error(firstNameInput.style.color = 'red') 
            }
            div.insertAdjacentHTML('beforeend',`<div id=${idCounter}>
                <p>
                <strong>${firstNameInput.value}</strong> ${lastNameInput.value}</strong>
                </p>
                <p>${emailInput.value}</p>
                <img src="${avatarInput.value}" alt="">
                <button class="deleteBtn">Delete</button>
            </div>`)
            if(event.target.tagName === 'INPUT') {
                addUserDiv.classList.add("noneDisplay");
            }
        })
        .then(result =>{users+=result; console.log(users)})
    })
    
})

div.addEventListener('click',event=>{
    if (event.target.tagName === 'BUTTON'){
        const option = {
            method:"DELETE"
        }
        fetch(`http://localhost:2000/api/v1/users/${event.target.parentNode.id}`,option)
        .then(response=>{ 
            
            if(response.status === 200){
                event.target.parentNode.remove();
            }
            else{
                alert("Error:Delete method doesn't work well");
            }
        })
        
    }
})

function renderUsersList(users) {
    for (let user = 0 ; user < users.length ; user++){
        div.insertAdjacentHTML(`beforeend`,`
        <div id=${users[user].id}>
        <p>
        <strong>${users[user].first_name} ${users[user].last_name}</strong>
        </p>
        <p>${users[user].email}</p>
        <img src="${users[user].avatar}" alt="">
        <button class="deleteBtn">Delete</button>
    </div>
    
        `)}
}

