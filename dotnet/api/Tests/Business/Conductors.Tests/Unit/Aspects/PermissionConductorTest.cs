using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Testing.Extensions;
using Moq;
using AndcultureCode.GB.Business.Conductors.Aspects;
using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.GB.Business.Core.Models.Entities.Acls;
using AndcultureCode.GB.Business.Core.Models.Security;
using AndcultureCode.GB.Testing.Factories.Models.Entities.Acls;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Conductors.Tests.Unit.Aspects
{
    public class PermissionConductorTest : ConductorUnitTest
    {

        #region Properties

        const string RESOURCE_DOESNT_EXIST = "Doesnt.Exist";
        const string RESOURCE_OTHER_OBJECT = "Other.Object";
        const string RESOURCE_TEST_OBJECT = "Test.Object";
        const string VERB_DOESNT_EXIST = "DoesntExist";
        const string VERB_READ = "Read";
        const string SUBJECT_DEFAULT = "1";
        const string SUBJECT_SECONDARY = "2";

        PermissionConductor _sut;
        List<Acl> _acls;
        IRepository<Acl> _aclRepositoryMock;

        #endregion Properties

        #region Setup

        public PermissionConductorTest(ITestOutputHelper output) : base(output)
        {
            SetupConductor(new List<Acl> { Build<Acl>() });
        }

        void SetupConductor(IEnumerable<Acl> acls)
        {
            _acls = new List<Acl>();
            _acls.AddRange(acls);

            _aclRepositoryMock = Mock.Of<IRepository<Acl>>();
            Mock.Get(_aclRepositoryMock).Setup(
                    m => m.FindAll(
                        It.IsAny<Expression<Func<Acl, bool>>>(),
                        It.IsAny<Func<IQueryable<Acl>, IOrderedQueryable<Acl>>>(),
                        It.IsAny<string>(),
                        It.IsAny<int?>(),
                        It.IsAny<int?>(),
                        It.IsAny<bool?>(),
                        It.IsAny<bool>()
                    )
                )
                .Returns((Expression<Func<Acl, bool>> filter, Func<IQueryable<Acl>, IOrderedQueryable<Acl>> orderBy, string includeProperties, int? skip, int? take, bool? ignoreQueryFilters, bool asNoTracking) =>
                    new Result<IQueryable<Acl>>
                    {
                        ResultObject = _acls
                        .Where(filter.Compile())
                        .AsQueryable()
                    });

            _sut = new PermissionConductor(_aclRepositoryMock, GetLogger<PermissionConductor>());
        }

        #endregion Setup

        #region GetAcls

        [Fact]
        public void GetAcls_Returns_Matching_Entries()
        {
            // Arrange
            _acls.Add(Build<Acl>(AclFactory.DENY));
            _acls.Add(Build<Acl>(a => a.Resource = RESOURCE_OTHER_OBJECT));

            // Act
            var result = _sut.GetAcls(RESOURCE_TEST_OBJECT, VERB_READ);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();

            result.ResultObject.Count.ShouldBe(2);
            result.ResultObject.Any(a => a.Permission == Permission.Allow).ShouldBeTrue();
            result.ResultObject.Any(a => a.Permission == Permission.Deny).ShouldBeTrue();
        }

        [Fact]
        public void GetAcls_Returns_Empty_List_When_Resource_Doesnt_Exist()
        {
            // Arrange & Act
            var result = _sut.GetAcls(RESOURCE_DOESNT_EXIST, VERB_READ);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();

            result.ResultObject.ShouldNotBeNull();
            result.ResultObject.Count.ShouldBe(0);
        }

        [Fact]
        public void GetAcls_Returns_Empty_List_When_Verb_Doesnt_Exist()
        {
            // Arrange & Act
            var result = _sut.GetAcls(RESOURCE_TEST_OBJECT, VERB_DOESNT_EXIST);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();

            result.ResultObject.ShouldNotBeNull();
            result.ResultObject.Count.ShouldBe(0);
        }

        [Fact]
        public void GetAcls_Returns_Error_When_Resource_Empty()
        {
            // Arrange & Act
            var result = _sut.GetAcls(string.Empty, VERB_READ);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldHaveErrorsFor(
                property: PermissionConductor.RESOURCE_NULL_ARGUMENT_EXCEPTION_KEY,
                exactCount: 1,
                containedInMessage: PermissionConductor.RESOURCE_NULL_ARGUMENT_EXCEPTION_MESSAGE);

            result.ResultObject.ShouldNotBeNull();
            result.ResultObject.Count.ShouldBe(0);
        }

        [Fact]
        public void GetAcls_Returns_Error_When_Verb_Empty()
        {
            // Arrange & Act
            var result = _sut.GetAcls(RESOURCE_TEST_OBJECT, string.Empty);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldHaveErrorsFor(
                property: PermissionConductor.VERB_NULL_ARGUMENT_EXCEPTION_KEY,
                exactCount: 1,
                containedInMessage: PermissionConductor.VERB_NULL_ARGUMENT_EXCEPTION_MESSAGE);

            result.ResultObject.ShouldNotBeNull();
            result.ResultObject.Count.ShouldBe(0);
        }

        #endregion GetAcls

        #region IsAllowed(string resource, string verb, string subject)

        [Fact]
        public void IsAllowed_When_Allowed_Returns_True()
        {
            // Arrange & Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeTrue();
        }

        [Fact]
        public void IsAllowed_When_Allowed_For_Specific_Subject_Returns_True()
        {
            // Arrange
            _acls.Clear();
            _acls.Add(Build<Acl>(a => a.Subject = SUBJECT_DEFAULT));

            // Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeTrue();
        }

        [Fact]
        public void IsAllowed_When_Denied_For_All_Subjects_But_Allowed_For_Specific_Subject_Returns_True()
        {
            // Arrange
            _acls.Clear();
            _acls.Add(Build<Acl>(AclFactory.DENY));
            _acls.Add(Build<Acl>(a => a.Subject = SUBJECT_DEFAULT));

            // Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeTrue();
        }

        [Fact]
        public void IsAllowed_When_Denied_For_All_Subjects_Returns_False()
        {
            // Arrange
            _acls.Add(Build<Acl>(AclFactory.DENY));

            // Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeFalse();
        }

        [Fact]
        public void IsAllowed_When_Allowed_For_All_Subjects_But_Denied_For_Specific_Subject_Returns_False()
        {
            // Arrange
            _acls.Add(Build<Acl>("Deny", a => a.Subject = SUBJECT_DEFAULT));

            // Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeFalse();
        }

        [Fact]
        public void IsAllowed_When_Denied_For_Specific_Subject_Returns_True()
        {
            // Arrange
            _acls.Add(Build<Acl>("Deny", a => a.Subject = SUBJECT_DEFAULT));

            // Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeFalse();
        }

        [Fact]
        public void IsAllowed_When_Resource_Empty_Returns_Error()
        {
            // Arrange & Act
            var result = _sut.IsAllowed(string.Empty, VERB_READ, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldHaveErrorsFor(
                property: PermissionConductor.RESOURCE_NULL_ARGUMENT_EXCEPTION_KEY,
                exactCount: 1,
                containedInMessage: PermissionConductor.RESOURCE_NULL_ARGUMENT_EXCEPTION_MESSAGE);
            result.ResultObject.ShouldBeFalse();
        }

        [Fact]
        public void IsAllowed_When_Verb_Empty_Returns_Error()
        {
            // Arrange & Act
            var result = _sut.IsAllowed(RESOURCE_TEST_OBJECT, string.Empty, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldHaveErrorsFor(
                property: PermissionConductor.VERB_NULL_ARGUMENT_EXCEPTION_KEY,
                exactCount: 1,
                containedInMessage: PermissionConductor.VERB_NULL_ARGUMENT_EXCEPTION_MESSAGE);
            result.ResultObject.ShouldBeFalse();
        }

        #endregion IsAllowed(string resource, string verb, string subject)

        #region IsAllowed(LogicalOperator op, IEnumerable<ResourceVerb> resourceVerbs, string subject)

        [Fact]
        public void IsAllowed_When_ResourceVerbs_Is_Empty_It_Returns_False()
        {
            // Arrange
            var emptyResourceVerbList = new List<ResourceVerb>();

            // Act
            var result = _sut.IsAllowed(BitwiseOperator.And, emptyResourceVerbList, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeFalse();
        }

        [Fact]
        public void IsAllowed_When_Op_Is_OR_And_At_Least_One_Action_Is_Allowed_It_Returns_True()
        {
            // Arrange
            var resourceVerbs = new List<ResourceVerb>{
                new ResourceVerb(RESOURCE_TEST_OBJECT, VERB_READ),
                new ResourceVerb(RESOURCE_OTHER_OBJECT, VERB_READ)
            };

            _acls.Clear();
            _acls.Add(Build<Acl>("Deny", a => a.Subject = SUBJECT_DEFAULT));
            _acls.Add(Build<Acl>(
                a => a.Resource = RESOURCE_OTHER_OBJECT,
                a => a.Subject = SUBJECT_DEFAULT
            ));

            // Assert
            var result = _sut.IsAllowed(BitwiseOperator.Or, resourceVerbs, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeTrue();
        }

        [Fact]
        public void IsAllowed_When_Op_Is_OR_And_No_Action_Is_Allowed_It_Returns_False()
        {
            // Arrange
            var resourceVerbs = new List<ResourceVerb>{
                new ResourceVerb(RESOURCE_TEST_OBJECT, VERB_READ),
                new ResourceVerb(RESOURCE_OTHER_OBJECT, VERB_READ)
            };

            _acls.Clear();
            _acls.Add(Build<Acl>("Deny", a => a.Subject = SUBJECT_DEFAULT));
            _acls.Add(Build<Acl>(
                "Deny",
                a => a.Resource = RESOURCE_OTHER_OBJECT,
                a => a.Subject = SUBJECT_DEFAULT
            ));

            // Assert
            var result = _sut.IsAllowed(BitwiseOperator.Or, resourceVerbs, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeFalse();
        }

        [Fact]
        public void IsAllowed_When_Op_Is_OR_And_All_Actions_Are_Allowed_It_Returns_True()
        {
            // Arrange
            var resourceVerbs = new List<ResourceVerb>{
                new ResourceVerb(RESOURCE_TEST_OBJECT, VERB_READ),
                new ResourceVerb(RESOURCE_OTHER_OBJECT, VERB_READ)
            };

            _acls.Clear();
            _acls.Add(Build<Acl>(a => a.Subject = SUBJECT_DEFAULT));
            _acls.Add(Build<Acl>(
                a => a.Resource = RESOURCE_OTHER_OBJECT,
                a => a.Subject = SUBJECT_DEFAULT
            ));

            // Assert
            var result = _sut.IsAllowed(BitwiseOperator.And, resourceVerbs, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeTrue();
        }

        [Fact]
        public void IsAllowed_When_Op_Is_AND_And_At_Least_One_Action_Is_Denied_It_Returns_False()
        {
            // Arrange
            var resourceVerbs = new List<ResourceVerb>{
                new ResourceVerb(RESOURCE_TEST_OBJECT, VERB_READ),
                new ResourceVerb(RESOURCE_OTHER_OBJECT, VERB_READ)
            };

            _acls.Clear();
            _acls.Add(Build<Acl>(a => a.Subject = SUBJECT_DEFAULT));
            _acls.Add(Build<Acl>(
                "Deny",
                a => a.Resource = RESOURCE_OTHER_OBJECT,
                a => a.Subject = SUBJECT_DEFAULT
            ));

            // Assert
            var result = _sut.IsAllowed(BitwiseOperator.And, resourceVerbs, SUBJECT_DEFAULT);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeFalse();
        }

        #endregion IsAllowed(LogicalOperator op, IEnumerable<ResourceVerb> resourceVerbs, string subject)
    }
}
