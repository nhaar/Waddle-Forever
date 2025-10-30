# LOST-IN-TIME

Aplicación móvil y web en React Native para experimentar con un clon del *Club Penguin Wiki*.

## Desarrollo

1. Instala las dependencias (usa `npm` sin generar `package-lock.json`):
   ```bash
   npm install --no-package-lock
   ```
2. Inicia el proyecto:
   ```bash
   npm start
   ```
   - `npm run android`
   - `npm run ios`
   - `npm run web`

El contenido de ejemplo se encuentra en `src/data/articles.js`. Personalízalo o conéctalo a un origen de datos real para ampliar la aplicación.

## Configuración de CORS para exportaciones/importaciones en Firebase

1. **Crear archivo `cors.json`** (en Cloud Shell o tu terminal):
   ```bash
   cat > cors.json <<'EOF'
   [
     {
       "origin": [
         "http://localhost:8082",
         "http://127.0.0.1:8082",
         "https://valverde-101.github.io"
       ],
       "method": ["GET", "HEAD", "OPTIONS"],
       "responseHeader": [
         "Content-Type",
         "x-goog-meta-*",
         "x-goog-hash",
         "Accept-Ranges",
         "Content-Length",
         "ETag"
       ],
       "maxAgeSeconds": 3600
     }
   ]
   EOF
   ```

2. **Aplicar la configuración CORS al bucket** `gs://data-club-penguin.firebasestorage.app`:
   - Con `gcloud` (recomendado):
     ```bash
     # (opcional) Ver proyecto activo
     gcloud config get-value project

     # Aplicar CORS
     gcloud storage buckets update gs://data-club-penguin.firebasestorage.app --cors-file=cors.json
     ```
   - Con `gsutil` (alternativa):
     ```bash
     gsutil cors set cors.json gs://data-club-penguin.firebasestorage.app
     ```

3. **Verificar la configuración**:
   ```bash
   # Verificación clara
   gsutil cors get gs://data-club-penguin.firebasestorage.app

   # O con gcloud en JSON/YAML
   gcloud storage buckets describe gs://data-club-penguin.firebasestorage.app --format=json | jq .cors
   # o
   gcloud storage buckets describe gs://data-club-penguin.firebasestorage.app --format=yaml | sed -n
   ```
