from django.db import models

class Camera(models.Model):
    ENTRY = 'entry'
    EXIT = 'exit'
    TYPE_CHOICES = [
        (ENTRY, 'Entry'),
        (EXIT, 'Exit'),
    ]
    
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=5, choices=TYPE_CHOICES, default=ENTRY)
    fps = models.IntegerField(default=30)
    url = models.URLField()
    operational = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"