/**
 *  ARBOL DE COMPONENTES INDICA LOS HIJOS.
 */
const componentTree = {}

/**
 *  ESTE OBJETO AGREGA COMPONENTES PARA ADMINSITRARLOS
 */
const viewsComponentHandler = {
    add: function (_c) {
        this.map[_c.id] = _c;
        componentTree[_c.id] = [];
        this.total = Object.keys(viewsComponentHandler.map).length;
    },
    remove: function (_id) {
        this.map[_id] = null;
        delete this.map[_id];
        delete componentTree[_id];
        this.total = Object.keys(viewsComponentHandler.map).length;
    },
    get: function (_id) {
        return this.map[_id];
    },
    total: 0,
    map: {}
};


/**
 * ESTE METODO VALIDA LOS ELEMENTOS SI TIENEN:
 * -  EVENTOS.
 * 
 * @param {DOM} _domElement 
 */
function evaluateChilds(_domElement) {
    // EVALUATE CHILDRENS
    for (let i = 0; i < _domElement.childElementCount; i++) {
        let _element = _domElement.children[i];
        // ITERA LOS ATRIBUTOS PARA VALIDAR SI TIENE EVENTOS.
        let _totalAttrs = _element.attributes.length;
        let attributesToDelete = [];
        for (let j = 0; j < _totalAttrs; j++) {
            let _attr = _element.attributes[j];
            // VALIDA SI TIENE ATRIBUTOS DE ESCUCHE on-"event"
            try {
                if (_attr.name.indexOf("on-") > -1) {
                    // USO EVAL PARA DINAMIZAR LA EJECUCION.
                    _element[_attr.name.replace("-", "").toLowerCase()] = eval(_attr.value);
                    // INDICA QUE ELIMINE EL ATRIBUTO
                    attributesToDelete.push(_attr.name);
                }
            } catch (e) {
                console.warn(e);
            }
        }
        // ITERA LOS ATRIBUTOS A ELIMINAR
        for (let j in attributesToDelete) {
            // ELIMINO EL ATRIBUTO QUE LO RELACIONA.
            _element.attributes.removeNamedItem(attributesToDelete[j]);
        }
        // EVALUA LOS HIJOS CON EL MISMO METODO
        if (!_element.isComponent && _element.attributes["cpid"] == null) {
            evaluateChilds.call(this, _element);
        } else {
            // SI ES UN COMPONENTE. relaciona A ESTE SUS HIJOS COMPONENTES
            componentTree[this.$id].push(_element.attributes["cpid"].value);
            // --  console.log("NOT  this is component...", _element.tagName);
        }
    }
}


/**
 *  Observa los cambios del state.
 * @param {DComponent} _hcomponent 
 * @param {Method function} onChange 
 */
function watchStateChange(_hcomponent, onChange) {

    var objectState = {};
    // -- CREA UN PROXY 
    function createNewProxy(_state) {
        objectState = new Proxy(_state, {
            set: function (target, key, value) {
                // console.log(`${key} set to ${value}`);
                target[key] = value;
                onChange();
                return true;
            }
        });

    }

    // --  INDICAMOS QUE LA PROPIEDAD STATE TIENE UN SET y UN GET , AL SER CAMBIADA (SET).
    // ---  GENERARA UN PROXY PARA VER SI SUS VALORES CAMBIAN:
    Object.defineProperty(_hcomponent, "state", {
        // INDICA SI ES ENUMERABLE SI ESTE ES UN ARRAY.
        enumerable: false,
        // DEFINE EL SET
        set: (_newstate, a) => {
            createNewProxy(_newstate)
            onChange();

        },
        // DEFINE GET
        get: function () {
            return objectState;
        }

    });
}

// CON ESTE METODO ESPERAMOS A QUE LA VISTA HAYA CARGADO
function waitUntilViewLoad(_hcomponent) {
    // DEVOLVEMOS UNA PROMESA
    return new Promise((resolve) => {
        /**
         * ESTA FUNCION VALIDA SI LA VISTA ASOCIADA AL COMPONENTE YA CARGO.
         */
        let fncValidate = function () {
            // SI EL COMPONENTE EXISTE Y LA VISTA ASOCIADA NO ES NULA, Y SI LA VISTA ESTA CONECTADA EN EL DOM.
            if (_hcomponent != null && _hcomponent.rootElement != null && _hcomponent.rootElement.isConnected) {
                setTimeout(() => {
                    resolve();
                }, 100);
            } else {
                setTimeout(fncValidate, 100);
            }
        }
        setTimeout(fncValidate, 100);


    });

}

/**
 * HTML COMPONENTE 
 * 
 */
