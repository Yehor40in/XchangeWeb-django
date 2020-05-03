from django.shortcuts import render
from django.urls import reverse
from django.utils import timezone
from django.db.models import Q
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth.hashers import make_password, check_password

from .models import User, Device
from .forms import LoginForm, RegForm

import json
import re

def index(request):

    try:
        user = User.objects.get(login=request.session['user_login'])
        devices = user.device_set.all()
    except:
        return HttpResponseRedirect(reverse('index:login'), request)

    return render(request, 'index.html', {'devices' : devices, 'user_login' : request.session['user_login']})


def login(request):

    if request.method == 'GET':
        return render(request, 'login.html', {'login_form' : LoginForm(), 'reg_form' : RegForm()})

    elif request.method == 'POST':
        errors = []
        form = LoginForm(request.POST)

        if form.is_valid():
            login = form.cleaned_data['login']
            password = form.cleaned_data['password'] 
            
            try:
                user = User.objects.get(login=login)

                if check_password(password, user.password):
                    request.session['user_login'] = login
                    return HttpResponseRedirect(reverse('index:main'), request)
                else:
                    errors.append('Incorrect login or password!')

            except User.DoesNotExist:
                errors.append(f'No such user \'{login}\'')

    return render(request, 'login.html', {'login_errors' : errors, 'login_form' : form, 'reg_form' : RegForm()})


def sign_up(request):

    if request.method == 'POST':
        errors = []
        form = RegForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            login = form.cleaned_data['login']
            password = form.cleaned_data['password']
            rpt_password = form.cleaned_data['rpt_password']

            try:
                user = User.objects.get(Q(email=email) | Q(login=login))
                errors.append('User with such email or login is already registered!')
                return render(request, 'login.html', {'signup_errors' : errors, 'login_form' : LoginForm(), 'reg_form' : form})

            except User.DoesNotExist:
                if password != rpt_password:
                    errors.append('Password does not math repeated one!')
                
                if not errors:
                    new_user = User(email=email, login=login, password=make_password(password), date_joined=timezone.now())
                    new_user.save()
                    request.session['user_login'] = login
                    return HttpResponseRedirect(reverse('index:main'), request)
                else:
                    return render(request, 'login.html', {'signup_errors' : errors, 'login_form' : LoginForm(), 'reg_form' : form})

    return render(request, 'login.html', {'login_form' : LoginForm(), 'reg_form' : RegForm()})


def logout(request):

    del request.session['user_login']
    return HttpResponseRedirect(reverse('index:login'))


def add_device(request, user_id, desc, addr):

    if request.method == 'POST':
        try:
            user = User.objects.get(pk=request.POST['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'message': 'Something went wrong!'})
        
        ip_regex = '/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g'
        
        if re.match(ip_regex, desc):
            user.device_set.create(address=addr, description=desc)

            return JsonResponse({'message' : f'{desc} added to {user.login}\'s list.'})
