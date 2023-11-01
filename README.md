# Documentación de Endpoints

## Views Router

### `GET /api/views/products`
- **Descripción:** Permite acceder a la lista de productos. Puedes utilizar los parámetros `limit`, `page`, `sort` para personalizar tu búsqueda.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/views/products?limit=10&page=1&sort=price)

### `GET /api/views/products/:pid`
- **Descripción:** Accede a un producto específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/views/products/123456)

### `GET /api/views/chat`
- **Descripción:** Accede al chat de la aplicación.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/views/chat)

### `GET /api/views/carts/:cid`
- **Descripción:** Accede a un carrito específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/views/carts/789012)

## Products Router

### `GET /api/products`
- **Descripción:** Realiza una búsqueda de todos los productos disponibles en la base de datos.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/products)

### `GET /api/products/:idProduct`
- **Descripción:** Obtiene un producto específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/products/123456)

### `POST /api/products`
- **Descripción:** Permite crear un nuevo producto.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/products)

### `PUT /api/products/:idProduct`
- **Descripción:** Actualiza un producto específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/products/123456)

### `DELETE /api/products/:idProduct`
- **Descripción:** Borra un producto específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/products/123456)

## Cart Router

### `GET /api/carts`
- **Descripción:** Obtiene una lista de todos los carritos disponibles.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts)

### `GET /api/carts/:id`
- **Descripción:** Accede a un carrito específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts/789012)

### `POST /api/carts`
- **Descripción:** Crea un nuevo carrito.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts)

### `POST /api/carts/:cid/products/:pid`
- **Descripción:** Agrega productos al carrito específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts/789012/products/123456)

### `DELETE /api/carts/:cid/products/:pid`
- **Descripción:** Elimina productos del carrito por ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts/789012/products/123456)

### `DELETE /api/carts/:cid/empty`
- **Descripción:** Vacía el contenido del carrito por ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts/789012/empty)

### `DELETE /api/carts/:cid`
- **Descripción:** Elimina un carrito específico por su ID.
- **Ejemplo:** [Ver enlace](http://localhost:8080/api/carts/789012)
