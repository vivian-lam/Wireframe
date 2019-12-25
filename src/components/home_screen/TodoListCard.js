import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { updateTop} from '../../store/database/asynchHandler'
import { updateDelete} from '../../store/database/asynchHandler'

import {Modal, Button} from 'react-materialize';



class TodoListCard extends React.Component {
    moveToTop =() => {
        this.props.todoList['last_updated'] = new Date();
    
        const { props, state } = this;
        const { firebase } = props;

        props.registerTop(this.props.todoLists, firebase, this.props.todoList);
    }

    stop = (e) => {
        e.stopPropagation();
    }

    removeWireframe = (currentWireframe, listOfWireframes, id,e) => {
        e.preventDefault();
        
        const { props } = this;
        var currentWireframeKey = listOfWireframes.indexOf(currentWireframe);
        props.registerDelete(currentWireframeKey, listOfWireframes, id, this.props.auth.uid);
        this.setState({show: false})

    }
    render() {
        const { todoList } = this.props;
        // console.log("TodoListCard, todoList.id: " + todoList.id);
        return (
            
            <div className="card z-depth-2 todo-list-link" onClick = {this.moveToTop}>
                    <div className="card-content grey-text text-darken-3 " >
                    <span className="card-title center waves-effect waves-light">{todoList.name} </span>
                </div>

                <Modal header="Delete wireframe?" actions={<p modal= "close"></p>} 
                                trigger={                    
                                    <Button floating medium className="right red closeBTN">
                                        <i class="material-icons right" >close</i>
                                    </Button >
                                }>
                                
                                <p><strong>Are you sure you want to delete this list?</strong></p>

                                <Button className = "yes_button btn waves-effect waves-light blue lighten-2 modal-close" 
                                    onClick = {(e) => this.removeWireframe(todoList, this.props.todoLists, todoList.id, e)}>Yes
                                    <i class="material-icons right">send</i>                            
                                </Button>

                                <Button className = "yes_button btn waves-effect waves-light blue lighten-2 modal-close "
                                onClick = {(e) => this.stop(e)}>No
                                    <i class="material-icons right">cloud</i>                            
                                </Button>
                                
                                <footer className="dialog_footer">
                                        The list will not be retreivable.
                                </footer> 

                            </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    registerTop: (listOfLists, firebase, todoList) => dispatch(updateTop(listOfLists, firebase, todoList)),
    registerDelete: (currentWireframeKey, listOfWireframes, id, userId) => dispatch(updateDelete(currentWireframeKey, listOfWireframes, id, userId)),

  });

export default compose(
    connect(null, mapDispatchToProps),
    firestoreConnect([
      { collection: 'allWireframes'},
    ]),
)(TodoListCard);
