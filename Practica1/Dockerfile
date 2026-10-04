FROM node:22-alpine

WORKDIR /app

# Instala las dependencias dentro de la imagen (se cachea si package.json no cambia)
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto del proyecto
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
