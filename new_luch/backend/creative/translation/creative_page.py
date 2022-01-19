from modeltranslation.translator import TranslationOptions, register
from ..models import CreativePage


@register(CreativePage)
class CreativePageTranslationOptions(TranslationOptions):
    pass
