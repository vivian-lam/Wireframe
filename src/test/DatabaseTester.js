import React from 'react'
import { connect } from 'react-redux';
import todoWireframe from './wireframeTester.json'
import { getFirestore } from 'redux-firestore';
import { firestore } from 'firebase';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('allWireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                fireStore.collection('allWireframes').doc(doc.id).delete();
            })
        });
        fireStore.collection('users').doc(this.props.auth.uid).update({listOfWireframes: []});
    }

    handleReset = () => {
        const fireStore = getFirestore();
        todoWireframe.listOfWireframes.forEach(todoListJson => {
            fireStore.collection('allWireframes').add({
                    key: todoListJson.key,
                    name: todoListJson.name,
                    width: todoListJson.width,
                    height: todoListJson.height,
                    controlList: todoListJson.controlList,
                    last_updated: new Date(),
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        
        });

        var userId = this.props.auth.uid;
        var idList = [];
        var wireframeLists = []
        fireStore.collection('allWireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                idList.push(doc.id)
                wireframeLists.push(doc.data());
            })
        }).then(
            function(){
                fireStore.collection('users').doc(userId).update({listOfWireframes: idList});
                fireStore.collection('users').doc(userId).update({actualWireframe: wireframeLists});
            }
        )
    }

    render() {

        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);