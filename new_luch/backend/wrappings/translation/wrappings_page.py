from modeltranslation.translator import TranslationOptions, register
from ..models import WrappingsPage


@register(WrappingsPage)
class WrappingsPageTranslationOptions(TranslationOptions):
    pass
