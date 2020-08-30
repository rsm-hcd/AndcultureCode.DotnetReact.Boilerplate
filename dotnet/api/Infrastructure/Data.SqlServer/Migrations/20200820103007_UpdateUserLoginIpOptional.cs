using Microsoft.EntityFrameworkCore.Migrations;

namespace Data.SqlServer.Migrations
{
    public partial class UpdateUserLoginIpOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Ip",
                table: "UserLogins",
                maxLength: 39,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(39)",
                oldMaxLength: 39);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Ip",
                table: "UserLogins",
                type: "nvarchar(39)",
                maxLength: 39,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 39,
                oldNullable: true);
        }
    }
}
