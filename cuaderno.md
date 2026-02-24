CONFIGURACION SUPABASE

En Next.js 13+, el código puede ejecutarse en dos lugares: el Navegador (Cliente) o el Servidor. Supabase necesita configurarse de forma distinta para cada uno:

1.  client.ts
    (Para el Navegador)
    Este archivo crea un cliente de Supabase diseñado para ejecutarse exclusivamente en el Cliente (dentro de componentes que tienen "use client").

¿Para qué sirve?: Se usa cuando el usuario interactúa con la página (clicks, formularios, suscripciones en tiempo real).
Seguridad: No puede acceder a variables de entorno secretas (solo a las que empiezan con NEXT*PUBLIC*).
Ejemplo: Lo usamos en tu
LoginForm.tsx
para manejar el login desde el formulario.

2.  server.ts
    (Para el Servidor)
    Este archivo crea un cliente de Supabase para ejecutarse en el Servidor (Server Components, Server Actions o API Routes).

¿Para qué sirve?: Se usa para leer datos de la base de datos antes de que la página se envíe al navegador, o para realizar acciones seguras en el servidor.
