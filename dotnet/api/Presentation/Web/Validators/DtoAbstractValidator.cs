using System;
using System.Text.RegularExpressions;
using FluentValidation;
using Newtonsoft.Json;
using AndcultureCode.GB.Presentation.Web.Models.Dtos;
using AndcultureCode.CSharp.Core.Utilities.Network;
using AndcultureCode.CSharp.Core.Utilities.Security;

namespace AndcultureCode.GB.Presentation.Web.Validators
{
    public abstract class DtoAbstractValidator<T> : AbstractValidator<T>
    {
        protected bool BeGreaterThan0<TDto>(TDto dto, long value) => value > 0;
        protected bool BeGreaterThan0WhenSet<TDto>(TDto dto, long? value) => value == null || value > 0;

        protected bool BeGreaterThanOrEqualTo0WhenSet<TDto>(TDto dto, int? value) => value == null || value >= 0;
        protected bool BeGreaterThanOrEqualTo0WhenSet<TDto>(TDto dto, decimal? value) => value == null || value >= 0;

        protected bool BeNullWhenNewRecord<TDto>(TDto dto, string value) where TDto : EntityDto
            => (dto.Id != null && dto.Id > 0) || string.IsNullOrWhiteSpace(value);

        protected bool BeSetWhenPersisted<TDto>(TDto dto, string value) where TDto : EntityDto
            => dto.Id == null || dto.Id == 0 || !string.IsNullOrWhiteSpace(value);

        protected bool BeValidGuidWhenSet<TDto>(TDto dto, string value)
            => string.IsNullOrWhiteSpace(value) || GuidUtils.IsValid(value);

        protected bool BeValidHttpUrlWhenSet<TDto>(TDto dto, string value)
            => !(!string.IsNullOrWhiteSpace(value) && !UriUtils.IsValidHttpUrl(value));

        protected bool BeValidJson<TDto>(TDto dto, string value)
        {
            if (value == null)
            {
                return true;
            }

            try
            {
                JsonConvert.DeserializeObject(value);
                return true;
            }
            catch
            {
                return false;
            }
        }

        protected bool EndDateLaterThanOrEqualToStartDate(DateTimeOffset startDate, DateTimeOffset endDate)
            => DateTime.Compare(startDate.Date, endDate.Date) <= 0;

        protected bool EndTimeLaterThanStartTime(DateTimeOffset startDate, DateTimeOffset endDate)
            => DateTime.Compare(startDate.DateTime, endDate.DateTime) < 0;

        protected bool BeValidUSPostalCode<TDto>(TDto dto, string value) where TDto : EntityDto
            => value != null && Regex.IsMatch(value, @"^\d{5}(?:[-\s]\d{4})?$");

        protected bool OnlyContainAlphanumericCharacters<TDto>(TDto dto, string value) where TDto : EntityDto
            => !(value == null || !Regex.IsMatch(value, @"^[a-zA-Z0-9]*$"));
    }
}
