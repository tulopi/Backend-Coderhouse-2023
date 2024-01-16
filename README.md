# Entrega 14 📄
✅ Se incorporo el uso del logger log4js necesario para la entrega.

## Implementación:
### 🔎 Loggers de log4js: loggerError - loggerWarning - loggerInfo.
### 🏗️ App - Index / Mejora de la arquitectura del servidor.
### 🛣️ index.routes.js en la carpeta routes para mejorar el manejo y legiblidad de las rutas.

## Modo de uso:
Puede ser tanto desde el front como desde el back, es más rápido del front. 
Se creara una carpeta LOGS la cual mostrara los error.log y warn.log, esta carpeta debe ser agregada al .gitignore.

### -ℹloggerInfo : Al levantar el servidor y realizar acciones que lo requieran se mostrara [INFO] en consola con los datos.
### -loggerWarning: Ejemplo de uso entrar a una ruta inexistente por ejemplo: "http://localhost:8080/products/65417d58a58ef22c0993afd8/asd", mostrara [WARN] en consola con el tipo de advertencia.
### -loggerError: Mostrara los errores por consola con [ERROR] más la información de lo que lo esta ocasionando. Ejemplo: se puede borrar cualquier parte del app.js/index.js y guardar para originar un error de este tipo.