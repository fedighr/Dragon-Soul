from django.db import models
from users.models import User
from store.models import Product
class Order(models.Model):

    class Color(models.TextChoices):
        Red = 'Red', 'Red'
        Blue = 'Blue', 'Blue'
        White = 'White', 'White'
        Black = 'Black', 'Black'   

    class Size(models.TextChoices):
        XS = 'XS', 'Extra Small'
        S  = 'S',  'Small'
        M  = 'M',  'Medium'
        L  = 'L',  'Large'
        XL = 'XL', 'Extra Large'
        XXL = 'XXL', 'Double Extra Large'
        XXXL = 'XXXL', 'Triple Extra Large'

    name = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    color = models.CharField(max_length=30, choices=Color.choices, default=Color.White)
    size = models.CharField(max_length=5, choices=Size.choices, default=Size.L)
    image = models.CharField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return self.name