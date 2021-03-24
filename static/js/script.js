/*
************* login functionality begin
*/

function checkLogin() {
    var user = document.getElementById("user").value;
    var password = document.getElementById("passw").value;

    var userArray = JSON.parse(localStorage.getItem("lUserArray"));

    if (user !== null && user !== "") {
        if (password !== null && password !== "") {

            var canLogin = checkLoginInfo(user, password, userArray);
            if (canLogin === true) {
                //need a method to get the role and send it into createSessionUser below
                var role = getUserRole(user, password, userArray)
                var name = getUserName(user, password, userArray)
                createSessionUser(name, user, password, role)
                window.location.href = "http://localhost:5000/store";
                //window.location.href = "http://heroku:5000/dashboard";
            } else {
                alert("user or password are not correct");
            }

        } else {
            alert("password must not be empty");
        }
    } else {
        alert("user must not be empty");
    }

}

function checkLoginInfo(user, password, userArray) {
    if (userArray !== null && userArray.length > 0) {
        for (var i = 0; i < userArray.length; i++) {
            if (userArray[i].user === user && userArray[i].password === password) {
                return true;
            }
        }
    }
    return false;
}

function getUserRole(pUser, pPassword, pUserArray) {
    var role = ""
    if (pUserArray !== null && pUserArray.length > 0) {
        var length = pUserArray.length
        for (var i = 0; i < length; i++) {
            if (pUserArray[i].user === pUser && pUserArray[i].password === pPassword) {
                role = pUserArray[i].role
                break
            }
        }
    }
    return role
}

function getUserName(pUser, pPassword, pUserArray) {
    var name = ""
    if (pUserArray !== null && pUserArray.length > 0) {
        var length = pUserArray.length
        for (var i = 0; i < length; i++) {
            if (pUserArray[i].user === pUser && pUserArray[i].password === pPassword) {
                name = pUserArray[i].name
                break
            }
        }
    }
    return name
}

function createSessionUser(name, user, password, role) {
    var logged_user = {
        name: name,
        user: user,
        password: password,
        role: role
    };

    sessionStorage.setItem("loggedUser", JSON.stringify(logged_user));
}

/*
************* login functionality end 
*/


/*
************* register functionality begin
*/

function registerNewUser() {
    var reg_name = document.getElementById('name_reg').value;
    var reg_user = document.getElementById("user_reg").value;
    var reg_password = document.getElementById("passw_reg").value;
    var reg_role = "client";
    

    //alert(reg_user);
    var userArray = [];

    if (localStorage.getItem("lUserArray") !== null) {
        userArray = JSON.parse(localStorage.getItem("lUserArray"));
    }

    var current_reg = {
        name: reg_name,
        user: reg_user,
        password: reg_password,
        role: reg_role
    };

    userArray.push(current_reg);

    localStorage.setItem("lUserArray", JSON.stringify(userArray));

    window.location.href = "http://localhost:5000/login"
    //window.location.href = "http://heroku:5000/login";
}

/*
************* register functionality end
*/


/*
************* store functionality begin
*/



if (window.location.href.includes("store")) {
    //un if general para el dashboard y asi podemos poner todos los metodos que necesitemos
    checkForValidLoginSession()
    setUserNameOnDashboard()
    w3.includeHTML()
}

function checkForValidLoginSession() {
    /*
    tengo que ir a buscar el elemento wUserArray, si no esta vacio
    entonces dejo pasar al dashboard si no es el caso entonces debo redirigir
    hacia el login
    */

    if (sessionStorage.getItem("loggedUser") == null) {
        window.location.href = "http://localhost:5000/login"
        //window.location.href = "http://heroku:5000/login";
    }
}

function setUserNameOnDashboard() {
    var userArray = getCurrentLoggedUser()
    var currentUser = userArray.name
    var currentRole = userArray.role

    var userSpan = document.getElementById("user")
    userSpan.innerText = "Hello, " +  currentUser

    modifyDashboardForRole(currentRole)
}

function getCurrentLoggedUser() {
    var currentLoggedUser = JSON.parse(sessionStorage.getItem("loggedUser"))
    return currentLoggedUser
}

