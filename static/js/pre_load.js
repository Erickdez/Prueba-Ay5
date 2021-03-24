/*
preload information to local storage users
*/
function preLoadUsers() {

    var userArray = [{
        name: "Balbino",
        user: "bal",
        password: "123",
        role: "admin"
    }, {
        name: "Rodri",
        user: "rod",
        password: "234",
        role: "client"
    }, {
        name: "Teddy",
        user: "ted",
        password: "345",
        role: "client"
    }]

    localStorage.setItem("lUserArray", JSON.stringify(userArray))
}

function preLoadSales() {

    var addSalesArray = [
        {user: "rod", producto: "Manzanas", precio: 0.40, cantidad: 5, total: 2}
    ]

    localStorage.setItem("lSalesArray", JSON.stringify(addSalesArray))
}


preLoadUsers()
preLoadSales()