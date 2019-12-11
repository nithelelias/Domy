import Domy from "./Domy.js";

const ListService = {
    dispatchEvent: function () {
        var event = new Event('list-update');
        // Disparar event.

        window.dispatchEvent(event);
    },
    onUpdate: function (_callback) {
        // Escucha para el evento.
        window.addEventListener('list-update', _callback, false);
    },
    remove: function (index) {
        this.list.splice(index, 1);
        this.dispatchEvent();
    },
    add: function (_user) {
        this.list.push(_user);
        this.dispatchEvent();
    },
    list: [
        {
            name: "Pedro perez"
        },
        {
            name: "carlos carlin"
        },
        {
            name: "Ivan olivo perez"
        }
    ]
}

class ListItem extends Domy.DComponent {
    constructor(_user, index) {
        super();
        this.state = { dirty: 1 };
        this.user = _user;
        this.index = index;

    }
    remove(e) {
        ListService.remove(this.index);
    }
    onInputHandlerName(e) {
        this.user.name = e.target.value;
    }
    editar(e) {
        this.user.edit = true;
        this.state.dirty = -this.state.dirty;
    }
    save(e) {
        ListService.list[this.index] = {
            name: this.user.name
        };
        delete this.user.edit;
        this.state.dirty = -this.state.dirty;
    }

    render() {
        if (this.user.edit) {
            return `<div>(${this.index + 1}) 
                <input type="text" value="${this.user.name}" focus  on-input="${(e) => { this.onInputHandlerName(e) }}" />  <a href="#" on-click="${(e) => this.save(e)}" style='color:green'>  LISTO </a>
            </div>`;
        } else {
            return `<div>(${this.index + 1}) <b>${this.user.name}</b> 
            <a href="#" on-click="${(e) => this.editar(e)}" style='color:BLUE'>  EDITAR </a>  &nbsp; - &nbsp;
            <a href="#" on-click="${(e) => this.remove(e)}" style='color:red'>  ELIMINAR </a></div>`;
        }

    }
}

class ListComponent extends Domy.DComponent {
    constructor() {
        super();
        this.state = { dirty: 1 };
        ListService.onUpdate(() => {
            this.state.dirty = -this.state.dirty;
        });
    }
    addNew(e) {
        ListService.add({ name: "", edit: true })
    }
    render() {

        return `<ul>${ListService.list.map((user, index) => {
            return `<li> ${(new ListItem(user, index)).toStringView()} </li>`;
        }).join("")}
        
            <li><a href="#" on-Click="${(e) => { this.addNew(e) }}">Agregar</a></li>
        </ul>`;
    }
}

export default ListComponent;