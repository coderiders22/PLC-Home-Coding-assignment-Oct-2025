using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add controller support
builder.Services.AddControllers();

// ✅ Enable Swagger / OpenAPI (for testing your routes)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Allow React frontend (CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ✅ Enable Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Allow CORS
app.UseCors("AllowAll");

// ✅ Redirect HTTP → HTTPS (optional)
app.UseHttpsRedirection();

// ✅ Map controller routes
app.MapControllers();

app.Run();
