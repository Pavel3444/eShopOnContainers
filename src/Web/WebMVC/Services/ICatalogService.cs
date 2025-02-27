namespace Microsoft.eShopOnContainers.WebMVC.Services;

public interface ICatalogService
{
    Task<Catalog> GetCatalogItems(int page, int take, int? brand, int? type, decimal? minPrice, decimal? maxPrice);
    Task<IEnumerable<SelectListItem>> GetBrands();
    Task<IEnumerable<SelectListItem>> GetTypes();
}
