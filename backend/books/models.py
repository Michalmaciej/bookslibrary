from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    class Status(models.TextChoices):
        READ = 'read', 'Przeczytana'
        READING = 'reading', 'Czytam'
        TO_READ = 'to_read', 'Do przeczytania'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genres = models.JSONField(default=list, blank=True)
    cover_url = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.READ)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)  # 0–10, step 0.5
    total_pages = models.PositiveIntegerField(null=True, blank=True)
    current_page = models.PositiveIntegerField(null=True, blank=True)
    date_read = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.author}'