function modifyDashboardForRole(pCurrentRole) {
    var add_admin = document.getElementById("admin")
    var add_client = document.getElementById("client")
    if (pCurrentRole === "admin") {
        //modifcar el dashboard para admin
        add_admin.style.display = "block"
        add_client.style.display = "none"
    } else {
        //modifcar el dashboard para client
        add_admin.style.display = "none"
        add_client.style.display = "block"
    }
}

function logout() {
    sessionStorage.removeItem("loggedUser")
    window.location.href = "http://localhost:5000/"
    //window.location.href = "http://heroku:5000/";
}

/*
************* dashboard functionality end
*/

/*
************* dashboard functionality add admin
*/
if (window.location.href.includes("store")) {
    var currentLoggedUser = getCurrentLoggedUser()
    if (currentLoggedUser.role === "admin") {

        const elementToObserve = document.getElementById("admin")

        const observer = new MutationObserver(function () {
            var currentLoggedUser = getCurrentLoggedUser()
            loadSalesDataFromAllUsers()
            observer.disconnect()
        });

        observer.observe(elementToObserve, { subtree: true, childList: true });
    }
}

function loadSalesDataFromAllUsers() {
    var addResultArray
    if (localStorage.getItem("lSalesArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lSalesArray"));
    }

    var userTableAdmin = document.getElementById("userTableAdmin")
    var row
    var index = 0;
    //var tableIndex = addResultArray

    for (var addResult of addResultArray) {
        row = userTableAdmin.insertRow(1)

        row.insertCell(0).innerHTML = addResult.user;
        row.insertCell(1).innerHTML = addResult.producto;
        row.insertCell(2).innerHTML = addResult.precio;
        row.insertCell(3).innerHTML = addResult.cantidad;
        row.insertCell(4).innerHTML = addResult.total;
        row.insertCell(5).innerHTML = "<button onclick='modifyOnElementByIndex(" + index + ")'>Modificar</button><input type='hidden' id='" + index + "'>";
        row.insertCell(6).innerHTML = "<button onclick='deleteElementByIndex(" + index + ")'>Borrar</button><input type='hidden' id='" + index + "'>";
        index++
    }
}

function deleteElementByIndex(pIndex) {
    //que es lo que implica eliminar un elemento?
    //1. quitarlo del local storage
    deleteElementFromLocalStorage(pIndex)
    //2. quitarlo de la tabla
    deleteElementFromTable(pIndex)

}

function deleteElementFromLocalStorage(pIndex) {
    var addResultArray = JSON.parse(localStorage.getItem("lSalesArray"))
    addResultArray.splice(pIndex, 1)
    localStorage.setItem("lAddResultArray", JSON.stringify(addResultArray))
}

function deleteElementFromTable(pIndex) {
    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 3)
    var child = getElementParent(element, 2)
    parent.removeChild(child)
}

function modifyOnElementByIndex(pIndex) {
    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 2)
    console.log(parent.children)
    var children = parent.children
    children[1].innerHTML = "<input type='text' id='inpProducto" + pIndex + "' value='" + children[1].innerText + "'>"
    children[2].innerHTML = "<input type='number' id='inpPrecio" + pIndex + "' value='" + children[2].innerText + "'>"
    children[3].innerHTML = "<input type='number' id='inpCantidad" + pIndex + "' value='" + children[3].innerText + "'>"
    children[4].innerHTML = "<button onclick='modifyOffElementByIndex(" + pIndex + ",1)'>Guardar</button><button onclick='modifyOffElementByIndex(" + pIndex + ",0)'>Descartar</button><input type='hidden' id='" + pIndex + "'>"
}

