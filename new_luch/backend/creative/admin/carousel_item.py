from ..models.carousel_item import CarouselItem
from django.contrib import admin


class CarouselItemInline(admin.TabularInline):
    model = CarouselItem
    fk_name = 'creative_page'
    fields = ('title', 'image', 'sort', 'page', 'url')
    extra = 1
