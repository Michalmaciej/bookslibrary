from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'rating', 'date_read', 'user']
    list_filter = ['status', 'rating']
    search_fields = ['title', 'author']
