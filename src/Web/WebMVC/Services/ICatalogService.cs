namespace Microsoft.eShopOnContainers.WebMVC.Services;
#nullable enable

public interface ICatalogService
{
    Task<Catalog> GetCatalogItems(int page, int take, int? brand, int? type, decimal? minPrice, decimal? maxPrice, string? countryCode);
    Task<IEnumerable<SelectListItem>> GetBrands();
    Task<IEnumerable<SelectListItem>> GetTypes();
}
