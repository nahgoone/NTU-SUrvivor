# Notes

## DevOps / Engineering Practices

This project includes basic DevOps practices to improve maintainability and deployment readiness.

### Docker

The app can be containerised using Docker so that it can run in a consistent environment regardless of the local machine setup.

This is useful because the app will run using the same Node.js version, dependencies, build process, and production start command inside the container.

There are two ways to run the app with Docker:

1. Manual Docker commands
2. Docker Compose

---

#### Method 1: Manual Docker Build and Run

Build the Docker image:

```bash
docker build -t gpa-tracker .
```

Run the Docker container:

```bash
docker run -p 3000:3000 gpa-tracker
```

After running the container, open:

```txt
http://localhost:3000
```

##### What These Commands Do

```bash
docker build -t gpa-tracker .
```

- Reads the `Dockerfile` in the current project directory.
- Builds a Docker image based on the instructions in the `Dockerfile`.
- Tags/names the image as `gpa-tracker`.
- The `.` means Docker uses the current folder as the build context.

```bash
docker run -p 3000:3000 gpa-tracker
```

- Starts a new container from the `gpa-tracker` image.
- Maps port `3000` on the local machine to port `3000` inside the container.
- This allows the app running inside Docker to be accessed through `localhost:3000`.

##### Useful Manual Docker Commands

List running containers:

```bash
docker ps
```

List all containers, including stopped ones:

```bash
docker ps -a
```

Stop a running container:

```bash
docker stop <container_id>
```

Remove a stopped container:

```bash
docker rm <container_id>
```

Remove the Docker image:

```bash
docker rmi gpa-tracker
```

---

#### Method 2: Docker Compose

Docker Compose allows the build and run configuration to be written in a `docker-compose.yml` file, so the app can be started with a shorter command.

Run the app using Docker Compose:

```bash
docker compose up --build
```

After running the container, open:

```txt
http://localhost:3000
```

##### What This Command Does

```bash
docker compose up --build
```

- Reads the `docker-compose.yml` file.
- Builds the Docker image if needed.
- Starts the container.
- Applies the port mapping defined in `docker-compose.yml`.
- Applies any environment variables defined in `docker-compose.yml`.
- Shows the container logs in the terminal.

##### Example `docker-compose.yml`

```yml
services:
  gpa-tracker:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
```

##### Explanation of `docker-compose.yml`

```yml
services:
```

Defines the containers/services that belong to this app.

```yml
gpa-tracker:
```

The name of the service. This can be any meaningful name.

```yml
build:
  context: .
  dockerfile: Dockerfile
```

Tells Docker Compose to build the image using the `Dockerfile` in the current project directory.

```yml
ports:
  - "3000:3000"
```

Maps port `3000` on the local machine to port `3000` inside the container.

This is similar to:

```bash
docker run -p 3000:3000 gpa-tracker
```

```yml
environment:
  NODE_ENV: production
```

Sets the `NODE_ENV` environment variable inside the container.

This does not require an `.env` file because the value is written directly in `docker-compose.yml`.

##### Useful Docker Compose Commands

Start the app and rebuild the image if needed:

```bash
docker compose up --build
```

Start the app in detached/background mode:

```bash
docker compose up --build -d
```

Stop the running Compose services:

```bash
docker compose down
```

View logs:

```bash
docker compose logs
```

View logs continuously:

```bash
docker compose logs -f
```

---

#### Manual Docker vs Docker Compose

| Method         | Command                       | Best For                                        |
| -------------- | ----------------------------- | ----------------------------------------------- |
| Manual Docker  | `docker build` + `docker run` | Understanding how Docker builds and runs images |
| Docker Compose | `docker compose up --build`   | Easier project setup and repeatable local runs  |

For this project, both methods work.

The manual method is useful for learning Docker basics, while Docker Compose is more convenient because the configuration is saved in `docker-compose.yml`.

Docker Compose becomes more useful when the project grows to include more services, such as a backend API, database, or cache.
