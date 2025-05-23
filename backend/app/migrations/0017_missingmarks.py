# Generated by Django 5.0.3 on 2025-05-16 06:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_alter_teaching_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='MissingMarks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('missing_marks', models.BooleanField(default=False)),
                ('missing_marks_reason', models.TextField(blank=True, null=True)),
                ('resolved', models.BooleanField(default=False)),
                ('enrollment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.enrollment')),
            ],
        ),
    ]
