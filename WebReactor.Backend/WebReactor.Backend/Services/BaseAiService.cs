using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using WebReactor.Backend.Configuration;
using WebReactor.Backend.Models;

namespace WebReactor.Backend.Services;

public class BaseAiService(
    HttpClient httpClient,
    IOptions<AiSettings> settings,
    ILogger<BaseAiService> logger)
    : IAiService
{
    private readonly AiSettings _settings = settings.Value;

    public async Task<ChatResponse> GetCompletionAsync(List<ChatMessageDto> history, CancellationToken cancellationToken)
{
    try
    {
        var apiMessages = history.Select(m => new
        {
            role = m.Role.ToLower() == "ai" ? "assistant" : "user",
            content = m.Content
        }).ToList();

        apiMessages.Insert(0, new { role = "system", content = "You are a helpful and concise assistant." });

        var payload = new
        {
            model = _settings.Model,
            messages = apiMessages, 
            temperature = 0.7
        };

        var jsonContent = JsonSerializer.Serialize(payload);
        
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, _settings.ApiUrl)
        {
            Content = new StringContent(jsonContent, Encoding.UTF8, "application/json")
        };

        httpRequest.Headers.Add("Authorization", $"Bearer {_settings.ApiKey}");

        var response = await httpClient.SendAsync(httpRequest, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("AI API Error: {StatusCode}, Details: {Details}", response.StatusCode, errorBody);
            return new ChatResponse(string.Empty, false, "Ошибка внешнего провайдера ИИ.");
        }

        var responseString = await response.Content.ReadAsStringAsync(cancellationToken);
        using var doc = JsonDocument.Parse(responseString);
        
        var reply = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return new ChatResponse(reply ?? string.Empty, true);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Исключение при выполнении запроса к ИИ");
        return new ChatResponse(string.Empty, false, "Внутренняя ошибка сервера.");
    }
}
}