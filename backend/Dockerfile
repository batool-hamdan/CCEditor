# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the application JAR file to the container
COPY target/CodeEditor-Backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the Spring Boot application will run on
EXPOSE 8085 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]