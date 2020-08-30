using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Data.SqlServer.Migrations
{
    public partial class CreateUserMetadata : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserMetadata",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTimeOffset>(nullable: true),
                    DeletedById = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTimeOffset>(nullable: true),
                    UpdatedById = table.Column<long>(nullable: true),
                    UpdatedOn = table.Column<DateTimeOffset>(nullable: true),
                    IsNameEditable = table.Column<bool>(nullable: false, defaultValue: false),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    RoleId = table.Column<long>(nullable: true),
                    Type = table.Column<int>(nullable: true),
                    UserId = table.Column<long>(nullable: false),
                    Value = table.Column<string>(maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMetadata", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMetadata_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserMetadata_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserMetadata_RoleId",
                table: "UserMetadata",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMetadata_UserId",
                table: "UserMetadata",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMetadata_Name_RoleId_Type_UserId",
                table: "UserMetadata",
                columns: new[] { "Name", "RoleId", "Type", "UserId" },
                unique: true,
                filter: "[DeletedOn] IS NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserMetadata");
        }
    }
}
