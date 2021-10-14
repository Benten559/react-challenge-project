import React, { Component } from 'react';
import { Template } from '../../components';
import { connect } from 'react-redux';
import { SERVER_IP } from '../../private';
import './orderForm.css';

const ADD_ORDER_URL = `${SERVER_IP}/api/add-order`
const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`
let editOrderVariable = false;

const mapStateToProps = (state) => ({
    auth: state.auth,
})

class OrderForm extends Component {
    constructor(props) {
        super(props);
        console.log(props, ' the props from the constructor')
        this.state = {
            order_item: "",
            quantity: "1",
        }
    }

    componentDidMount() {        
        if (this.props.match.params.id != null) {
            console.log(this.props.match.params.id, ' the id');
            this.getOrder(this.props.match.params.id);
            this.editOrderVariable = true;
            // this.setState({
            //     id: props.match.params.id,
            // });

        }        // if (this.props.id !== prevProps.id) {
        //     // fetch or other component tasks necessary for rendering
        //     console.log(this.props, ' the current state of the props')
        //   }
        // fetch(`${SERVER_IP}/api/current-orders`)
        //     .then(response => response.json())
        //     .then(response => {
        //         if(response.success) {
        //             this.setState({ orders: response.orders });
        //         } else {
        //             console.log('Error getting orders');
        //         }
        //     });
    }

    getOrder(id) {
        fetch(`${SERVER_IP}/api/current-orders`)
        .then(response => response.json())
        .then(response => {
            if(response.success) {
                let orderToEdit = response.orders.find((order) => id === order._id)
                this.setState({
                    id: orderToEdit._id,
                    order_item: orderToEdit.order_item === null ? "" : orderToEdit.order_item,
                    quantity: orderToEdit.quantity == null ? "1": orderToEdit.quantity 
                });
            } else {
                console.log('Error getting orders');
            }
        });
    }

    menuItemChosen(event) {
        console.log(event.target.value, "the target value")
        this.setState({ order_item: event.target.value });
    }

    menuQuantityChosen(event) {
        this.setState({ quantity: event.target.value });
    }

    submitOrder(event) {
        event.preventDefault();
        if (this.state.order_item === "") return;
        fetch(ADD_ORDER_URL, {
            method: 'POST',
            body: JSON.stringify({
                order_item: this.state.order_item,
                quantity: this.state.quantity,
                ordered_by: this.props.auth.email || 'Unknown!',
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log("Success", JSON.stringify(response)))
        .catch(error => console.error(error));
    }

    editOrder(event) {
        event.preventDefault();
        if (this.state.order_item === "") return;
        console.log(' this.state', this.state)
        fetch(EDIT_ORDER_URL, {
            method: 'POST',
            body: JSON.stringify({
                id: this.state.id,
                order_item: this.state.order_item,
                quantity: this.state.quantity,
                ordered_by: this.props.auth.email || 'Unknown!',
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log("Success", JSON.stringify(response)))
        .catch(error => console.error(error));
    }

    upsertOrder(event, editOrderVariable) {
        if (editOrderVariable) {
            this.editOrder(event);
        }
        else {
            this.submitOrder(event);
        }
    }


    render() {
        return (
            <Template>
                <div className="form-wrapper">
                    <form>
                        <label className="form-label">I'd like to order...</label><br />
                        <select 
                            value={this.state.order_item} 
                            onChange={(event) => this.menuItemChosen(event)}
                            className="menu-select"
                        >
                            <option value="" defaultValue disabled hidden>Lunch menu</option>
                            <option value="Soup of the Day">Soup of the Day</option>
                            <option value="Linguini With White Wine Sauce">Linguini With White Wine Sauce</option>
                            <option value="Eggplant and Mushroom Panini">Eggplant and Mushroom Panini</option>
                            <option value="Chili Con Carne">Chili Con Carne</option>
                        </select><br />
                        <label className="qty-label">Qty:</label>
                        <select value={this.state.quantity} onChange={(event) => this.menuQuantityChosen(event)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <button type="button" className="order-btn" onClick={(event) => this.upsertOrder(event, this.editOrderVariable)}>Order It!</button>
                    </form>
                </div>
            </Template>
        );
    }
}

export default connect(mapStateToProps, null)(OrderForm);