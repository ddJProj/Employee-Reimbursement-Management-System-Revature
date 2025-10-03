# backend/Dockerfile

FROM gradle:8.5-jdk17-alpine AS build

WORKDIR /app

#jwt secrets from GH env 
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

# copy source/settings
COPY settings.gradle ./
COPY core/ ./core/
COPY backend/ ./backend/

# build the app
WORKDIR /app/backend
RUN gradle clean build -x test --no-daemon

# Runtime stage - run the app
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# copy the app JAR image from build
COPY --from=build /app/backend/build/libs/*.jar app.jar

# expose the springboot api port
EXPOSE 8080

# run / start the app
CMD ["java", "-jar", "app.jar"]
