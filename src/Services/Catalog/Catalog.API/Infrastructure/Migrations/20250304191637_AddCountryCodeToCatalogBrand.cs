using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCountryCodeToCatalogBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                table: "CatalogBrand",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "GBR");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "CatalogBrand");
        }
    }
}
