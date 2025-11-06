FROM node:20-alpine as build

WORKDIR /app

# Arguments de build pour les variables d'environnement
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Définir les variables d'environnement pour le build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
