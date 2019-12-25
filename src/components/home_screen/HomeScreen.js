import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks';
import { updateNewList} from '../../store/database/asynchHandler'
import {  getFirestore } from 'redux-firestore'


class HomeScreen extends Component {
    handleNewList = () => {
        let object = {
            "key": this.props.wireframeLists.length,
            "name": "Unknown",
            "width": "500px",
            "height": "500px",
            "controlList": [],
            "last_updated": new Date()
        }
        // this.props.todoLists.push(object);

        const { props } = this;
        // key: todoListJson.key,
        // name: todoListJson.name,
        // width: todoListJson.width,
        // height: todoListJson.height,
        // controlList: todoListJson.controlList,
        props.registerNewList(this.props.auth.uid, object, this.props.history);

    }

    render() {
        const { auth, profile } = this.props;

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        // const firestore = getFirestore();
        // firestore.collection("users").doc(this.props.auth.uid).get()
        // .then(doc => {
        //     console.log('Document data:', doc.data().actualWireframe);
        //     for (var i = 0; i < 3; i++) {
        //         firestore.collection("allWireframes").doc().set(doc.data().actualWireframe[i])
        //     } 
        // });
        return (

            <div className="dashboard row">
                <div className="">
                    <h4> Recent Works</h4>
                    <div className="col s12 m4" >
                        <TodoListLinks profile={profile} todoLists = {this.props.wireframeLists}/>
                    </div>

                    <div className="col s8 ">
                        <div className="homeBanner center">
                            Wireframe<br />
                            Generator
                        </div>
                            
                        <div className="home_new_list_container center">
                                <button className="home_new_list_button" onClick = {this.handleNewList}>
                                    Create a New Wireframe
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        wireframeLists: state.firestore.ordered.allWireframes,
        auth: state.firebase.auth,
        profile: state.firebase.profile,

    };
};

const mapDispatchToProps = dispatch => ({
    registerNewList: (userId, object, history) => dispatch(updateNewList(userId, object, history)),
  });

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'allWireframes', orderBy: ['last_updated', 'desc'] },
    ]),
)(HomeScreen);