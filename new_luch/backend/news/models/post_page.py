from ckeditor_uploader.fields import RichTextUploadingField
from django.db import models
from garpix_page.models import BasePage


class PostPage(BasePage):
    content = RichTextUploadingField(verbose_name='Содержание', blank=True, default='')
    template = "pages/post.html"

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        ordering = ("-created_at",)
