from django import forms

class LoginForm(forms.Form):
    login = forms.CharField(label='Login', max_length=100)
    password = forms.CharField(label='Password', widget=forms.PasswordInput(), max_length=100)


class RegForm(forms.Form):
    email = forms.EmailField(label='email', max_length=100)
    login = forms.CharField(label='login', max_length=100)
    password = forms.CharField(label='password', max_length=100, widget=forms.PasswordInput())
    rpt_password = forms.CharField(label='confirm password', max_length=100, widget=forms.PasswordInput())