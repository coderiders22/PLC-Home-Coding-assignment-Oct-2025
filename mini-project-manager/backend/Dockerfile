# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore as distinct layers
COPY MiniProjectManager.csproj ./
RUN dotnet restore

# copy the remaining source and publish
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Render expects the app to listen on $PORT. Use 8080 default for local.
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}

# Reduce image size and avoid ICU requirement unless needed
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

EXPOSE 8080

ENTRYPOINT ["dotnet", "MiniProjectManager.dll"]


