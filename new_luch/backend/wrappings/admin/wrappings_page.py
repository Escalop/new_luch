from ..models.wrappings_page import WrappingsPage
from django.contrib import admin
from garpix_page.admin import BasePageAdmin


@admin.register(WrappingsPage)
class WrappingsPageAdmin(BasePageAdmin):
    pass
