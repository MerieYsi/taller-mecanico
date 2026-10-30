# TALLER MECÁNICO
App móvil para un taller mecánico, hecha con React Native y Expo. Permite que los mecánicos se registren, inicien sesión y carguen información de los vehículos que atienden.

## Integrantes
- Ivaan Ysea
- Agustín Richard
- María Reynoso
- Alex Natanael Arce

## Features implementadas
- Login de mecánicos con validación de email y contraseña
- Registro de nuevos mecánicos con validaciones (nombre y apellido solo letras, DNI, teléfono, email, contraseña con letra y número, confirmación de contraseña)
- Control de duplicados (email y DNI únicos) con mensajes de error debajo de cada campo
- Persistencia local de los datos con Zustand + AsyncStorage (base de datos provisoria en el dispositivo)
- Navegación Stack con Expo Router (`push`, `back`, `replace`)
- Listado de vehículos con `FlatList`
- Alta de vehículos con validación
- Cada mecánico ve solo los vehículos que cargó
- Cierre de sesión
- Estilos con Styled Components
- Ruta dinámica `vehiculos/[id]` con paso de parámetros
- CRUD completo de vehículos: crear, listar, ver detalle, editar y eliminar (con confirmación)
- Buscador en vivo por marca, modelo o patente
- Foto del vehículo desde cámara o galería (`expo-image-picker`), con solicitud de permisos

## Features pendientes
- Backend y base de datos real (SQL Server)
- Contraseñas hasheadas (hoy se guardan en texto plano, solo para el prototipo)
- Vincular vehículos a clientes
- Órdenes de servicio y detalle de orden
- Catálogo de servicios
- Estados de orden (Pendiente, En Proceso, Finalizada, Cancelada)
- Migrar la persistencia a SQLite / backend y base de datos según el DER
- Consumo de API con TanStack Query
- Animaciones con Animated
- Tests con Jest + Testing Library

## Usuario de prueba
- Email: `juan@taller.com`
- Contraseña: `123456`
También se puede crear un mecánico nuevo desde "Registrar nuevo mecánico" en la pantalla de login. Los datos se guardan solo en el dispositivo donde se prueba la app.