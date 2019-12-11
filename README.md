# Domy

Si, una vez mas una pequeña Libreria de Creacion de Componentes relacionados a los objetos DOM .




# Porque Nit?

Pos, me gusta saber que se pueden hacer las mismas cosas que los grandes frameworks sin tener que cargar con todo el peso de una libreria grande.
cuando puedes tener el control exacto de las cosas que quieres implementar no tienes peso de sobra sobre caracteristicas que no quieres usar.

# Porque Domy.

Mezcle los nombres DOM Library HTML Compomponent y no me gustaron asi que puse "DOM y que" y el "y que" sono grosero.


# Caracteristicas de Domy.

*  Muy parecido en estructura al React ( me gusto mucho la forma de trabajar, es bastante legible)
*  Lee el Dom directamente no usa Objetos virtuales.
*  Estrictamente usa ESC5^  por lo que todas esta basado en POO.
*  No requiere Jquery.
*  Pocas palabras claves.
*  Se refresca la vista inmediatamente se modifique algun valor del state.


# Limitantes.

 - Solo se concentra en creacion de Componentes para manipulacion de la vista, no enruta las paginas ni te exige que trabajes en un SPA (Simple Page Aplication).
 - El componente refrescara toda la vista indicada en el metodo render, y no hace dibujados inteligentes del elemento dom cambiado.
 
 
# Como Funciona?
El componente para que funcione si o si debe estar anidado a un elemento DOM. si no esta anidado este sera elimiando, el elemento debe estar conectado a la pagina. sino tambien el componente sera eliminado.


.html
```html 
	
	<div id="main"></div>	
	
	<script type="module" src="main.js" ></script>
``` 
main.js
```js
import Domy from "./Domy.js";
	
class MainComponent extends Domy.DComponent {
	constructor(_name = "username") {
		super();
		this.state = { 
			n: 0
		}; 
		this.name=_name;
	}	
	render(){ 
		return `<h1>Hello World!! ${this.state.n} ${this.name }</h1>`;
	}
}

MainComponent.newInstance(document.getElementById("main"), ["oscar"]); 

``` 



#  API

## Propiedades 

	* * **state:   Este es la propiedad tipo hash o json , que guardara informacion del estado de la instancia del componente, y si este cambia la vista se refrescara.
  
## Metodos
	
* **render   Este metodo se debe poner en el objeto que hereda de la super Clase componente, es aqui dentro donde se debe indicar la vista para mostrar, ya sea por String o Dom.
			
* **toStringView  Este metodo devuelve la vista del componente en formato String.

* **newInstance   Este metodo ESTATICO se crea para generar una instancia dentro de un elemento DOM.
		@Parametros : 
						{Node} DomNode elemento Dom al cual se le va anidar este componente.
						{Array of Object } parametros, parametros de entrada que necesitara el Componente que se cree.
	
	

### Examples:
 No hay muchos ejemplos pero pueden verlos aqui
 [Examples](examples/README.md)