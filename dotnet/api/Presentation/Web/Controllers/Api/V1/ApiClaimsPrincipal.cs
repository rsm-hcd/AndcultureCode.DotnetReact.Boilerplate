namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1
{
    public class ApiClaimsPrincipal
    {
        public virtual bool IsAuthenticated { get => UserId.HasValue; }
        public virtual bool IsSuperAdmin { get; set; }
        public virtual bool IsUnauthenticated { get => !IsAuthenticated; }
        public virtual long? RoleId { get; set; }
        public virtual string[] RoleIds { get; set; }
        public virtual long? UserId { get; set; }
        public virtual long? UserLoginId { get; set; }
    }
}