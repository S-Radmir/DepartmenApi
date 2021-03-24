async function GetDepartments() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/departments", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const departments = await response.json();
        let rows = document.querySelector(".depart");
        departments.forEach(depart => {
            // добавляем полученные элементы в таблицу
            rows.append(row(depart));
        });
    }
}

async function GetEmployees(id) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/departments/" + id + "/employess", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const employees = await response.json();
        return employees;
    }
}

function WriteEmployees(id) {
    let ul = document.createElement('ul');

    var employes = GetEmployees(id);
    employes.then(function (data) {
        data.forEach(employe => {
            let li = document.createElement('li');
            li.id = employe.id;
            li.textContent = employe.name;
            li.onclick = function () { FormUser(employe.id) };
            ul.append(li);
        });
    });

    return ul;
}

async function FormUser(id) {
    const response = await fetch("/api/employees/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
        const employee = await response.json();
        const form = document.forms["userForm"];
        form.style.display = 'inline-block';
        form.elements["id"].value = employee.id;
        form.elements["name"].value = employee.name;
        form.elements["salary"].value = employee.salary;
        form.elements["depart"].value = employee.departmen.name;
        form.elements["departId"].id = employee.departmen.id;
    }
}


// Добавление сотрудника
async function CreateUser(name, salary, depart) {
    const response = await fetch("api/employees/", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            salary: salary,
            departmen: depart
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + depart.id + "']").replaceWith(row(depart));
    }
}

// Изменение службы
async function EditUser(id, name, salary, depart) {
    const response = await fetch("/api/employees/" + id, {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: parseInt(id, 10),
            name: name,
            salary: salary,
            departmen: depart
        })
    });

    if (response.ok === true) {
        const user = await response.json();
        //alert(Object.values(depart));
        document.querySelector("tr[data-rowid='" + depart.id + "']").replaceWith(row(depart));
    }
}


// Получение службы
async function GetDepartment(id) {
    const response = await fetch("/api/departments/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const depart = await response.json();
        return depart;
    }
}

async function GetAvgSolary(id) {
    var salary;
    const response = await fetch("/api/departments/" + id + "/salary", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
    });
    if (response.ok === true) {
        salary = await response.json();
        //alert(Object.values(salary));
    }

    return salary;
}

function WriteAVG(id) {
    let newDiv = document.createElement('div');
    var salary = GetAvgSolary(id);

    salary.then(function (data) {
        newDiv.innerHTML = data;
    });

    return newDiv;
}

// Добавление службы
async function CreateDepart(departName) {
    const response = await fetch("api/departments", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: departName
        })
    });
    if (response.ok === true) {
        const depart = await response.json();
        reset();
        document.querySelector(".depart").append(row(depart));
    }
}

// Изменение службы
async function EditDepart(departId, departName) {
    const response = await fetch("/api/departments/" + departId, {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: parseInt(departId, 10),
            name: departName,
        })
    });
    if (response.ok === true) {
        const depart = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + depart.id + "']").replaceWith(row(depart));
    }
}
// Удаление
async function DeleteDepartment(id) {
    const response = await fetch("/api/departments/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        document.querySelector("tr[data-rowid='" + id + "']").remove();
    }
}

async function DelUser() {
    const form = document.forms["userForm"];
    const id = form.elements["id"].value;
    const departId = form.elements["departId"].id;

    if (id != null) {
        const response = await fetch("/api/employees/" + id, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (response.ok === true) {
            var depart = GetDepartment(departId);
            depart.then(function (data) { document.querySelector("tr[data-rowid='" + departId + "']").replaceWith(row(data)); });

        }
    }
    form.style.display = 'none';
    form.reset();
    form.elements["id"].value = 0;
}



// сброс формы
function reset() {
    const form = document.forms["cardForm"];
    form.reset();
    form.elements["id"].value = 0;
}
// создание строки для таблицы
function row(depart) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", depart.id);

    const idTd = document.createElement("td");
    idTd.append(depart.id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(depart.name);
    tr.append(nameTd);

    const salary = document.createElement("td");
    salary.append(WriteAVG(depart.id));
    tr.append(salary);

    //add users
    const users = document.createElement("td");
    users.append(WriteEmployees(depart.id));
    //bt add
    var button = document.createElement("button");
    button.innerHTML = "Добавить";
    button.onclick = function () {
        const form = document.forms["userForm"];
        form.style.display = 'inline-block';
        form.elements["depart"].value = depart.name;
        form.elements["departId"].id = depart.id;
    };

    users.append(button);
    tr.append(users);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", depart.id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Изменить");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        const form = document.forms["cardForm"];
        form.elements["id"].value = depart.id;
        form.elements["name"].value = depart.name;
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", depart.id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {
        e.preventDefault();
        DeleteDepartment(depart.id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}
// сброс значений формы
document.getElementById("reset").click(function (e) {
    e.preventDefault();
    reset();
})

// отправка формы
document.forms["cardForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["cardForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;

    if (id == 0)
        CreateDepart(name);
    else
        EditDepart(id, name);
});

// отправка формы
document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const departmentID = form.elements["departId"].id;
    const salary = form.elements["salary"].value;
    if (id == 0) {
        var depart = GetDepartment(departmentID);
        depart.then(function (data) { CreateUser(name, salary, data) });
    }
    else {
        var depart = GetDepartment(departmentID);
        depart.then(function (data) { EditUser(id, name, salary, data) });
    }
    form.style.display = 'none';
    form.reset();
    form.elements["id"].value = 0;
});

GetDepartments();