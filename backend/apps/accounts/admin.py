from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, SeekerProfile, EmployerProfile


class SeekerProfileInline(admin.StackedInline):
    model = SeekerProfile
    can_delete = False
    verbose_name_plural = 'Seeker Profile'


class EmployerProfileInline(admin.StackedInline):
    model = EmployerProfile
    can_delete = False
    verbose_name_plural = 'Employer Profile'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active', 'date_joined']
    list_filter   = ['role', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    ordering      = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('JobHub Info', {'fields': ('role', 'phone', 'profile_picture')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('JobHub Info', {'fields': ('role', 'phone', 'email', 'first_name', 'last_name')}),
    )

    def get_inlines(self, request, obj=None):
        if obj:
            if obj.role == 'seeker':   return [SeekerProfileInline]
            if obj.role == 'employer': return [EmployerProfileInline]
        return []


@admin.register(SeekerProfile)
class SeekerProfileAdmin(admin.ModelAdmin):
    list_display  = ['user', 'location', 'experience_years', 'education']
    search_fields = ['user__username', 'user__email', 'skills', 'location']


@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display  = ['company_name', 'user', 'industry', 'location', 'company_size']
    search_fields = ['company_name', 'user__username', 'industry', 'location']
