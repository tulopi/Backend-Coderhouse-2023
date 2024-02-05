# Entrega 15 📄

## Endpoint front:
### 🌐  http://localhost:8080/login // Iniciar sesión y restaurar contraseña.
###  🌐 http://localhost:8080/profile // Aqui se podrá cambiar de user a premium y viceversa.

## Endpoints back:
### Para todos hay que iniciar sesión, hay que crear productos y pasarle el objectId de manera manual.

### // [POST] 🌐 http://localhost:8080//api/products/:cid/products/:pid // Se verifica que el usuario no sea owner del producto para no poder agregarlo a su carrito.
### // [POST] 🌐 http://localhost:8080/api/products/ // Se verfica que solo el usuario admin / premium puedan crear productos y además de se asigno el campo owner.
### // [DELETE] 🌐 http://localhost:8080/api/products/:pid // Pide estar logeado y verifica si uno es owner o admin para eliminar.


# Entrega 16 📄

### 🌐  http://localhost:8080 // Se puede ir a la sección de API Documentation para ver toda la documentación de productos.
### http://localhost:8080/api/docs/#/