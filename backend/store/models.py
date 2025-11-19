from django.db import models

class Product(models.Model):

    class Size(models.TextChoices):
        XS = 'XS', 'Extra Small'
        S  = 'S',  'Small'
        M  = 'M',  'Medium'
        L  = 'L',  'Large'
        XL = 'XL', 'Extra Large'
        XXL = 'XXL', 'Double Extra Large'
        XXXL = 'XXXL', 'Triple Extra Large'

    class Color(models.TextChoices):
        Red = 'Red', 'Red'
        Blue = 'Blue', 'Blue'
        White = 'white', 'white'
        Black = 'black', 'black'   

    name = models.CharField(max_length=100)
    size = models.CharField(max_length=5,choices=Size.choices,default=Size.M)
    color = models.CharField(max_length=30, choices=Color.choices,default=Color.White) 
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    stock = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    image = models.ImageField(upload_to='products/',null=True)

    def __str__(self):
        return f"{self.name} ({self.size}) - {self.color}"