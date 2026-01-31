# Use Java 17
FROM eclipse-temurin:17-jdk-jammy

# Set workdir
WORKDIR /app

# Copy Maven wrapper and pom.xml first for caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build project
COPY src src
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java","-jar","target/pastebinlite-0.0.1-SNAPSHOT.jar"]
