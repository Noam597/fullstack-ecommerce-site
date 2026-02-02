
# build
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL


COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve with Vite preview (simple) — or swap for nginx if you prefer
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]