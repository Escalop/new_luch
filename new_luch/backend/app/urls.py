from django.conf.urls import url
from garpixcms.urls import *  # noqa

from django.views.static import serve
from django.conf.urls.static import static

urlpatterns = [
    #path('', include('home.urls')),
              ] + urlpatterns  # noqa

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += [
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]