from django.urls import path

from . import views

app_name = 'index'
urlpatterns = [
    path('', views.index, name='main'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('signup/', views.sign_up, name='signup'),
    path('new/<int:user_id>/<str:desc>/<str:addr>/', views.add_device, name='new')
]