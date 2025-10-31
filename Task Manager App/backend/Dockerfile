# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the entire backend source
COPY . .

# Publish (includes restore) using explicit path
RUN dotnet publish ./TaskManagerAPI.csproj -c Release -o /app/out

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
