# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj first to leverage Docker layer caching
COPY TaskManagerAPI.csproj ./
RUN dotnet restore

# Copy the rest of the source
COPY . .

# Publish to a framework-dependent directory
RUN dotnet publish -c Release -o /app/out

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
