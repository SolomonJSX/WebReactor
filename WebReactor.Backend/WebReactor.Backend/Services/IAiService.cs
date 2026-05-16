using WebReactor.Backend.Models;

namespace WebReactor.Backend.Services;

public interface IAiService
{
    Task<ChatResponse> GetCompletionAsync(List<ChatMessageDto> history, CancellationToken cancellationToken);
}