function modifyOffElementByIndex(pIndex, pSave) {

    var element = document.getElementById(pIndex)
    var parent = getElementParent(element, 2)
    console.log(parent.children)
    var children = parent.children

    if(pSave === 1) {
        var producto = (document.getElementById("inpProducto"+ pIndex).value)
        var precio = parseFloat(document.getElementById("inpPrecio"+ pIndex).value)
        var cantidad = parseInt(document.getElementById("inpCantidad"+ pIndex).value)
        var total = precio * cantidad

        children[1].innerHTML = producto
        children[2].innerHTML = precio
        children[3].innerHTML = cantidad
        children[4].innerHTML = total

        var addResultArray = []

        if (localStorage.getItem("lSalesArray") !== null) {
            addResultArray = JSON.parse(localStorage.getItem("lSalesArray"));
        }

        addResultArray[pIndex].producto = producto
        addResultArray[pIndex].precio = precio
        addResultArray[pIndex].cantidad = cantidad
        addResultArray[pIndex].total = total

        localStorage.setItem("lSalesArray", JSON.stringify(addResultArray));

    } else {
        var addResultArray
        if (localStorage.getItem("lSalesArray") !== null) {
            addResultArray = JSON.parse(localStorage.getItem("lSalesArray"));
        }
        
        children[1].innerHTML = addResultArray[pIndex].producto
        children[2].innerHTML = addResultArray[pIndex].precio
        children[3].innerHTML = addResultArray[pIndex].cantidad
        children[4].innerHTML =addResultArray[pIndex].total
    }

    
}

function getElementParent(pElement, pGen) {
    var parent = pElement
    for (var i = 0; i < pGen; i++) {
        parent = parent.parentNode
    }
    return parent
}


/*
************* dashboard functionality add admin
*/


/*
************* dashboard functionality add client
*/


//Mostrar Compras Cliente

if (window.location.href.includes("store")) {
    var currentLoggedUser = getCurrentLoggedUser()
    var currentUser = currentLoggedUser.user
    if (currentLoggedUser.role === "client") {

        const elementToObserve = document.getElementById("client")

        const observer = new MutationObserver(function () {
            loadSalesDataByUser(currentUser)
            observer.disconnect()
        });

        observer.observe(elementToObserve, { subtree: true, childList: true });
    }
}

function loadSalesDataByUser(pCurrentUser) {
    var addResultArray
    if (localStorage.getItem("lSalesArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lSalesArray"));
    }

    var userTableClient = document.getElementById("userTableClient")
    var row

    for (var addResult of addResultArray) {
        if (addResult.user === pCurrentUser) {
            row = userTableClient.insertRow(1)

            row.insertCell(0).innerHTML = addResult.producto;
            row.insertCell(1).innerHTML = addResult.precio;
            row.insertCell(2).innerHTML = addResult.cantidad;
            row.insertCell(3).innerHTML = addResult.total;
        }
    }
}

//Función de registrar compra

function addSale() {
    var producto = (document.getElementById("producto").value)
    var precio = parseFloat(document.getElementById("precio").value)
    var cantidad = parseInt(document.getElementById("cantidad").value)
    var total = precio * cantidad
    cleanForm()
    addResultToTable(producto, precio, cantidad, total)
    addResultToStorage(producto, precio, cantidad, total)

}

function cleanForm() {
    document.getElementById("producto").value = ""
    document.getElementById("precio").value = ""
    document.getElementById("cantidad").value = ""
}

function addResultToTable(pProducto, pPrecio, pCantidad, pTotal) {
    var myTable = document.getElementById("userTableClient")

    var row = myTable.insertRow(1)

    row.insertCell(0).innerHTML = pProducto;
    row.insertCell(1).innerHTML = pPrecio;
    row.insertCell(2).innerHTML = pCantidad;
    row.insertCell(3).innerHTML = pTotal;
}

function addResultToStorage(pProducto, pPrecio, pCantidad, pTotal) {
    var addResultArray = []

    //obtener el current logged user
    var currentLoggedUser = getCurrentLoggedUser()
    //console.log(currentLoggedUser.user)

    if (localStorage.getItem("lSalesArray") !== null) {
        addResultArray = JSON.parse(localStorage.getItem("lSalesArray"));
    }

    var current_add_result = {
        user: currentLoggedUser.user,
        producto: pProducto,
        precio: pPrecio,
        cantidad: pCantidad,
        total: pTotal
    }

    addResultArray.push(current_add_result)
    localStorage.setItem("lSalesArray", JSON.stringify(addResultArray));
}

/*
************* dashboard functionality add client
*/
