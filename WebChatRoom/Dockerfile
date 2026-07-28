# Use the official .NET 8.0 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy everything and restore as distinct layers
COPY . ./
RUN dotnet restore "./WebChatRoom/WebChatRoom.csproj"

# Build the application
RUN dotnet publish "./WebChatRoom/WebChatRoom.csproj" -c Release -o out

# Use the .NET 8.0 runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose port 80
EXPOSE 80

# Set the environment variable for the port
ENV ASPNETCORE_URLS=http://+:80

# Set the entry point to run the API
ENTRYPOINT ["dotnet", "WebChatRoom.dll"]