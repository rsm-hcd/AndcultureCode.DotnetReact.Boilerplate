using System;
using System.Text.RegularExpressions;
using FluentValidation;
using Newtonsoft.Json;
using AndcultureCode.GB.Business.Core.Utilities.Network;
using AndcultureCode.GB.Business.Core.Utilities.Security;
using AndcultureCode.GB.Presentation.Web.Models.Dtos;

namespace AndcultureCode.GB.Presentation.Web.Validators
{
    public abstract class DtoAbstractValidator<T> : AbstractValidator<T>
    {
        protected bool BeGreaterThan0<TDto>(TDto dto, long value)
        {
            return value > 0;
        }

        protected bool BeGreaterThan0WhenSet<TDto>(TDto dto, long? value)
        {
            return value == null || value > 0;
        }

        protected bool BeGreaterThanOrEqualTo0WhenSet<TDto>(TDto dto, int? value)
        {
            return value == null || value >= 0;
        }

        protected bool BeGreaterThanOrEqualTo0WhenSet<TDto>(TDto dto, decimal? value)
        {
            return value == null || value >= 0;
        }

        protected bool BeNullWhenNewRecord<TDto>(TDto dto, string value) where TDto : EntityDto
        {
            return (dto.Id != null && dto.Id > 0) || string.IsNullOrWhiteSpace(value);
        }

        protected bool BeSetWhenPersisted<TDto>(TDto dto, string value) where TDto : EntityDto
        {
            return dto.Id == null || dto.Id == 0 || !string.IsNullOrWhiteSpace(value);
        }

        protected bool BeValidGuidWhenSet<TDto>(TDto dto, string value)
        {
            return string.IsNullOrWhiteSpace(value) || GuidUtil.IsValid(value);
        }

        protected bool BeValidHttpUrlWhenSet<TDto>(TDto dto, string value)
        {
            return !(!string.IsNullOrWhiteSpace(value) && !UriUtil.IsValidHttpUrl(value));
        }

        protected bool OnlyContainAlphanumericCharacters<TDto>(TDto dto, string value) where TDto : EntityDto
        {
            return !(value == null || !Regex.IsMatch(value, @"^[a-zA-Z0-9]*$"));
        }

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
        {
            return DateTime.Compare(startDate.Date, endDate.Date) <= 0;
        }

        protected bool EndTimeLaterThanStartTime(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            return DateTime.Compare(startDate.DateTime, endDate.DateTime) < 0;
        }

        protected bool BeValidUSPostalCode<TDto>(TDto dto, string value) where TDto : EntityDto
        {
            return value != null && Regex.IsMatch(value, @"^\d{5}(?:[-\s]\d{4})?$");
        }
    }
}
