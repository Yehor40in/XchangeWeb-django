from django.db import models

class User(models.Model):
    email = models.CharField(max_length=200)
    login = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    date_joined = models.DateTimeField()

    def __str__(self):
        return self.login


class Device(models.Model):
    address = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.description