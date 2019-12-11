import Domy from "./Domy.js";
import ListComponent from "./ListComponent.js";


const main = document.getElementById("main");

const TimerService = {
    num: 0,
    active: false,
    timeoutId: null,
    callbackForUpdate: function () { },
    toggle: function () {
        this.active = !this.active;
        if (this.active) {
            this.intervalFnc();
        } else {
            clearTimeout(this.timeoutId);
        }
    },
    intervalFnc: function () {
        this.num += 1;
        this.callbackForUpdate(this.num);
        if (this.active) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => this.intervalFnc(), 1000);
        }
    },
    onUpdate: function (_callback) {
        this.callbackForUpdate = _callback;
    }
}

class TimerComponentClock extends Domy.DComponent {
    constructor() {
        super();
        this.state = {
            dirty: 1
        };
        TimerService.onUpdate(() => {
            this.state.dirty = -this.state.dirty;
        });

    }
    render() {

        return `<p>TIMER: ${TimerService.num}</p>     `;
    }
}

class TimerComponent extends Domy.DComponent {
    constructor(_color) {
        super();
        this.state = {
            dirty: 1
        };
        this.id = "TIMER COMPONENT: " + Date.now();
        this.color = _color || "blue";
        window.tc = this;
    }
    toggle(e) {
        TimerService.toggle();
        this.state.dirty = -this.state.dirty;
    }
    render(_state) {
        //
        return `<div style='background:${this.color}'>              
            ${ (new TimerComponentClock()).toStringView()}
             <button on-click="${(e) => { this.toggle(e) }}">${TimerService.active ? "pause" : "play"}</button>             
        </div>`;
    }
}



class MainComponent extends Domy.DComponent {
    constructor(param1) {
        super();
        this.state = {
            dirty: 1,
            n: 0
        };
        this.name = param1 || "username";
        window.mc = this;
    }

    onclick(e) {
        this.state.n += 1;
    }
    onInputNameChange(e) {
        this.name = e.target.value;
        this.state.dirty *= -1;
        e.target.focus();
    }
    render() {

        return `<h1>HOLA MUNDO ${this.state.n} 
                    ${this.name}
                </h1>    
                <input value="${this.name}" on-input="${(e) => { this.onInputNameChange(e); }}"/>
                <button on-click="${(e) => this.onclick(e)}">n=${this.state.n}</button>    
                ${ (new TimerComponent("red")).toStringView()}                 
                ${(new ListComponent()).toStringView()}
            `;
    }
}

MainComponent.newInstance(main, ["RODOLFO"]);


