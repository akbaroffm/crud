let elModalWrapper = document.querySelector(".modal-wrapper");
let elModal = document.querySelector(".modal");

let searchInput = document.querySelector(".search");

let tBody = document.querySelector(".tbody");
let tHead = document.querySelector(".thead");

let addBtn = document.querySelector(".add-student");

let students = JSON.parse(localStorage.getItem('students')) || [];

function saveLC() {
    localStorage.setItem('students', JSON.stringify(students));
}
function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function renderStudent(arr, list){
    list.innerHTML = "";
    arr.forEach(item => {
        let elItem = document.createElement('li');

        let currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours());

        elItem.innerHTML = `
            <ul class="td-wrap">
                <li class="table-item2 student-img">
                    <img src="${item.img}" alt="Student Image" width="90" height="50">
                </li>
                <li class="table-item2">${item.name}</li>
                <li class="table-item2">${item.email}</li>
                <li class="table-item2">${item.phone}</li>
                <li class="table-item2">${item.enrollnumber}</li>
                <li class="table-item2">${item.admissionDate}</li>
                <li class=table-icon>
                    <button onclick="updateClick(${item.id})">
                        <img src="./images/update.svg">
                    </button>
                    <button onclick="deleteClick(${item.id})">
                        <img src="./images/delete.svg">
                    </button>
                </li>
            </ul>
        `;
        list.appendChild(elItem);
    });
}

addBtn.addEventListener('click', function() {
    elModalWrapper.classList.add("open-modal");
    elModal.innerHTML = `
    <form class="add-form">
        <label>
            <div class="form-img__wrapper">
                <img id="render-img" class="form-img render-img" src="./images/choose.png" width="300" height="140"/>
            </div>
            <input id="input-img" class="visually-hidden get-img" type="file"/>
        </label>
        <div class="category-wrap">
            <div class="category-left">
                <label class="category-title">
                    <span>Student name:</span><br>
                    <input class="category-input" type="text" placeholder="name"/>
                </label>
                <label class="category-title">
                    <span>Student phone:</span><br>
                    <input class="category-input" type="text" placeholder="phone"/>
                </label>
            </div>
            <div class="category-right">
                <label class="category-title">
                    <span>Student email:</span><br>
                    <input class="category-input" type="text" placeholder="email"/>
                </label>
                <label class="category-title">
                    <span>Enroll number:</span><br>
                    <input class="category-input" type="text" placeholder="enroll number"/>
                </label>
            </div>
        </div>
        <div class="btn-wrap">
            <button class="add-form__btn">Add</button>
        </div>
    </form>
    `;
    
    let elForm = document.querySelector(".add-form");
    let elRenderImg = document.getElementById("render-img");
    let elInputImg = document.getElementById("input-img");

    elInputImg.addEventListener("change", function(evt){        
        elRenderImg.src = URL.createObjectURL(evt.target.files[0]);
    });

    elForm.addEventListener("submit", function(evt){
        evt.preventDefault();
        let nameInput = elForm.querySelector('.category-left input');
        let emailInput = elForm.querySelector('.category-right input');
        let phoneInput = elForm.querySelector('.category-left input[type="text"][placeholder="phone"]');
        let enrollInput = elForm.querySelector('.category-right input:last-of-type');
    
        if (nameInput.value && emailInput.value && phoneInput.value && enrollInput.value) 
        {
            let data = {
                img: elRenderImg.src,
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                enrollnumber: enrollInput.value,
                admissionDate: formatDateTime(new Date()), // Set the admission date here
            };
            students.push(data);
            saveLC();
            renderStudent(students, tBody);
            elModalWrapper.classList.remove("open-modal"); 
        }
    });
    
});

elModalWrapper.addEventListener("click", function(evt){
    if(evt.target.id == "modal-wrapper"){
        elModalWrapper.classList.remove("open-modal");
    }
});

searchInput.addEventListener("input", function() {
    let searchTerm = searchInput.value.toLowerCase();
    let filteredStudents = students.filter(student => {
        return student.name.toLowerCase().includes(searchTerm);
    });
    renderStudent(filteredStudents, tBody);
});

function updateClick(id) {
    let data = students.find(item => item.id == id);

    elModalWrapper.classList.add("open-modal");
    elModal.innerHTML = `
        <form class="update-form">
            <label>
                <div class="form-img__wrapper">
                    <img class="form-img update-render-img" src="${data.img}" width="140" height="80"/>
                </div>
                <input class="visually-hidden update-get-img" type="file"/>
            </label>
            <div class="update-wrap">
                <div class="update-left">
                    <label>
                        <span>Student name:</span><br>
                        <input id="update-name" value="${data.name}" class="category-input" type="text" placeholder="name"/>
                    </label><br>
                    <label>
                        <span>Student email:</span><br>
                        <input id="update-email" value="${data.email}" class="category-input" type="text" placeholder="email"/>
                    </label><br>
                </div>
                <div class="update-right">
                    <label>
                        <span>Student phone:</span><br>
                        <input id="update-phone" value="${data.phone}" class="category-input" type="text" placeholder="phone"/>
                    </label><br>
                    <label>
                        <span>Enroll number:</span><br>
                        <input id="update-enroll" value="${data.enrollnumber}" class="category-input" type="text" placeholder="enroll number"/>
                    </label><br>
                </div>
            </div>
            <div class="update-btn">
                <button class="add-form__btn">Update</button>
            </div>
        </form>
    `;

    let elUpdateForm = document.querySelector(".update-form");
    let elUpdateImgInput = document.querySelector(".update-get-img");
    let elUpdateImg = document.querySelector(".update-render-img");

    elUpdateImgInput.addEventListener("change", function(evt){        
        elUpdateImg.src = URL.createObjectURL(evt.target.files[0]);
    });

    elUpdateForm.addEventListener("submit", function(evt){
        evt.preventDefault();
        data.img = elUpdateImg.src;
        data.name = document.getElementById("update-name").value;
        data.email = document.getElementById("update-email").value;
        data.phone = document.getElementById("update-phone").value;
        data.enrollnumber = document.getElementById("update-enroll").value;

        saveLC();
        renderStudent(students, tBody);
        elModalWrapper.classList.remove("open-modal");
    });
}


function deleteClick(id){
    const studentId = students.findIndex(item => item.id === id);
    
    if (studentId !== -1) {
        students.splice(studentId, 1);
        saveLC();
        renderStudent(students, tBody);
    }
}

let sortBtn = document.querySelector(".sort-img");
let order = true;

sortBtn.addEventListener('click', function() {
    order = !order;

    if (order) {
        students.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        students.sort((a, b) => b.name.localeCompare(a.name));
    }
    saveLC();
    renderStudent(students, tBody);
});

document.addEventListener("DOMContentLoaded", function() {
    const userData = JSON.parse(localStorage.getItem('login'));

    if (userData && userData.login) {
        document.querySelector(".user-name").textContent = userData.login;
    }
});


const logoutButton = document.querySelector(".logout-wrap");

logoutButton.addEventListener("click", function() {
    localStorage.removeItem('login');
    
    window.location.href = "./login.html";
});

const userAvatar = document.querySelector(".user-avatar");
const fileInput = document.querySelector(".update-get-img");

userAvatar.addEventListener("click", function() {
    fileInput.click();
});

fileInput.addEventListener("change", function(evt) {
    const file = evt.target.files[0];
    if (file) {
        
        if (file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file);
            userAvatar.src = imageUrl;
        }
    }
});


renderStudent(students, tBody);