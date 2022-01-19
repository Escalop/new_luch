from garpixcms.settings import *  # noqa

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INSTALLED_APPS += [
    # core - не удалять
    'home',
    'wrappings',
    'creative',
    'news'
    ]



STATIC_URL = '/static/'

STATICFILES_DIRS = [
    #os.path.join(BASE_DIR, '..', 'frontend', 'src', 'static'),
    os.path.join(BASE_DIR, '..', 'frontend', 'src'),
    os.path.join(BASE_DIR, '..', 'frontend', 'src', 'promo', 'static'),
    #os.path.join(BASE_DIR, 'frontend', 'source'),
]
STATIC_ROOT = os.path.join(BASE_DIR, '..', 'public', 'static')

MEDIA_ROOT = os.path.join(BASE_DIR, '..', 'public', 'media')
MEDIA_URL = '/media/'

CHOICE_MENU_TYPES = (
    ('top_menu', 'Верхнее меню Упаковка'),
    ('about_menu', 'О компании меню Упаковка'),
    ('top_menu_creative', 'Верхнее меню Творчество'),
    ('about_menu_creative', 'О компании меню Творчество'),
    ('top_menu_eng', 'Верхнее меню Английский'),
    ('about_menu_eng', 'О компании меню Английский'),
)

PAGINATION_DEFAULT_OBJECTS_ON_PAGE = 12
PAGINATION_OBJECTS_ON_PAGE_VARIANTS = (12, 24, 36, 48, 60)


PAGE_TYPES = {
    0: {
        'template': 'pages/home.html',
        'title': 'Главная страница',
        'context': 'core.page.views.home_page_context',
    },
    1: {
        'template': 'pages/default.html',
        'title': 'Обычная страница',
        'context': 'app.views.common_context',
    },
    2: {
        'template': 'pages/empty.html',
        'title': 'Пустая HTML-страница (для лендингов)',
        'context': None,
    },
    3: {
        'template': 'pages/wrappings.html',
        'title': 'Упаковка (главная)',
        'context': 'app.views.wrappings_page_context',
    },
    4: {
        'template': 'pages/about.html',
        'title': 'О компании (упаковка)',
        'context': 'app.views.about_history_context',
    },
    5: {
        'template': 'pages/wrappers/catalog.html',
        'title': 'Каталог (упаковка)',
        'context': 'catalog.product_wrappings.views.default_catalog_context',
},
}

