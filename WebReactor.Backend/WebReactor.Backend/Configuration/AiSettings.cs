namespace WebReactor.Backend.Configuration;

public class AiSettings
{
    public const string SectionName = "AiSettings";

    public string ApiKey { get; set; } = string.Empty;
    public string ApiUrl { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
}