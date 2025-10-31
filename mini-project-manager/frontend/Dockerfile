# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine AS runtime

# Install envsubst (from gettext) for templating and bash for script
RUN apk add --no-cache bash gettext

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx template and start script
COPY nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Render provides $PORT; default to 8080 locally
ENV PORT=8080
EXPOSE 8080

CMD ["/start.sh"]
