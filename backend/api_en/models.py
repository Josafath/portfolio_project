from django.db import models

# Create your models here.



class Projects(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    stars = models.IntegerField()
    link_github = models.CharField(max_length=300)
    link_website = models.CharField(null=True,blank=True, max_length=300)

    def __str__(self) -> str:
        return self.name
    
class Technologies(models.Model):
    name = models.CharField(max_length=250)
    project = models.ForeignKey(Projects, on_delete = models.DO_NOTHING)


    def __str__(self) -> str:
        return self.name
    

class Messages(models.Model):
    name = models.CharField(max_length=250)
    email = models.EmailField()
    message = models.CharField(max_length=500)


    def __str__(self) -> str:
        return self.message
