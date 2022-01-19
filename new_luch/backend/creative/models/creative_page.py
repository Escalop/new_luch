from django.db import models
from garpix_page.models import BasePage


class CreativePage(BasePage):
    template = "pages/creative.html"

    class Meta:
        verbose_name = "Творчество"
        verbose_name_plural = "Творчество"
        ordering = ("-created_at",)
