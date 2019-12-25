import * as actionCreators from '../actions/actionCreators.js'
import {  getFirestore } from 'redux-firestore'

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
  const firestore = getFirestore();

    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      firestore.collection('allWireframes').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
            firestore.collection('allWireframes').doc(doc.id).delete();
        })
      firestore.collection("users").doc(firebase.auth().W).get()
      .then(doc => {
          console.log('Document data:', doc.data().actualWireframe);
          for (var i = 0; i < doc.data().actualWireframe.length; i++) {
              firestore.collection("allWireframes").doc().set(doc.data().actualWireframe[i])
          } 
      });
    });
    
      console.log("LOGIN_SUCCESS");
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });

    // console.log(firestore.collection("users").listOfWireframes.length)
    
  };

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
        admin: false, 
        listOfWireframes: [],
        actualWireframe: [],
    })).then(() => {
      firestore.collection('allWireframes').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
            firestore.collection('allWireframes').doc(doc.id).delete();
        })
      
    });
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        dispatch({ type: 'REGISTER_ERROR', err });
    });
};

export const updateDelete = (currentWireframeKey, listOfWireframes, id, userId) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  console.log("user")
  console.log(id)
  firestore.collection("allWireframes").doc(listOfWireframes[currentWireframeKey].id).delete().then(
    () => {
      var idList = [];
      var actual = []
        firestore.collection('allWireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                idList.push(doc.id);
                actual.push(doc.data())

            })
        }).then(
            function(){
              firestore.collection('users').doc(userId).update({listOfWireframes: idList});
              firestore.collection('users').doc(userId).update({actualWireframe: actual});
              console.log("testing")
                            console.log(idList)

            }
        )
    });
};

export const updateTop = (listOfLists, firebase, todoList) => (dispatch, getState, {getFirestore}) => {
  const firestore = getFirestore();
  firestore.collection("allWireframes").doc(todoList.id).update({last_updated: todoList.last_updated});
  // firestore.collection('todoLists').orderBy('last_updated');
};

export const updateHandlerName = (todoList, firebase, newName, id, uid) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  firestore.collection("allWireframes").doc(id).update({name: newName});
  var wireframeLists = []

  firestore.collection('allWireframes').get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc) {
        wireframeLists.push(doc.data());
    })
}).then(
    function(){
        firestore.collection('users').doc(uid).update({actualWireframe: wireframeLists});
    }
)
};

export const updateNewList = (userId, object, history) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  firestore.collection('allWireframes').add(object).then(ref => history.push('/wireframe/' + ref.id)).then(
    () => {
      var idList = [];
      var actual = []
        firestore.collection('allWireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                idList.push(doc.id);
                actual.push(doc.data())
            })
        }).then(
            function(){
              firestore.collection('users').doc(userId).update({listOfWireframes: idList});
              firestore.collection('users').doc(userId).update({actualWireframe: actual});
            }
        )
    });
};