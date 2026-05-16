using WebReactor.Backend.Models;
using WebReactor.Backend.Services;

namespace WebReactor.Backend.Endpoints;

public static class ChatEndpoints
{
    public static void MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/chat");

        group.MapPost("/", async (ChatHistoryRequest request, IAiService aiService, CancellationToken cancellationToken) =>
        {
            if (request.Messages == null || request.Messages.Count == 0)
            {
                return Results.BadRequest(new ChatResponse(string.Empty, false, "История сообщений пуста."));
            }

            var result = await aiService.GetCompletionAsync(request.Messages, cancellationToken);

            return result.IsSuccess 
                ? Results.Ok(result) 
                : Results.Json(result, statusCode: 502);
        });
    }
}