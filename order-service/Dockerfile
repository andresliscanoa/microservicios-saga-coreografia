FROM maven:3.9.2-amazoncorretto-17 as BUILD
LABEL authors="lliscano"
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
WORKDIR /opt/demo
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn clean install -Dmaven.test.skip=true

FROM openjdk:17.0.1-slim
LABEL authors="lliscano"
WORKDIR /opt/app
COPY --from=BUILD /opt/demo/target/app.jar  app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]