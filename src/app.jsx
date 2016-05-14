var React = require('react');
var ReactDOM = require('react-dom');
var Fluxxor = require('fluxxor');

var constants = {
    UPDATE_COUNTER: "UPDATE_COUNTER"
}

// Store
var CounterStore = Fluxxor.createStore({
    initialize: function(){
        this.counter = 0;
        this.bindActions(
            constants.UPDATE_COUNTER, this.onUpdateCounter
        );
    },

    onUpdateCounter: function(payload){
        this.counter = this.counter + payload.value;
        this.emit('change');
    },

    getState: function(){
        return {counter: this.counter}
    }
});

var stores = { CounterStore: new CounterStore()};


// Action
var actions = {
    plusCounter: function(){
        this.dispatch(constants.UPDATE_COUNTER, {value: 1});
    },
    minusCounter: function(){
        this.dispatch(constants.UPDATE_COUNTER, {value: -1});
    }
}

// View & Mixin
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var CounterApp = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("CounterStore")],

    getStateFromFlux: function(){
        return this.getFlux().store('CounterStore').getState();
    },

    render: function(){
        return (<Counter value={this.state.counter} />);
    }
});

var Counter = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        value: React.PropTypes.number.isRequired
    },
    onClickPlus: function(){
        return this.getFlux().actions.plusCounter();
    },
    onClickMinus: function(){
        return this.getFlux().actions.minusCounter();
    },
    render: function(){
        return (
            <div>
                <span>Count: {this.props.value}</span>
                <div>
                    <button onClick={this.onClickPlus}>+1</button>
                    <button onClick={this.onClickMinus}>-1</button>
                </div>
            </div>
        );
    }
});

var flux = new Fluxxor.Flux(stores, actions);

ReactDOM.render(
    <CounterApp flux={flux}/>,
    document.getElementById('app-container')
);
