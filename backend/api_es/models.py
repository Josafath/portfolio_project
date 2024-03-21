from django.db import models

# Create your models here.



class Proyectos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=500)
    estrellas = models.IntegerField()
    enlace_github = models.CharField(max_length=300)
    enlace_website = models.CharField(null=True,blank=True, max_length=300)

    def __str__(self) -> str:
        return self.nombre
    
class Tecnologias(models.Model):
    nombre = models.CharField(max_length=250)
    proyecto = models.ForeignKey(Proyectos, on_delete = models.DO_NOTHING)


    def __str__(self) -> str:
        return self.nombre
    

class Mensajes(models.Model):
    nombres = models.CharField(max_length=250)
    email = models.EmailField()
    mensaje = models.CharField(max_length=500)


    def __str__(self) -> str:
        return self.mensaje