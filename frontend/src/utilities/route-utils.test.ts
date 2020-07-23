import { routes } from "routes";
import { siteMap } from "sitemap";
import { RouteUtils } from "utilities/route-utils";

describe("RouteUtils", () => {
    // -----------------------------------------------------------------------------------------
    // #region absoluteToRelativePath
    // -----------------------------------------------------------------------------------------

    describe("#absoluteToRelativePath", () => {
        it("when path is root path, then returns empty string", () => {
            // Arrange
            const path = "https://google.com/";

            // Act
            const result = RouteUtils.absoluteToRelativePath(path);

            // Assert
            expect(result).toBe("");
        });

        it("when path has an extension, then returns the relative extension", () => {
            // Arrange
            const path = "https://google.com/some/path/extension.png";

            // Act
            const result = RouteUtils.absoluteToRelativePath(path);

            // Assert
            expect(result).toBe("some/path/extension.png");
        });
    });

    // #endregion absoluteToRelativePath

    // -----------------------------------------------------------------------------------------
    // #region removeQueryString
    // -----------------------------------------------------------------------------------------

    describe("#removeQueryString", () => {
        it("when there is no query string, then returns string as-is", () => {
            // Arrange
            const path = "https://google.com/path/";

            // Act
            const result = RouteUtils.removeQueryString(path);

            // Assert
            expect(result).toBe(path);
        });

        it("when there is a query string, then it is removed", () => {
            // Arrange
            const path = "https://google.com/extension/?hasQueryString=true";

            // Act
            const result = RouteUtils.removeQueryString(path);

            // Assert
            expect(result).toBe("https://google.com/extension/");
        });
    });

    // #endregion removeQueryString

    // -----------------------------------------------------------------------------------------
    // #region getCurrentRouteDefinition
    // -----------------------------------------------------------------------------------------

    describe("#getCurrentRouteDefinition", () => {
        // TODO: https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/issues/32
        it.skip("when route has no route parameters, then returns correct RouteDefinition", () => {
            // Arrange
            const currentRoute = siteMap.userlogins.index;
            const expectedRouteDefinition = routes.userlogins;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it.skip("when route is nested and has no route parameters, then returns correct nested RouteDefinition", () => {
            // Arrange
            const currentRoute = siteMap.userlogins.new;
            const expectedRouteDefinition = routes.userlogins.routes.new;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it.skip("when route has no route parameters and has no matching RouteDefinition, then returns undefined", () => {
            const currentRoute = "/does/not/exist";

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toBeUndefined();
        });

        it.skip("when route has route parameters and matches a RouteDefinition, then returns matching RouteDefinition", () => {
            // Arrange
            const currentRoute = RouteUtils.getUrl(
                "TODO: Dynamically add/remove route for test",
                {
                    id: 10,
                }
            );
            const expectedRouteDefinition = routes.share.routes.section;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it.skip("when route is nested and has route params, then returns correct nested route", () => {
            // Arrange
            const currentRoute = RouteUtils.getUrl(
                "TODO: Dynamically add/remove route for test",
                {
                    id: 2,
                }
            );
            const expectedRouteDefinition = routes.home.routes.annex;

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toStrictEqual(expectedRouteDefinition);
        });

        it("when route has route parameters and no matching RouteDefinition, then returns undefined", () => {
            // Arrange
            const currentRoute = "/does/not/exist/:with/:params";

            // Act
            const result = RouteUtils.getCurrentRouteDefinition(currentRoute);

            // Assert
            expect(result).toBeUndefined();
        });
    });

    // #endregion getCurrentRouteDefinition
});
