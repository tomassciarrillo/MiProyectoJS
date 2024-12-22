let productos= [
    {id:1, nombre:"Mate Imperial",categoria:"Mate",precio:50000,stock:10},
    {id:2, nombre:"Mate Camionero",categoria:"Mate",precio:55000,stock:8},
    {id:3, nombre:"Mate Acero",categoria:"Mate",precio:45000,stock:15},
    {id:4, nombre:"Mate Criollo",categoria:"Mate",precio:43500,stock:10},
    {id:5, nombre:"Mate Imperial Labrado",categoria:"Mate",precio:60000,stock:5},
    {id:6, nombre:"Mate Camionero Premium",categoria:"Mate",precio:65000,stock:3},
    {id:7, nombre:"Bombilla Guitarra",categoria:"Bombilla",precio:12000,stock:20},
    {id:8, nombre:"Bombilla Artesanal",categoria:"Bombilla",precio:23400,stock:12},
    {id:9, nombre:"Bombilla Bomba",categoria:"Bombilla",precio:25000,stock:5},
    {id:10, nombre:"Bombilla Pico Loro",categoria:"Bombilla",precio:22500,stock:7},
    {id:11, nombre:"Bombilla Larga con bisagra",categoria:"Bombilla",precio:24000,stock:11},
    {id:12, nombre:"Bombilla Tres Corazones",categoria:"Bombilla",precio:19000,stock:3},
]


let carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];

// Funciones

function detectarProductoElegido() {
    const botonesAgregar = document.querySelectorAll(".boton-sumar-carrito");

    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const idProducto = boton.getAttribute("data-id");
            const productoEncontrado = productos.find(
                (producto) => producto.id === parseInt(idProducto)
            );

            if (productoEncontrado) {
                agregarAlCarrito(productoEncontrado);
            }
        });
    });
}

function agregarAlCarrito(producto) {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarritoEnLS();
    actualizarListaCarrito();
    actualizarSubtotal();
}

function actualizarCarritoEnLS() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoEnLS();
    actualizarListaCarrito();
    actualizarSubtotal();
}

function actualizarListaCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    if (listaCarrito) {
        listaCarrito.innerHTML = "";

        carrito.forEach((producto) => {
            const itemCarrito = document.createElement("li");
            itemCarrito.innerText = `x${producto.cantidad} ${producto.nombre} - $${producto.precio * producto.cantidad}`;

            const opcionEliminar = document.createElement("button");
            opcionEliminar.innerText = "Eliminar";
            opcionEliminar.className = "eliminar-item-carrito";

            opcionEliminar.addEventListener("click", () => {
                eliminarProductoDelCarrito(producto.id);
            });

            itemCarrito.appendChild(opcionEliminar);
            listaCarrito.appendChild(itemCarrito);
        });
    }
}

function eliminarProductoDelCarrito(idProducto) {
    const productoEnCarrito = carrito.find((item) => item.id === idProducto);

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad -= 1;
        } else {
            carrito = carrito.filter((item) => item.id !== idProducto);
        }
    }

    actualizarCarritoEnLS();
    actualizarListaCarrito();
    actualizarSubtotal();
}

function cargarListaDesdeLS() {
    const carritoEnLS = localStorage.getItem("carrito");
    if (carritoEnLS) {
        carrito = JSON.parse(carritoEnLS);
        actualizarListaCarrito();
    }
}

function actualizarSubtotal() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    document.getElementById("total").innerText = `Total: $${total}`;
}

//Fin funciones//

const botonVaciar = document.getElementById("vaciar-carrito");
botonVaciar.addEventListener("click", vaciarCarrito);

cargarListaDesdeLS();
detectarProductoElegido();
actualizarSubtotal();