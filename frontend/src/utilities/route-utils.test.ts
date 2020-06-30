import { routes } from "routes";
import { siteMap } from "sitemap";
import { RouteUtils } from "utilities/route-utils";

describe("RouteUtils", () => {
    describe("#absoluteToRelativePath", () => {
        it("When path is root path, then returns empty string", () => {
            // Arrange
            const path = "https://google.com/";

            // Act
            const result = RouteUtils.absoluteToRelativePath(path);

            // Assert
            expect(result).toBe("");
        });

        it("When path has an extension, then returns the relative extension", () => {
            // Arrange
            const path = "https://google.com/some/path/extension.png";

            // Act
            const result = RouteUtils.absoluteToRelativePath(path);

            // Assert
            expect(result).toBe("some/path/extension.png");
        });
    });

    describe("#removeQueryString", () => {
        it("When there is no query string, then returns string as-is", () => {
            // Arrange
            const path = "https://google.com/path/";

            // Act
            const result = RouteUtils.removeQueryString(path);

            // Assert
            expect(result).toBe(path);
        });

        it("When there is a query string, then it is removed", () => {
            // Arrange
            const path = "https://google.com/extension/?hasQueryString=true";

            // Act
            const result = RouteUtils.removeQueryString(path);

            // Assert
            expect(result).toBe("https://google.com/extension/");
        });
    });

    describe("#getCurrentRouteDefinition", () => {
        it("When route has no route parameters, then returns correct RouteDefinition", () => {
            // Arrange
            const currentRoute = siteMap.userlogins.dashboard;
            const expectedRouteDefinition = routes.userlogins;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it("When route is nested and has no route parameters, then returns correct nested RouteDefinition", () => {
            // Arrange
            const currentRoute = siteMap.userlogins.new;
            const expectedRouteDefinition = routes.userlogins.routes.new;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it("When route has no route parameters and has no matching RouteDefinition, then returns undefined", () => {
            const currentRoute = "/does/not/exist";

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toBeUndefined();
        });

        it("When route has route parameters and matches a RouteDefinition, then returns matching RouteDefinition", () => {
            // Arrange
            const currentRoute = RouteUtils.getUrl(siteMap.share.section, {
                guid: "c6a9172e-5825-4fa9-a4c0-b58ac3fe37b6",
            });
            const expectedRouteDefinition = routes.share.routes.section;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it("When route is nested and has route params, then returns correct nested route", () => {
            // Arrange
            const currentRoute = RouteUtils.getUrl(siteMap.publications.annex, {
                publicationId: 1,
                id: 2,
            });
            const expectedRouteDefinition = routes.home.routes.annex;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it("When route has route parameters and no matching RouteDefinition, then returns undefined", () => {
            // Arrange
            const currentRoute = "/does/not/exist/:with/:params";

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toBeUndefined();
        });
    });
});
