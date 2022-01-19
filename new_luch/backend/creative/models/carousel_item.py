from django.db import models
from garpix_utils.file.file_field import get_file_path
from garpix_menu.mixins import LinkMixin
from .creative_page import CreativePage


class CarouselItem(LinkMixin):
    title = models.CharField(max_length=100, verbose_name='Заголовок')
    creative_page = models.ForeignKey(CreativePage, on_delete=models.CASCADE, verbose_name='Страница (привязка)', related_name='carousel_items')
    image = models.ImageField(upload_to=get_file_path, verbose_name='Изображение')
    sort = models.PositiveSmallIntegerField(default=100, verbose_name='Сортировка')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Элемент карусели'
        verbose_name_plural = 'Элементы карусели'
        ordering = ('sort',)