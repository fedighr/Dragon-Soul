from django.db import models
from order.models import UserOrders

class Payment(models.Model):

    class Status(models.TextChoices):
        Pending = 'pending', 'Pending'
        Completed = 'completed', 'Completed'
        Canceled = 'cancelled', 'Canceled'
        Processing = 'processing', 'Processing'
        Refunded = 'refunded', 'Refunded'

    class Method(models.TextChoices):
        Card = 'card', 'Card'
        Paypal = 'paypal', 'Paypal'
        Cash = 'cash', 'Cash'

    class Currency(models.TextChoices):
        USD = 'usd', 'USD'
        EUR = 'eur', 'EUR'
        TND = 'tnd', 'TND'    

    amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)    
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.TND)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.Pending)
    method = models.CharField(max_length=10, choices=Method.choices, default=Method.Cash)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    orders = models.OneToOneField(UserOrders, on_delete=models.CASCADE)


