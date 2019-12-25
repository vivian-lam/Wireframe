import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';
import { firestoreConnect } from 'react-redux-firebase';
import { createTodoList } from '../../store/actions/actionCreators';

class TodoListLinks extends React.Component {
    render() {
        var todoLists = this.props.wireframeLists;
        if (todoLists != undefined) {
            todoLists = todoLists.reduce(function(prev, curr) {
                var obj = prev.filter(obj => obj.id === curr.id);
                if (obj.length == 0) {
                  prev.push(curr);
                }
                return prev;
              }, []);
            
        }
       
        return (

            <div className="todo-lists section">
                
                {todoLists && todoLists.map(todoList => (
                    <Link to={'/wireframe/' + todoList.id} >
                        <TodoListCard todoList={todoList} todoLists = {todoLists} auth= {this.props.auth}/>
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframeLists: state.firestore.ordered.allWireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps), firestoreConnect([
    { collection: 'allWireframes'},
  ]))(TodoListLinks);