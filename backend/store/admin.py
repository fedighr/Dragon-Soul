import nested_admin
from django.contrib import admin
from .models import Product, ProductColor, ProductColorSize


class ProductColorSizeInline(nested_admin.NestedTabularInline):
    model = ProductColorSize
    extra = 1

class ProductColorInline(nested_admin.NestedTabularInline):
    model = ProductColor
    inlines = [ProductColorSizeInline]
    extra = 1

class ProductAdmin(nested_admin.NestedModelAdmin):
    model = Product
    inlines = [ProductColorInline]

admin.site.register(Product, ProductAdmin)
