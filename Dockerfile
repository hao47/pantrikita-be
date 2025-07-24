# Gunakan image Node.js resmi
FROM node:20-alpine

# Atur direktori kerja di container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua source code
COPY . .

# Buka port default NestJS
EXPOSE 8000

# Jalankan aplikasi dalam mode development
CMD ["npm", "run", "start:dev"]
