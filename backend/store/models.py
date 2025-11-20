from django.db import models

class Product(models.Model):

    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    description = models.TextField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name
    
class ProductColor(models.Model):
    class Color(models.TextChoices):
        Red = 'Red', 'Red'
        Blue = 'Blue', 'Blue'
        White = 'white', 'white'
        Black = 'black', 'black'   

    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)    
    color = models.CharField(max_length=30, choices=Color.choices, default=Color.White)
    image = models.ImageField(upload_to='products/',null=True)

class ProductColorSize(models.Model):

    class Size(models.TextChoices):
        XS = 'XS', 'Extra Small'
        S  = 'S',  'Small'
        M  = 'M',  'Medium'
        L  = 'L',  'Large'
        XL = 'XL', 'Extra Large'
        XXL = 'XXL', 'Double Extra Large'
        XXXL = 'XXXL', 'Triple Extra Large'

    color_id = models.ForeignKey(ProductColor, on_delete=models.CASCADE)
    size = models.CharField(max_length=5,choices=Size.choices,default=Size.M)
    stock = models.PositiveIntegerField(default=0)

