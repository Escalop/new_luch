from django.db import models
from garpix_page.models import BasePage


class WrappingsPage(BasePage):
    template = "pages/wrappings.html"

    class Meta:
        verbose_name = "Упаковка"
        verbose_name_plural = "Упаковка"
        ordering = ("-created_at",)
