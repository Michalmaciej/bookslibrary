from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'genres', 'cover_url', 'status',
            'rating', 'total_pages', 'current_page',
            'date_read', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value is not None:
            if not (0 <= value <= 10):
                raise serializers.ValidationError('Ocena musi być między 0 a 10.')
            if (value * 2) != int(value * 2):
                raise serializers.ValidationError('Ocena musi być wielokrotnością 0.5.')
        return value

    def validate_genres(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Genres must be a list.')
        return value

    def validate(self, data):
        total = data.get('total_pages') or (self.instance and self.instance.total_pages)
        current = data.get('current_page') or (self.instance and self.instance.current_page)
        if total is not None and current is not None and current > total:
            raise serializers.ValidationError({'current_page': 'Aktualna strona nie może przekraczać liczby stron.'})
        return data
