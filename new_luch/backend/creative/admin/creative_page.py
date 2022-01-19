from ..models.creative_page import CreativePage
from django.contrib import admin
from garpix_page.admin import BasePageAdmin
from .carousel_item import CarouselItemInline

@admin.register(CreativePage)
class CreativePageAdmin(BasePageAdmin):
    inlines = (CarouselItemInline,)
