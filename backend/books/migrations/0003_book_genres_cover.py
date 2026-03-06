from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0002_book_pages_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='genre',
        ),
        migrations.AddField(
            model_name='book',
            name='genres',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='book',
            name='cover_url',
            field=models.TextField(blank=True),
        ),
    ]
