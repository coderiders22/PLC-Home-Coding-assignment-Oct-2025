# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the entire backend source and restore
COPY . .
RUN dotnet restore "TaskManagerAPI.csproj"

# Publish to a framework-dependent directory
RUN dotnet publish -c Release -o /app/out "TaskManagerAPI.csproj"

# ---------- Runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published artifacts from build stage
COPY --from=build /app/out ./

# Configure ASP.NET Core to listen on the container port
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

# Run the API
ENTRYPOINT ["dotnet", "TaskManagerAPI.dll"]
