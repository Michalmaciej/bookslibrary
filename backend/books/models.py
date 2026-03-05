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
    genre = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.READ)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5
    date_read = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.author}'