class DComponent {
    constructor() {
        this.state = {};
        this.$dirty_state = null;
        this.$id = this.constructor.name + "_-_" + Date.now();
        // REGISTRAMOS EL COMPONENTE
        viewsComponentHandler.add({
            id: this.$id,
            o: this
        });

        // OBSERVAMOS LOS CAMPOS DEL ESTADO
        watchStateChange(this, () => {
            this.$_render();
        });

        // ESPERA A QUE LA VISTA ESTE CARGADA
        waitUntilViewLoad(this).then(() => {
            // FIRST RENDER
            this.$_render();
        });

        // CREAMOS UNA NODO.
        this.rootElement = document.createElement("view");
        this.rootElement.isComponent = true;
        this.rootElement._DComponentInstance = this;
        return this;
    }

    render() {
        return "";
    }




    /**
     *  Este metodo ESTATICO es usado para cambiar el elemento raiz anidado al componente.
     * @param {Node} DomNode 
     * @param {Array{Object[]}} parameters 
     */
    static newInstance(DomNode, parameters = []) {
        let newInstance = new this(...parameters);
        newInstance.rootElement = DomNode;
        return newInstance;
    }

    /**
     *  Devuelve el NODO DOM de forma de text el cual debe ser anidado de inmediato.
     */
    toStringView() {
        return this.$_bindDom();
    }

    /**
     * METODO "PRIVADO" EL CUAL RELACIONA LA VISTA  DESDE EL toStringHtml  o toNodeElement 
     */
    $_bindDom() {
        // ESPERAR A LA SIGUIENTE ITERACION DEL HILO PARA  BUSCAR EL ELEMENTO 
        setTimeout(() => {
            if (this.rootElement == null || !this.rootElement.isConnected) {
                // Encuentra el elemento root anidado buscando por un CPID 
                let selector = `view[cpid='${this.$id}']`;
                let elementFound = document.querySelector(selector);
                if (elementFound != null) {
                    if (!elementFound.isComponent) {
                        // -- console.log("tohtml", this)
                        elementFound.attributes.removeNamedItem("cpid");
                        this.rootElement = elementFound;
                        this.rootElement.isComponent = true;
                        this.$_render();
                    }
                } else {
                    console.log("detach not found")
                    // DETACH NOT FOUND
                    this.$_remove();
                    this.rootElement = null;
                }
            } else {
                // SI YA EXISTE SOLO RENDERIZALO
                this.$_render();
            }
        }, 1);
        return `<view  cpid="${this.$id}" >${this.render(this.state)}</view>`;
    }

    /** ELIMINA EL COMPONETE Y EL OBJETO */
    $_remove() {
        viewsComponentHandler.remove(this.$id);
        for (let i in this) {
            delete this[i];
        }
        delete this;
    }
    /**
     *  metodo "privado" el cual se encarga de validar si hay que volver a pintar y ejecutar el metodo render para pintarlo sobre
     * el rootElement
     */
    $_render() {

        if (this.rootElement != null && this.rootElement.isConnected) {
            // NO MODIFIQUES ESTO.
            let _states = JSON.stringify(this.state);
            if (_states != this.$dirty_state) {
                this.$dirty_state = _states;
                let viewRendered = this.render(this.state);
                if (typeof (viewRendered) == "string") {
                    this.rootElement.innerHTML = viewRendered;
                } else {
                    this.rootElement.innerHTML = "";
                    this.rootElement.append(viewRendered);
                }
                this.$_postRender();

            }

        }


    }

    /**
     *  MEtodo ejecutado despues del pintado  llamado desde $_render
     */
    $_postRender() {
        // VALIDA SI LOS COMPONENTES HIJOS SE DESVINCULARON.
        if (componentTree.hasOwnProperty(this.$id)) {
            let componentChilds = componentTree[this.$id];
            if (componentChilds.length > 0) {

                // ITERA LOS HIJOS
                componentChilds.forEach((_childId) => {
                    // RECOJE EL VIEW HANDLER
                    let componentHandler = viewsComponentHandler.get(_childId);
                    // SI EXISTE AUN ELIMINALO
                    if (componentHandler != null) {
                        // AQUI.... TOCA VALIDAR SI ELIMARLOS
                        componentHandler.o.$_checkifneedToDelete();
                    }
                });
                // LIMPIA LOS HIJOS .
                componentTree[this.$id] = [];
            }
        }

        evaluateChilds.call(this, this.rootElement);

        // -- console.log(this.$id, "NEW CHILDS", componentTree[this.$id])
    }

    /**
     * este metodo va validar si debe ser eliminado
     */
    $_checkifneedToDelete() {
        // CHECKEA EN LA SIGUIENTE ITERACION.
        setTimeout(() => {
            if (this.rootElement == null || !this.rootElement.isConnected) {
                this.$_remove();
            }
        }, 1);

    }
}


window.getCVList = function () {
    return viewsComponentHandler.map
}
window.getComTree = function () {
    return componentTree;
}

export default {
    version: 1,
    DComponent
};