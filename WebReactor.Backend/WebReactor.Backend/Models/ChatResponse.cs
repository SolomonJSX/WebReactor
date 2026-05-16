namespace WebReactor.Backend.Models;

public record ChatResponse(string Reply, bool IsSuccess, string? ErrorMessage = null);