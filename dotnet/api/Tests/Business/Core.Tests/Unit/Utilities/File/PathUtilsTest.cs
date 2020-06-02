using Shouldly;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.CSharp.Testing.Extensions;
using AndcultureCode.GB.Business.Core.Utilities.File;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Utilities.File
{
    public class PathUtilsTest : CodesApiUnitTest
    {
        #region Setup

        public PathUtilsTest(ITestOutputHelper output) : base(output)
        {

        }

        #endregion Setup

        #region Combine(params string[] paths)

        [Fact]
        public void Combine_When_Given_Paths_With_Windows_Separator_Returns_Universally_Separated_Path()
        {
            // Arrange
            var path1 = @"C:\Users\bscot\Desktop";
            var path2 = "file.txt";
            var expectedPath = "C:/Users/bscot/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_When_Given_Paths_With_Universal_Separator_Returns_Same_Path()
        {
            // Arrange
            var path1 = "/home/users/bscott/Desktop";
            var path2 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_When_Given_Paths_With_Spaces_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = " /home /users   / bscott / ";
            var path2 = " Music And Stuff ";
            var path3 = " Theme Song.mp3 ";
            var expectedPath = "/home/users/bscott/Music And Stuff/Theme Song.mp3";

            // Act
            var result = PathUtils.Combine(path1, path2, path3);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_When_Given_Paths_With_Nulls_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = "/home/users/bscott/Desktop";
            string path2 = null;
            var path3 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(path1, path2, path3);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_When_Given_Paths_With_Multiple_Path_Separator_Styles_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = @"/home\users/bscott\Desktop/"; // What absolute madman would construct a path like this?
            var path2 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_When_Given_Paths_With_Duplicate_Neighbor_Path_Separators_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = @"/home//users///bscott////Desktop//";
            var path2 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        /// <summary>
        /// This test exists to ensure this method maintains the same behavior as System.IO.Path.Combine,
        /// which discards previous paths and uses the last absolute path found when there are multiple.
        ///
        /// See:
        /// https://docs.microsoft.com/en-us/dotnet/api/system.io.path.combine?view=netcore-3.0
        ///
        /// "paths should be an array of the parts of the path to combine. If the one of the subsequent paths is an absolute path,
        /// then the combine operation resets starting with that absolute path, discarding all previous combined paths."
        /// </summary>
        [Fact]
        public void Combine_When_Given_Absolute_Paths_After_First_Param_Resets_To_Last_Absolute_Path_Returns_Path()
        {
            // Arrange
            var path1 = @"/home/users";
            var path2 = @"/bscott/Desktop";
            var path3 = "file.txt";
            var expectedPath = "/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(path1, path2, path3);

            // Assert
            result.ShouldBe(expectedPath);
        }

        #endregion Combine(params string[] paths)

        #region Combine(bool includeTrailingSeparator = false, params string[] paths)

        [Theory]
        // Windows-style input paths without trailing separator param false (should be stripped out if it exists)
        [InlineData(false, @"C:\Users\bscot\Desktop", @"newFolder\", @"C:/Users/bscot/Desktop/newFolder")]
        [InlineData(false, @"C:\Users\bscot\Desktop\", @"newFolder", @"C:/Users/bscot/Desktop/newFolder")]
        [InlineData(false, @"C:\Users\bscot\Desktop\", @"newFolder\", @"C:/Users/bscot/Desktop/newFolder")]
        [InlineData(false, @"C:\Users\bscot\Desktop", @"newFolder", @"C:/Users/bscot/Desktop/newFolder")]
        // Windows-style input paths with trailing separator param true (should be appended if it does not exist)
        [InlineData(true, @"C:\Users\bscot\Desktop", @"newFolder", @"C:/Users/bscot/Desktop/newFolder/")]
        [InlineData(true, @"C:\Users\bscot\Desktop\", @"newFolder", @"C:/Users/bscot/Desktop/newFolder/")]
        [InlineData(true, @"C:\Users\bscot\Desktop\", @"newFolder\", @"C:/Users/bscot/Desktop/newFolder/")]
        [InlineData(true, @"C:\Users\bscot\Desktop", @"newFolder\", @"C:/Users/bscot/Desktop/newFolder/")]
        // Universal input paths without trailing separator param false (should be stripped out if it exists)
        [InlineData(false, "/home/bscott/Desktop", "newFolder/", "/home/bscott/Desktop/newFolder")]
        [InlineData(false, "/home/bscott/Desktop/", "newFolder", "/home/bscott/Desktop/newFolder")]
        [InlineData(false, "/home/bscott/Desktop/", "newFolder/", "/home/bscott/Desktop/newFolder")]
        [InlineData(false, "/home/bscott/Desktop", "newFolder", "/home/bscott/Desktop/newFolder")]
        // Universal input paths with trailing separator param true (should be appended if it does not exist)
        [InlineData(true, "/home/bscott/Desktop", "newFolder", "/home/bscott/Desktop/newFolder/")]
        [InlineData(true, "/home/bscott/Desktop/", "newFolder", "/home/bscott/Desktop/newFolder/")]
        [InlineData(true, "/home/bscott/Desktop/", "newFolder/", "/home/bscott/Desktop/newFolder/")]
        [InlineData(true, "/home/bscott/Desktop", "newFolder/", "/home/bscott/Desktop/newFolder/")]
        public void Combine_With_IncludeTrailingSeperator_Arg_Returns_Path_With_Expected_Trailing_Separator(bool includeTrailingSeparator, string path1, string path2, string expectedPath)
        {
            // Arrange & Act
            var result = PathUtils.Combine(includeTrailingSeparator: includeTrailingSeparator, path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_With_IncludeTrailingSeperator_Arg_When_Given_Paths_With_Spaces_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = " /home /users   / bscott / ";
            var path2 = " Music And Stuff ";
            var path3 = " Theme Song.mp3 ";
            var expectedPath = "/home/users/bscott/Music And Stuff/Theme Song.mp3";

            // Act
            var result = PathUtils.Combine(false, path1, path2, path3);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_With_IncludeTrailingSeperator_Arg_When_Given_Paths_With_Nulls_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = "/home/users/bscott/Desktop";
            string path2 = null;
            var path3 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(false, path1, path2, path3);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_With_IncludeTrailingSeperator_Arg_When_Given_Paths_With_Multiple_Path_Separator_Styles_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = @"/home\users/bscott\Desktop/"; // What absolute madman would construct a path like this?
            var path2 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(false, path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        [Fact]
        public void Combine_With_IncludeTrailingSeperator_Arg_When_Given_Paths_With_Duplicate_Neighbor_Path_Separators_Returns_Sanitized_Path()
        {
            // Arrange
            var path1 = @"/home//users///bscott////Desktop//";
            var path2 = "file.txt";
            var expectedPath = "/home/users/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(false, path1, path2);

            // Assert
            result.ShouldBe(expectedPath);
        }

        /// <summary>
        /// This test exists to ensure this method maintains the same behavior as System.IO.Path.Combine,
        /// which discards previous paths and uses the last absolute path found when there are multiple.
        ///
        /// See:
        /// https://docs.microsoft.com/en-us/dotnet/api/system.io.path.combine?view=netcore-3.0
        ///
        /// "paths should be an array of the parts of the path to combine. If the one of the subsequent paths is an absolute path,
        /// then the combine operation resets starting with that absolute path, discarding all previous combined paths."
        /// </summary>
        [Fact]
        public void Combine_With_IncludeTrailingSeperator_Arg_When_Given_Absolute_Paths_After_First_Param_Resets_To_Last_Absolute_Path_Returns_Path()
        {
            // Arrange
            var path1 = @"/home/users";
            var path2 = @"/bscott/Desktop";
            var path3 = "file.txt";
            var expectedPath = "/bscott/Desktop/file.txt";

            // Act
            var result = PathUtils.Combine(false, path1, path2, path3);

            // Assert
            result.ShouldBe(expectedPath);
        }

        #endregion Combine(bool includeTrailingSeparator = false, params string[] paths)
    }
}