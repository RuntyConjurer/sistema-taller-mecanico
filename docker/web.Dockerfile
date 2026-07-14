FROM node:20-alpine AS build

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_DATA_SOURCE=api
ARG VITE_API_BASE_URL=
ARG VITE_WHATSAPP_NUMBER=15556552000
ENV VITE_DATA_SOURCE=${VITE_DATA_SOURCE}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_WHATSAPP_NUMBER=${VITE_WHATSAPP_NUMBER}
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
