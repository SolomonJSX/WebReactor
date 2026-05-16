using WebReactor.Backend.Configuration;
using WebReactor.Backend.Endpoints;
using WebReactor.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", 
                "http://localhost:5173",
                "https://webreactor-ai-chat.onrender.com"
            ) 
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.Configure<AiSettings>(builder.Configuration.GetSection("AiSettings"));

builder.Services.AddHttpClient<IAiService, BaseAiService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

// 5. Маппинг эндпоинтов
app.MapChatEndpoints();

app.Run();
