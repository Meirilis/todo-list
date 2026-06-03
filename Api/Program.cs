using Api.Data;
using Api.Extensions.DependencyInjection;
using Api.Helpers;
using Api.Middlewares;
using Api.Security.Jwt;
using DotNetEnv;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;

Env.Load();

var logger = Logger.LogToConsole("Startup");

var builder = WebApplication.CreateBuilder(args);

// --- Kestrel ---
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(EnvLoader.GetEnv("API_PORT")));
});

// --- DbContext ---
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseNpgsql(
        $"Host={EnvLoader.GetEnv("DB_HOST")};" +
        $"Port={EnvLoader.GetEnv("DB_PORT")};" +
        $"Username={EnvLoader.GetEnv("DB_USER")};" +
        $"Password={EnvLoader.GetEnv("DB_PASSWORD")};" +
        $"Database={EnvLoader.GetEnv("DB_NAME")}"
    )
);

// --- DependencyInjection ---
builder.Services
    .AddRepositories(logger)
    .AddValidators(logger)
    .AddInfrastructure()
    .AddApplicationServices(logger);

// --- Controllers / CORS / Swagger ---
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(EnvLoader.GetEnv("WEB_APP_URL"))
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
    );
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe o token JWT no formato: Bearer {seu token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});

var app = builder.Build();

// --- Seed Data ---
await app.UseDbInitializerAsync();

// --- Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandlerMiddleware();
app.UseCors("FrontendPolicy");
app.UseJwtAuthentication();
app.UseRequireAuthorization();
app.UseValidateUserPermissions();
app.MapControllers();

app.Run();
