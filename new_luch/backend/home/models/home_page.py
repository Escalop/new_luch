from django.db import models
from garpix_page.models import BasePage


class HomePage(BasePage):
    template = "pages/home.html"

    class Meta:
        verbose_name = "Home"
        verbose_name_plural = "Homes"
        ordering = ("-created_at",)
