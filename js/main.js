let productos = [];


let carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];


function cargarDatosDesdeJSON() {
    fetch("./json/productos.json")
        .then(response => response.json())
        .then(data => {
            productos = data;
            detectarProductoElegido();
        })
        .catch(error => {
            console.error("Error al cargar datos del JSON:", error);
        });
}


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
                Toastify({
                    text: `Se agregó el producto "${productoEncontrado.nombre}" al carrito `,
                    duration: 2000,
                    close: false,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    avatar: "images/icon-cart-check.svg",
                    style: {
                        background: "linear-gradient(to right,rgb(125, 199, 158),rgb(177, 203, 179))",
                    },
                }).showToast();
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
        actualizarSubtotal();
    }
}

function actualizarSubtotal() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    document.getElementById("total").innerText = `Total: $${total}`;
}



//FIN FUNCIONES:


document.addEventListener("DOMContentLoaded", () => {
    cargarDatosDesdeJSON();
    cargarListaDesdeLS();
});


const botonVaciar = document.getElementById("vaciar-carrito");
botonVaciar.addEventListener("click", vaciarCarrito);