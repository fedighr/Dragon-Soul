from django.db import models
from users.models import User
from store.models import Product

class UserOrders(models.Model):

    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')

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
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    user_orders = models.ForeignKey(UserOrders, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return self.name

    


        