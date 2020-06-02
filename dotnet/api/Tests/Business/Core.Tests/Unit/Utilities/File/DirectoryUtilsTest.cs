using System;
using System.IO;
using System.Threading;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Business.Core.Utilities.File;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Utilities.File
{
    public class DirectoryUtilsTest : BaseUnitTest
    {

        #region Constructor

        public DirectoryUtilsTest(ITestOutputHelper output) : base(output)
        {
        }

        #endregion Constructor

        #region Delete

        [Fact]
        public void Delete_When_File_Exists_Then_File_And_Directory_Deleted()
        {
            // Arrange
            var filePath = $"Fixtures/{Guid.NewGuid().ToString()}/test.txt";
            var directory = Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            var file = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite, FileShare.Delete);
            file.Close();

            // Act
            DirectoryUtils.Delete(filePath);

            // Assert
            System.IO.File.Exists(filePath).ShouldBeFalse();
            System.IO.Directory.Exists(filePath).ShouldBeFalse();

        }

        [Fact]
        public void Delete_When_File_Does_Not_Exist_Then_Directory_Deleted()
        {
            // Arrange
            var path = $"Fixtures/{Guid.NewGuid().ToString()}";
            var directory = Directory.CreateDirectory(path);

            // Act
            DirectoryUtils.Delete(path);

            // Assert
            System.IO.Directory.Exists(path).ShouldBeFalse();
        }

        [Fact]
        public void Delete_When_Path_Not_Found_Then_Exit()
        {
            // Arrange
            var path = "Tests";

            // Act
            DirectoryUtils.Delete(path);

            // Assert
            System.IO.Directory.Exists(path).ShouldBeFalse();
        }


        #endregion Delete

    }
}