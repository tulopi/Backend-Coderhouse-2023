# Endpoints para la Entrega 10 y adaptación del proyecto para la entrega 11
Realizar login en el primer endpoint para generar un token y luego acceder a los datos del token desde el segundo endpoint.
Reestructure la arquitectura del proyecto al lugar donde empiezo a trabajar en 1 semana para practicar, si es necesario puedo adaptarlo a DAO y DTO, lo realice de esta forma porque que estaba ajustado con el tiempo debido a la capacitación y el trabajo actual, utilize el proyecto para irme acostumbrando a las practicas que utilizan en la empresa.

## Implementación:
Variables de entorno - arquitectura del proyecto.

## Endpoints

### Login de usuario

- **Endpoint:** `http://localhost:8080/login`
- **Descripción:** Se puede ingresar utilizando local strategy o github lo cual generara un token.

### Login de usuario

- **Endpoint:**  `http://localhost:8080/api/users/current`
- **Descripción:** Accediendo al endpoints current se podrá obtener los datos del usuario.

