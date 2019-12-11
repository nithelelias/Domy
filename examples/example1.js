import Domy from "./Domy.js";
const main = document.getElementById("main");



class headerComponent extends Domy.DComponent {
    constructor(user, count) {
        super();
        this.state = {
            dirty: -1
        }
        this.user = user;
        this.count = count;
        window.hc = this;
    }
    refresh() {
        this.state.dirty *= -1;
    }
    render() {
        return `<h1> ${this.count}   ${!this.user.name || this.user.name.length == 0 ? "..." : this.user.name} </h1>`;
    }
}

class MainComponent extends Domy.DComponent {
    constructor(param1 = "username") {
        super();
        this.state = {
            dirty: 1,
            n: 0
        };
        this.user = {
            name: param1
        }

        window.mc = this;
        this.h1 = new headerComponent(this.user, this.state.n);
    }

    onclick(e) {
        this.state.n += 1;
        this.h1.refresh();
    }
    onInputNameChange(e) {
        this.user.name = e.target.value;
        this.h1.refresh();
    }
    render() {

        return `                
                <div>
                    <i>Componente creado en constructor y su instancia guardada</i>
                    ${this.h1.toStringView()}           
                </div>
                <hr />
                <div>
                    <i>Componente instanciado on fly sin guardar instancia</i>
                     ${ (new headerComponent(this.user, this.state.n)).toStringView()}
                </div>
                
                <hr />
                <i>Control del componente Main</i>
                <br/>
                <input value="${this.user.name}" placeholder="username" on-input="${(e) => { this.onInputNameChange(e); }}"/>
                <button on-click="${(e) => this.onclick(e)}"> n= ${this.state.n} + 1 </button>                  
            `;
    }
}

MainComponent.newInstance(main, ["nithel"]);


