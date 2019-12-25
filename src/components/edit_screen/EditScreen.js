import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { updateHandlerName } from '../../store/database/asynchHandler';
import {  getFirestore } from 'redux-firestore'
import {Modal, Button} from 'react-materialize';
import { SketchPicker } from 'react-color';
import { Rnd } from "react-rnd";
import reactCSS from 'reactcss';
import ReactDOM from 'react-dom';

class EditScreen extends Component {
    
    state = {
        name: '',
        width: '',
        height: '',
        update: false,
        compared: '',
        displayColorPicker: false,
        displayColorPicker1: false,
        color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
          },
        color1: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },
        currentControl: '',
        globalarr: [],
        rndWidth: '',
        rndHeight: '',
        x: "",
        y: ""
    }

    handleClickColor = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleCloseColor = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChangeColor = (color) => {
        console.log(color)
        this.setState({ color: color.rgb })

        if (this.state.currentControl.objectType == "addedlabelDiv") {
            document.getElementsByClassName("addedlabelDiv" + " " + this.state.currentControl.key)[0].style.backgroundColor = color.hex;
            this.state.currentControl.backgroundColor = color.hex;
        }
        else if (this.state.currentControl.objectType == "addedTextfield") {
            document.getElementsByClassName("addedTextfield"+ " " + this.state.currentControl.key)[0].style.backgroundColor = color.hex;
            this.state.currentControl.backgroundColor = color.hex;
        }
        else if (this.state.currentControl.objectType == "addedSubmitBtn") {
            document.getElementsByClassName("addedSubmitBtn"+ " " + this.state.currentControl.key)[0].style.backgroundColor = color.hex;
            this.state.currentControl.backgroundColor = color.hex;
        }
        else if (this.state.currentControl.objectType == "addedBox") {
            document.getElementsByClassName("addedBox"+ " " + this.state.currentControl.key)[0].style.backgroundColor = color.hex;
            this.state.currentControl.backgroundColor = color.hex;

        }

    };


    handleClickColor1 = () => {
        this.setState({ displayColorPicker1: !this.state.displayColorPicker1 })
    };

    handleCloseColor1 = () => {
        this.setState({ displayColorPicker1: false })
    };

    handleChangeColor1 = (color) => {
        this.setState({ color1: color.rgb })

        if (this.state.currentControl != "") {
           
            if (this.state.currentControl.objectType == "addedlabelDiv") {
                document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.border = 'solid';
                document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderWidth = this.state.currentControl.borderThickness + 'px';
                document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderRadius = this.state.currentControl.borderRadius + 'px';
                document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderColor = color.hex;
                this.state.currentControl.borderColor = color.hex;
            }
            else if (this.state.currentControl.objectType == "addedTextfield") {
                document.getElementsByClassName("addedTextfield"+ " " + this.state.currentControl.key)[0].style.borderColor = color.hex;
                this.state.currentControl.borderColor = color.hex;
            }
            else if (this.state.currentControl.objectType == "addedSubmitBtn") {
                document.getElementsByClassName("addedSubmitBtn"+ " " + this.state.currentControl.key)[0].style.borderColor = color.hex;
                this.state.currentControl.borderColor = color.hex;
            }
            else if (this.state.currentControl.objectType == "addedBox") {
                document.getElementsByClassName("addedBox"+ " " + this.state.currentControl.key)[0].style.borderColor = color.hex;
                this.state.currentControl.borderColor = color.hex;

            }

        }
    };

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        let newName = e.target.value;

        const { props, state } = this;
        const { firebase } = props;
        props.registerName(this.props.currentWireframe, firebase, newName, this.props.id, this.props.auth.uid);
    }

    returnHome = (e) => {
        e.stopPropagation();
        this.props.history.goBack()
    }

    updateWidth = (e) => {
        this.setState({update: true});

        if (e.target.value > 5000 || e.target.value < 1) {
            this.setState({width: ""});
            this.setState({update: false})
            return
        }
        else if (e.target.value.match(/^\d+$/)) {
            this.setState({width: e.target.value});
        }
        else {
            this.setState({width: ""});
            this.setState({update: false})
            return
        }
    }

    updateHeight = (e) => {
        this.setState({update: true});
        if (e.target.value > 5000 || e.target.value < 1 ) {
            this.setState({height: ""});
            this.setState({update: false})
            return
        }
        else if (e.target.value.match(/^\d+$/)) {
            this.setState({height: e.target.value});
        }    
        else {
            this.setState({width: ""});
            this.setState({update: false})
            return
        }
    }

    updateDimensions = () => {
        this.props.currentWireframe.height = this.state.height;
        this.props.currentWireframe.width = this.state.width;
        
        document.getElementsByClassName("wireframeContainer")[0].style.height = this.state.height + 'px';
        document.getElementsByClassName("wireframeContainer")[0].style.width = this.state.width + 'px';
        
        this.props.currentWireframe.height = this.state.height + 'px';
        this.props.currentWireframe.width = this.state.width + 'px';
        this.setState({update: false})

        this.checkEqual(this.props.currentWireframe, this.props.current)
        this.forceUpdate();

    }

    checkEqual = (currentWireframe, copyOfWireframe) => {
        if (JSON.stringify(currentWireframe.controlList) != JSON.stringify(copyOfWireframe.controlList)  || currentWireframe.width != copyOfWireframe.width || currentWireframe.height != copyOfWireframe.height) {
            console.log(false);
            return false
        }
        else {
            console.log(true)
            return true
        }
    }

    zoomIn = () => {

        if (parseFloat(this.props.currentWireframe.height,10) > 1 && parseFloat(this.props.currentWireframe.width,10) > 1) {
            document.getElementsByClassName("wireframeContainer")[0].style.height = (parseFloat(this.props.currentWireframe.height, 10) * 2.0) + 'px';
            document.getElementsByClassName("wireframeContainer")[0].style.width = (parseFloat(this.props.currentWireframe.width, 10) * 2.0) + 'px';

            this.props.currentWireframe.height = (parseFloat(this.props.currentWireframe.height, 10) * 2.0) + 'px';
            this.props.currentWireframe.width =  (parseFloat(this.props.currentWireframe.width, 10) * 2.0) + 'px';
        }
    }

    zoomOut = () => {
       
        if (parseFloat(this.props.currentWireframe.height,10) / 2 > 1 && parseFloat(this.props.currentWireframe.width,10) / 2 > 1) {
            document.getElementsByClassName("wireframeContainer")[0].style.height = (parseFloat(this.props.currentWireframe.height, 10) / 2.0) + 'px';
            document.getElementsByClassName("wireframeContainer")[0].style.width = (parseFloat(this.props.currentWireframe.width, 10) / 2.0) + 'px';
            this.props.currentWireframe.height = (parseFloat(this.props.currentWireframe.height, 10) / 2.0) + 'px';
            this.props.currentWireframe.width =  (parseFloat(this.props.currentWireframe.width, 10) / 2.0) + 'px';
        }
    }

    saveWireframe = () => {
       const firestore = getFirestore();
       var wireframeLists = []
       var self = this
       firestore.collection('allWireframes').doc(self.props.id).update({controlList: self.props.currentWireframe.controlList});
       firestore.collection('allWireframes').doc(self.props.id).update({height: self.props.currentWireframe.height});
       firestore.collection('allWireframes').doc(self.props.id).update({width: self.props.currentWireframe.width});

       firestore.collection('allWireframes').get().then(function(querySnapshot){
           querySnapshot.forEach(function(doc) {
               wireframeLists.push(doc.data());
           })
       }).then(
           function(){
               console.log(self.props.auth.uid)
               console.log(wireframeLists)
               firestore.collection('users').doc(self.props.auth.uid).update({actualWireframe: wireframeLists});
           }
       )
      
    }

    saveAndReturn = (e) => {
        e.stopPropagation();
        const firestore = getFirestore();
        var wireframeLists = []
        var self = this
        firestore.collection('allWireframes').doc(self.props.id).update({controlList: self.props.currentWireframe.controlList});
        firestore.collection('allWireframes').doc(self.props.id).update({height: self.props.currentWireframe.height});
        firestore.collection('allWireframes').doc(self.props.id).update({width: self.props.currentWireframe.width});

        firestore.collection('allWireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                wireframeLists.push(doc.data());
            })
        }).then(
            function(){
                firestore.collection('users').doc(self.props.auth.uid).update({actualWireframe: wireframeLists});
                self.props.history.goBack();
 
            }
        
        )

    }

    
    hexToRgbA = (hex) =>{
        var c;
        if (hex == "") {
            return "'', '', '', ''"
        }
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return [(c>>16)&255, (c>>8)&255, c&255].join(',')+',1';
        }
        return "'', '', '', ''";
    }

    clickAdded = (object, state, props) => {
        console.log(object)
        // object.height = this.state.rndHeight;
        // object.width = this.state.rndWidth;
        this.setState({currentControl: object})
        state = this.state;
        var self=this;

        document.getElementById("labelname").value = object.text;
        document.getElementById("font").value = object.fontSize;
        document.getElementById("thick").value = object.borderThickness;
        document.getElementById("radius").value = object.borderRadius;
        var back = this.hexToRgbA(object.backgroundColor);
        var arr = back.split(',')
        this.setState({color: {
            r: arr[0],
            g: arr[1],
            b: arr[2],
            a: arr[3],
            }})

        var bord = this.hexToRgbA(object.borderColor);
        var newarr = bord.split(',')
        console.log(newarr)
        this.setState({color1: {
            r: newarr[0],
            g: newarr[1],
            b: newarr[2],
            a: newarr[3],
            }})
        var self= this;
        
        if (object.objectType == "addedBox") {
           
            var height = object.height;
            var width = object.width;

            if (height.includes('px')) {
                height = height.slice(0, -2)
            }

            if (width.includes('px')) {
                width = width.slice(0, -2)
            }

            document.getElementsByClassName("corner TL" + " " + object.key)[0].style.marginBottom = (height ) +'px'
            document.getElementsByClassName("corner TL" + " " + object.key)[0].style.marginTop = '-13px'
            document.getElementsByClassName("corner TL" + " " + object.key)[0].style.marginLeft = '-13px'

            document.getElementsByClassName("corner TR" + " " + object.key)[0].style.marginBottom = '0px'
            document.getElementsByClassName("corner TR" + " " + object.key)[0].style.marginTop = '-13px'
            document.getElementsByClassName("corner TR" + " " + object.key)[0].style.marginLeft = (width -15) +'px'

            document.getElementsByClassName("corner BL" + " " + object.key)[0].style.marginTop = (height -17) +'px'
            document.getElementsByClassName("corner BL" + " " + object.key)[0].style.marginLeft = '-13px'

            document.getElementsByClassName("corner BR" + " " + object.key)[0].style.marginTop = (height -17) +'px'
            document.getElementsByClassName("corner BR" + " " + object.key)[0].style.marginLeft =(width -15) +'px'

            document.getElementsByClassName("corner TL" + " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner TL"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner TR"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner TR"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner BL"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner BL"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner BR"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner BR"+ " " + object.key)[0].style.visibility = "visible";


            document.getElementsByClassName("middle")[0].addEventListener('click', function(event) {
                if (document.getElementsByClassName("addedBox" + " " + object.key)[0] == undefined) {
                    return
                }
                var isClickInside = document.getElementsByClassName("addedBox" + " " + object.key)[0].contains(event.target);
                if (!isClickInside) {
                    document.getElementsByClassName("corner TL" + " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner TL"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner TR"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner TR"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner BL"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner BL"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner BR"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner BR"+ " " + object.key)[0].style.visibility = "hidden";   
                    self.setState({currentControl: ""})             
                } 
                else 
                    self.setState({currentControl: object})
              });

            document.getElementsByClassName("addedBox" + " " + object.key)[0].addEventListener('keydown',
             function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if (event.ctrlKey && event.key == 'd') {
                    var duplicate = Object.assign({}, self.state.currentControl);
                    duplicate.key = self.props.currentWireframe.controlList.length
                    self.addDuplicateContainer(duplicate);
                }
                else if (event.key == "Delete") {
                    console.log('printing')
                    console.log(object)
                    console.log(document.getElementsByClassName("addedBox" + " " + object.key)[0])
                    if (document.getElementsByClassName("addedBox" + " " + object.key)[0] == undefined) {
                        console.log("not defined")
                        return;
                    }
                    document.getElementsByClassName("addedBox" + " " + object.key)[0].parentNode.removeChild(document.getElementsByClassName("addedBox" + " " + object.key)[0]);
                    console.log(document.getElementsByClassName('addedBox'))
                    for( var i = 0; i < props.currentWireframe.controlList.length; i++){ 
                        if ( props.currentWireframe.controlList[i].key === self.state.currentControl.key) {
                            console.log('splice')

                            break;
                        }
                    }
                    // console.log(self.state.currentControl)
                    self.setState({currentControl: ""});    
                    // document.getElementsByClassName("addedBox" + " " + object.key)[0].parentNode.removeChild(document.getElementsByClassName("addedBox" + " " + object.key)[0]);
  
                }
               });
           }

           else if (object.objectType == "addedlabelDiv") {
               
                var height = object.height;
                var width = object.width;

                if (height.includes('px')) {
                    height = height.slice(0, -2)
                }

                if (width.includes('px')) {
                    width = width.slice(0, -2)
                }

                document.getElementsByClassName("corner TLlabel" + " " + object.key)[0].style.marginBottom = (height ) +'px'
                document.getElementsByClassName("corner TLlabel" + " " + object.key)[0].style.marginTop = '-25px'
                document.getElementsByClassName("corner TLlabel" + " " + object.key)[0].style.marginLeft = '-3px'
    
                document.getElementsByClassName("corner TRlabel" + " " + object.key)[0].style.marginBottom = (height ) +'px'
                document.getElementsByClassName("corner TRlabel" + " " + object.key)[0].style.marginTop = '-25px'
                document.getElementsByClassName("corner TRlabel" + " " + object.key)[0].style.marginLeft = (width -5) +'px'
    
                document.getElementsByClassName("corner BLlabel" + " " + object.key)[0].style.marginTop = (height -27) +'px'
                document.getElementsByClassName("corner BLlabel" + " " + object.key)[0].style.marginLeft = '-3px'
    
                document.getElementsByClassName("corner BRlabel" + " " + object.key)[0].style.marginTop = (height -27) +'px'
                document.getElementsByClassName("corner BRlabel" + " " + object.key)[0].style.marginLeft =(width -5) +'px'

                document.getElementsByClassName("corner TLlabel" + " " + object.key)[0].style.display = "block";
                document.getElementsByClassName("corner TLlabel"+ " " + object.key)[0].style.visibility = "visible";
                document.getElementsByClassName("corner TRlabel"+ " " + object.key)[0].style.display = "block";
                document.getElementsByClassName("corner TRlabel"+ " " + object.key)[0].style.visibility = "visible";
                document.getElementsByClassName("corner BLlabel"+ " " + object.key)[0].style.display = "block";
                document.getElementsByClassName("corner BLlabel"+ " " + object.key)[0].style.visibility = "visible";
                document.getElementsByClassName("corner BRlabel"+ " " + object.key)[0].style.display = "block";
                document.getElementsByClassName("corner BRlabel"+ " " + object.key)[0].style.visibility = "visible";

                document.getElementsByClassName("middle")[0].addEventListener('click', function(event) {
                    if (document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0] == undefined) {
                        return
                    }
                    var isClickInside = document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0].contains(event.target);
                    if (!isClickInside) {
                        document.getElementsByClassName("corner TLlabel" + " " + object.key)[0].style.display = "none";
                        document.getElementsByClassName("corner TLlabel"+ " " + object.key)[0].style.visibility = "hidden";
                        document.getElementsByClassName("corner TRlabel"+ " " + object.key)[0].style.display = "none";
                        document.getElementsByClassName("corner TRlabel"+ " " + object.key)[0].style.visibility = "hidden";
                        document.getElementsByClassName("corner BLlabel"+ " " + object.key)[0].style.display = "none";
                        document.getElementsByClassName("corner BLlabel"+ " " + object.key)[0].style.visibility = "hidden";
                        document.getElementsByClassName("corner BRlabel"+ " " + object.key)[0].style.display = "none";
                        document.getElementsByClassName("corner BRlabel"+ " " + object.key)[0].style.visibility = "hidden";   
                        self.setState({currentControl: ""})             
                    } 
                    else {
                    self.setState({currentControl: object})
                    document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0].borderColor = object.borderColor
                    }
                  });


                document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0].addEventListener('keydown',
                function(event){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    if (event.ctrlKey && event.key == 'd') {
                        var duplicate = Object.assign({}, self.state.currentControl);
                        duplicate.key = self.props.currentWireframe.controlList.length
                        self.addDuplicateLabel(duplicate);
                    }
                    else if (event.key == "Delete") {
                        console.log(event.key)
                        if (document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0] == undefined) {
                            console.log("not defined")
                            return;
                        }
                        console.log(document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0])
                        document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0].parentNode.removeChild(document.getElementsByClassName("addedlabelDiv" + " " + object.key)[0]);

                        for( var i = 0; i < props.currentWireframe.controlList.length; i++){ 
                            if ( props.currentWireframe.controlList[i].key === self.state.currentControl.key) {
                                // props.currentWireframe.controlList.splice(i, 1); 
                                // self.state.globalarr.splice(i, 1)
                                // props.currentWireframe.controlList = self.state.globalarr;

                                break;
                            }
                        }
                        self.setState({currentControl:""})
                    }
                });
           }

           else if (object.objectType == "addedSubmitBtn") {

            var height = object.height;
            var width = object.width;

            if (height.includes('px')) {
                height = height.slice(0, -2)
            }

            if (width.includes('px')) {
                width = width.slice(0, -2)
            }

            document.getElementsByClassName("corner TLbtn" + " " + object.key)[0].style.marginBottom = (height ) +'px'
            document.getElementsByClassName("corner TLbtn" + " " + object.key)[0].style.marginTop = '-30px'
            document.getElementsByClassName("corner TLbtn" + " " + object.key)[0].style.marginLeft = '-5px'

            document.getElementsByClassName("corner TRbtn" + " " + object.key)[0].style.marginBottom = (height ) +'px'
            document.getElementsByClassName("corner TRbtn" + " " + object.key)[0].style.marginTop = '-30px'
            document.getElementsByClassName("corner TRbtn" + " " + object.key)[0].style.marginLeft = (width -5) +'px'

            document.getElementsByClassName("corner BLbtn" + " " + object.key)[0].style.marginTop = (height-33) +'px'
            document.getElementsByClassName("corner BLbtn" + " " + object.key)[0].style.marginLeft = '-5px'

            document.getElementsByClassName("corner BRbtn" + " " + object.key)[0].style.marginTop = (height -33) +'px'
            document.getElementsByClassName("corner BRbtn" + " " + object.key)[0].style.marginLeft =(width -5) +'px'

            document.getElementsByClassName("corner TLbtn" + " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner TLbtn"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner TRbtn"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner TRbtn"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner BLbtn"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner BLbtn"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner BRbtn"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner BRbtn"+ " " + object.key)[0].style.visibility = "visible";


            document.getElementsByClassName("middle")[0].addEventListener('click', function(event) {
                if (document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0] == undefined) {
                    return
                }
                var isClickInside = document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0].contains(event.target);
                if (!isClickInside) {
                    document.getElementsByClassName("corner TLbtn" + " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner TLbtn"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner TRbtn"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner TRbtn"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner BLbtn"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner BLbtn"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner BRbtn"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner BRbtn"+ " " + object.key)[0].style.visibility = "hidden";   
                    self.setState({currentControl: ""})             
                } 
                else 
                    self.setState({currentControl: object})
              });

            document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0].addEventListener('keydown',
             function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if (event.ctrlKey && event.key == 'd') {
                    var duplicate = Object.assign({}, self.state.currentControl);
                    duplicate.key = self.props.currentWireframe.controlList.length
                    self.addDuplicateButton(duplicate);
                }
                else if (event.key == "Delete") {
                    console.log(event.key)
                    if (document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0] == undefined) {
                        console.log("not defined")
                        return;
                    }
                    console.log(document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0])
                    document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0].parentNode.removeChild(document.getElementsByClassName("addedSubmitBtn" + " " + object.key)[0]);
                    for( var i = 0; i < props.currentWireframe.controlList.length; i++){ 
                        console.log('start')
                        console.log(props.currentWireframe.controlList[i].key)
                        console.log(state.currentControl.key)
                        if ( props.currentWireframe.controlList[i].key === self.state.currentControl.key) {
                            break;
                        }
                    }
                    self.setState({currentControl:""})

                }
               });
           }

           else if (object.objectType == "addedTextfield") {
            var height = object.height;
            var width = object.width;

            if (height.includes('px')) {
                height = height.slice(0, -2)
            }

            if (width.includes('px')) {
                width = width.slice(0, -2)
            }

            document.getElementsByClassName("corner TLtxt" + " " + object.key)[0].style.marginBottom = (height ) +'px'
            document.getElementsByClassName("corner TLtxt" + " " + object.key)[0].style.marginTop = '-25px'
            document.getElementsByClassName("corner TLtxt" + " " + object.key)[0].style.marginLeft = '-5px'

            document.getElementsByClassName("corner TRtxt" + " " + object.key)[0].style.marginBottom = (height ) +'px'
            document.getElementsByClassName("corner TRtxt" + " " + object.key)[0].style.marginTop = '-25px'
            document.getElementsByClassName("corner TRtxt" + " " + object.key)[0].style.marginLeft = (width -5) +'px'

            document.getElementsByClassName("corner BLtxt" + " " + object.key)[0].style.marginTop = (height-30) +'px'
            document.getElementsByClassName("corner BLtxt" + " " + object.key)[0].style.marginLeft = '-5px'

            document.getElementsByClassName("corner BRtxt" + " " + object.key)[0].style.marginTop = (height -30) +'px'
            document.getElementsByClassName("corner BRtxt" + " " + object.key)[0].style.marginLeft =(width -5) +'px'

            document.getElementsByClassName("corner TLtxt" + " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner TLtxt"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner TRtxt"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner TRtxt"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner BLtxt"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner BLtxt"+ " " + object.key)[0].style.visibility = "visible";
            document.getElementsByClassName("corner BRtxt"+ " " + object.key)[0].style.display = "block";
            document.getElementsByClassName("corner BRtxt"+ " " + object.key)[0].style.visibility = "visible";


            document.getElementsByClassName("middle")[0].addEventListener('click', function(event) {
                if (document.getElementsByClassName("addedTextfield" + " " + object.key)[0] == undefined) {
                    return
                }
                var isClickInside = document.getElementsByClassName("addedTextfield" + " " + object.key)[0].contains(event.target);
                if (!isClickInside) {
                    document.getElementsByClassName("corner TLtxt" + " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner TLtxt"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner TRtxt"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner TRtxt"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner BLtxt"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner BLtxt"+ " " + object.key)[0].style.visibility = "hidden";
                    document.getElementsByClassName("corner BRtxt"+ " " + object.key)[0].style.display = "none";
                    document.getElementsByClassName("corner BRtxt"+ " " + object.key)[0].style.visibility = "hidden";   
                    self.setState({currentControl: ""})             
                } 
                else 
                    self.setState({currentControl: object})
              });
            
            document.getElementsByClassName("addedTextfield" + " " + object.key)[0].addEventListener('keydown',
             function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if (event.ctrlKey && event.key == 'd') {
                    var duplicate = Object.assign({}, self.state.currentControl);
                    duplicate.key = self.props.currentWireframe.controlList.length
                    self.addDuplicateTextfield(duplicate);
                }
                else if (event.key == "Delete") {
                    if (document.getElementsByClassName("addedTextfield" + " " + object.key)[0] == undefined) {
                        console.log("not defined")
                        return;
                    }
                    console.log(document.getElementsByClassName("addedTextfield" + " " + object.key)[0])
                    document.getElementsByClassName("addedTextfield" + " " + object.key)[0].parentNode.removeChild(document.getElementsByClassName("addedTextfield" + " " + object.key)[0]);
                    for( var i = 0; i < props.currentWireframe.controlList.length; i++){ 
                        if ( props.currentWireframe.controlList[i].key === self.state.currentControl.key) {
                            // props.currentWireframe.controlList.splice(i, 1); 
                            // self.state.globalarr.splice(i, 1)
                            // props.currentWireframe.controlList = self.state.globalarr;
                            break;
                        }
                    }
                    self.setState({currentControl:""})

                }
               });
           }
           this.props.currentWireframe.controlList[this.state.currentControl.key] = this.state.currentControl
    }

    addDuplicateContainer = (object) => {
        const { globalarr} = this.state;
        const newTab = object ;
        newTab.xPosition = (object.xPosition + 100) 
        newTab.yPosition = (object.yPosition + 100) 

        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();
       
    }

    addContainer = () => {
        let object = {
            "key": this.props.currentWireframe.controlList.length,
            "objectType": "addedBox",
            "width": '100px',
            "height": '55px',
            "text": "",
            "fontSize": "",
            "backgroundColor": "#ffffff",
            "borderColor": "#000000",
            "borderThickness": '1',
            "borderRadius": '0',
            "textColor": "#000000",
            "xPosition": 10,
            "yPosition": 10
        }

        const { globalarr} = this.state;
        const newTab = object ;
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();
       
    }

    addDuplicateLabel = (object) => {
        const { globalarr} = this.state;
        const newTab = object ;
        newTab.xPosition = (object.xPosition + 100) 
        newTab.yPosition = (object.yPosition + 100) 
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();
    }

    addLabel = () => {
        let object = {
            "key": this.props.currentWireframe.controlList.length,
            "objectType": "addedlabelDiv",
            "width": '100px',
            "height": '25px',
            "text": "Unknown",
            "fontSize": "16",
            "backgroundColor": "#ffffff",
            "borderColor": "#ffffff",
            "borderThickness": '0',
            "borderRadius": '0',
            "textColor": "#000000",
            "xPosition": 10,
            "yPosition": 10
        }

        const { globalarr} = this.state;
        const newTab = object ;
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();


    }

    
    addDuplicateButton = (object) => {
        const { globalarr} = this.state;
        const newTab = object ;
        newTab.xPosition = (object.xPosition + 100) 
        newTab.yPosition = (object.yPosition + 100) 
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();

       
    }

    addButton = () => {
        let object = {
            "key": this.props.currentWireframe.controlList.length,
            "objectType": "addedSubmitBtn",
            "width": '130px',
            "height": '30px',
            "text": "Submit",
            "fontSize": "18",
            "backgroundColor": "#E6E6E6",
            "borderColor": "#000000",
            "borderThickness": '1',
            "borderRadius": '2',
            "textColor": "#000000",
            "xPosition": 10,
            "yPosition": 10
        }

        const { globalarr} = this.state;
        const newTab = object ;
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();
    }

    addDuplicateTextfield = (object) => {
        
        const { globalarr} = this.state;
        const newTab = object ;
        newTab.xPosition = (object.xPosition + 100) 
        newTab.yPosition = (object.yPosition + 100) 
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();
        
    }

    addTextfield = () => {
        let object = {
            "key": this.props.currentWireframe.controlList.length,
            "objectType": "addedTextfield",
            "width": '130px',
            "height": '23px',
            "text": "Input",
            "fontSize": "15",
            "backgroundColor": "#ffffff",
            "borderColor": "#000000",
            "borderThickness": '1',
            "borderRadius": '2',
            "textColor": "#000000",
            "xPosition": 10,
            "yPosition": 10
        }
        const { globalarr} = this.state;
        const newTab = object ;
        const newTabs = [...globalarr, newTab];
        this.setState({ globalarr: newTabs });        

        this.props.currentWireframe.controlList.push(object);
        this.checkEqual(this.props.currentWireframe, this.props.current);
        this.forceUpdate();
        
    }

    handleLabelChange = (e) => {
        
        if (this.state.currentControl.objectType == "addedlabelDiv") {
            var your_div = document.getElementsByClassName("addedlabelDiv" + " " + this.state.currentControl.key)[0];
            var text_to_change = your_div.childNodes[0].nextSibling;
            text_to_change.nodeValue = e.target.value;
            this.state.currentControl.text = e.target.value;
        }
           
        else if (this.state.currentControl.objectType == "addedTextfield") {
            var your_div = document.getElementsByClassName("addedTextfield"+ " " + this.state.currentControl.key)[0]
            var text_to_change = your_div.childNodes[0].nextSibling;
            text_to_change.nodeValue = e.target.value;
            this.state.currentControl.text = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedSubmitBtn") {
            var your_div = document.getElementsByClassName("addedSubmitBtn"+ " " + this.state.currentControl.key)[0]
            var text_to_change = your_div.childNodes[0].nextSibling;
            text_to_change.nodeValue = e.target.value;
            this.state.currentControl.text = e.target.value;

        }

        this.checkEqual(this.props.currentWireframe, this.props.current)
        this.forceUpdate();

    } 

    handleFontSizeChange = (e) => {
        if (this.state.currentControl.objectType == "addedlabelDiv") {
            document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.fontSize = e.target.value + 'px';
            this.state.currentControl.fontSize = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedTextfield") {
            document.getElementsByClassName("addedTextfield"+ " " + this.state.currentControl.key)[0].style.fontSize = e.target.value + 'px';
            this.state.currentControl.fontSize = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedSubmitBtn") {
            document.getElementsByClassName("addedSubmitBtn"+ " " + this.state.currentControl.key)[0].style.fontSize = e.target.value + 'px';
            this.state.currentControl.fontSize = e.target.value;
        }
        this.checkEqual(this.props.currentWireframe, this.props.current)
        this.forceUpdate();

    } 

    handleBorderThicknessChange = (e) => {

        if (this.state.currentControl.objectType == "addedlabelDiv") {
            // document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.border = 'solid';
            // document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].borderRadius = this.state.currentControl.borderRadius + 'px';
            // document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].borderColor = this.state.currentControl.borderColor;
            document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderWidth = e.target.value + 'px';
            this.state.currentControl.borderThickness = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedTextfield") {
            document.getElementsByClassName("addedTextfield"+ " " + this.state.currentControl.key)[0].style.borderWidth = e.target.value + 'px';
            this.state.currentControl.borderThickness = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedSubmitBtn") {
            document.getElementsByClassName("addedSubmitBtn"+ " " + this.state.currentControl.key)[0].style.borderWidth = e.target.value + 'px';
            this.state.currentControl.borderThickness = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedBox") {
            document.getElementsByClassName("addedBox"+ " " + this.state.currentControl.key)[0].style.borderWidth = e.target.value + 'px';
            this.state.currentControl.borderThickness = e.target.value;

        }
        this.checkEqual(this.props.currentWireframe, this.props.current)
        this.forceUpdate();

    } 

    handleBorderRadiusChange = (e) => {
        
        if (this.state.currentControl.objectType == "addedlabelDiv") {
            // document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.border = 'solid';
            // document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderWidth = this.state.currentControl.borderThickness + 'px';
            // document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderColor = this.state.currentControl.borderColor;
            document.getElementsByClassName("addedlabelDiv"+ " " + this.state.currentControl.key)[0].style.borderRadius = e.target.value + 'px';
            this.state.currentControl.borderRadius = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedTextfield") {
            document.getElementsByClassName("addedTextfield"+ " " + this.state.currentControl.key)[0].style.borderRadius = e.target.value + 'px';
            this.state.currentControl.borderRadius = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedSubmitBtn") {
            document.getElementsByClassName("addedSubmitBtn"+ " " + this.state.currentControl.key)[0].style.borderRadius = e.target.value + 'px';
            this.state.currentControl.borderRadius = e.target.value;
        }
        else if (this.state.currentControl.objectType == "addedBox") {
            document.getElementsByClassName("addedBox"+ " " + this.state.currentControl.key)[0].style.borderRadius = e.target.value + 'px';
            this.state.currentControl.borderRadius = e.target.value;
        }
        this.checkEqual(this.props.currentWireframe, this.props.current)
        this.forceUpdate();

    } 

    render() {
        const styles = reactCSS({
            'default': {
              color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
              },
              swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
              },
              popover: {
                position: 'absolute',
                zIndex: '2',
              },
              cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              },
            },
          });
        
          const styles1 = reactCSS({
            'default': {
              color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `rgba(${ this.state.color1.r }, ${ this.state.color1.g }, ${ this.state.color1.b }, ${ this.state.color1.a })`,
              },
              swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
              },
              popover: {
                position: 'absolute',
                zIndex: '2',
              },
              cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              },
            },
          });
      
        const auth = this.props.auth;
        const currentId = this.props.match.params.id
        const currentWireframe = this.props.currentWireframe;
        if (auth == undefined) {
            return <React.Fragment />
        }
        if (currentWireframe != undefined ) {
            // const temp = JSON.parse(JSON.stringify(currentWireframe.controlList));
            // for (var i =0; i < temp.length; i++) {
            //     temp[i].key = i;
            // }
            this.state.globalarr = currentWireframe.controlList;
            
        }
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if(!currentWireframe)
            return <React.Fragment />
        

        return (
            <div className="container white">
                <h4 className="grey-text text-darken-3 center">Wireframer</h4>
                <div className="input-field">
                    <input input type="text" name="name" id="name" onChange={this.handleChange} defaultValue={currentWireframe.name}/>
                    <label class="active" htmlFor="email">Name</label>
                </div>
            
            <div className = "row" >
                <span className="farLeft col s2 center">
                    <div className = "fourButtons row">
                        <div className = "col s3 center-align">
                            <a class = "waves-effect waves-red ">                            
                                <i class="material-icons small zoomIn" onClick = {this.zoomIn}>zoom_in</i>
                            </a>
                        </div>
                        <div className = "col s3 center-align">
                            <a class = "waves-effect waves-red ">                            
                            <i class="material-icons small zoomOut"onClick = {this.zoomOut}>zoom_out</i>
                            </a>
                        </div>
                        <div className = "col s3 center-align">
                            <a class = "waves-effect waves-red ">                            
                            <i class="material-icons small saveBtn" onClick = {this.saveWireframe}>save</i>
                            </a>
                        </div>
                        <div className = "col s3 center-align">
                            <a class = "waves-effect waves-red ">                            
                            {this.checkEqual(this.props.current, this.props.currentWireframe) ?  
                            <i class="material-icons small closeBtn1" onClick = {(e) => this.returnHome(e)}>close</i> : 

                            <Modal header="Close Wireframe?" actions={<p modal= "close"></p>} 
                            trigger={ <i class="material-icons small closeBtn1" >close </i>  }>
                            
                                <p><strong>Do you want to save changes made to your wireframe?</strong></p>
                                <p><strong>Your work will not be saved if you press no.</strong></p>

                                <Button className = "yes_button btn waves-effect waves-light blue lighten-2 modal-close" 
                                    onClick = {(e) => this.saveAndReturn(e)}>Yes
                                    <i class="material-icons right">send</i>                            
                                </Button>

                                <Button className = "no_button btn waves-effect waves-light blue lighten-2 modal-close" 
                                    onClick = {this.returnHome}>No
                                    <i class="material-icons right">cloud</i>                            
                                </Button>
        
                            </Modal>   
                        }                            
                        </a>
                        </div>
                        
                        
                    </div>
                    <div >
                        <input input type="text" name="name" id="name" onChange = {(e) => this.updateWidth(e)} />
                        <label class="active" >Width of Wireframe</label>
                        <input input type="text" name="name" id="name" onChange = {(e) => this.updateHeight(e)} />
                        <label className="active" >Height of Wireframe <br></br></label>
                        <Button className = "update btn waves-effect waves-light lighten-2 "  disabled={!this.state.update} onClick = {this.updateDimensions}>Update
                        </Button>
                    </div>

                    <div>
                        <br></br>
                        <div className = "box" onClick = {this.addContainer}></div>                        
                        <h6> Container<br></br></h6>
                        
                        <h6 className = "labelDiv" onClick = {this.addLabel}>  <br></br>Prompt for Input</h6>
                        <h6>Label<br></br></h6>
                        <br></br>

                        <div className = "submitBtn" onClick = {this.addButton}>Submit</div>   
                       
                        <h6> Button   <br></br></h6>
                        <br></br>

                        <div className = "txtfield" onClick = {this.addTextfield}>Input</div>                        
                        <h6> Textfield<br></br></h6>
                        <br></br>
                    </div>
                </span>

                <span className="middle col s8" >
                    <span className = "wireframeContainer" style = {{width: this.props.currentWireframe.width, height: this.props.currentWireframe.height}}>
                    {this.state.globalarr.map(object => 
                    <Rnd 
                        bounds = 'parent'
                        onDragStop={(e, d) => {
                            this.setState({ x: d.x, y: d.y });
                            object.xPosition = this.state.x;
                            object.yPosition = this.state.y;
                          }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            this.setState({
                              rndWidth: ref.style.width,
                              rndHeight: ref.style.height,
                              ...position
                            });
                            object.height = this.state.rndHeight;
                            object.width = this.state.rndWidth;
                          }}
                        default={{
                            x: object.xPosition,
                            y: object.yPosition,
                            width: object.width, 
                            height: object.height
                          }}
                        // size = {{ width: object.width, height:object.height}}
                        className= {'rndObj' + ' ' + object.objectType + " " + object.key} 
                        tabIndex = '1'
                        style = {{backgroundColor: object.backgroundColor, borderColor: object.borderColor,
                        borderWidth: object.borderThickness + 'px', fontSize: object.fontSize + 'px',
                        borderRadius: object.borderRadius + 'px', 
                        }} 
                        onClick = {() => this.clickAdded(object, this.state, this.props)}> {object.text}

                       <span className = {object.objectType == 'addedBox' ? "corner TL" + " " + object.key : 
                        object.objectType == 'addedlabelDiv' ? "corner TLlabel" + " " + 
                        object.key : object.objectType == 'addedSubmitBtn' ? "corner TLbtn" + " " + 
                        object.key : "corner TLtxt" + " " + object.key} 
                            style ={{display: 'none', visibility: 'hidden'}}> </span>
                        <span className = {object.objectType == 'addedBox' ? "corner TR" + " " + object.key : 
                        object.objectType == 'addedlabelDiv' ? "corner TRlabel" + " " + 
                        object.key : object.objectType == 'addedSubmitBtn' ? "corner TRbtn" + " " + 
                        object.key : "corner TRtxt" + " " + object.key} 
                            style ={{display: 'none', visibility: 'hidden'}}> </span>
                        <span className = {object.objectType == 'addedBox' ? "corner BL" + " " + object.key : 
                        object.objectType == 'addedlabelDiv' ? "corner BLlabel" + " " + 
                        object.key : object.objectType == 'addedSubmitBtn' ? "corner BLbtn" + " " + 
                        object.key : "corner BLtxt" + " " + object.key} 
                            style ={{display: 'none', visibility: 'hidden'}}> </span>
                        <span className = {object.objectType == 'addedBox' ? "corner BR" + " " + object.key : 
                        object.objectType == 'addedlabelDiv' ? "corner BRlabel" + " " + 
                        object.key : object.objectType == 'addedSubmitBtn' ? "corner BRbtn" + " " + 
                        object.key : "corner BRtxt" + " " + object.key} 
                            style ={{display: 'none', visibility: 'hidden'}}> </span> 
            
                        
                    </Rnd> ) }

                    </span>
                    
                
                </span>

                <span class="farRight col s2 center">
                    
                    <h5> Properties</h5>
                    <input input type="text" name="labelname" id="labelname" onChange = {(e) => this.handleLabelChange(e)}/>
                    <label class="active" >Label Name</label>
                    <input input type="text" name="font" id="font" onChange = {(e) => this.handleFontSizeChange(e)} />
                    <label className="active " >Font Size <br></br></label>
                    {/* <input type="text" defaultValue = "FONT SIZE"></input> */}
                    
                    <h7> <br></br> Background Color: </h7>
                    <div id = "backColor"> 
                        <div style={ styles.swatch } onClick={ this.handleClickColor }>
                        <div style={ styles.color } />
                        </div>
                        { this.state.displayColorPicker ? <div style={ styles.popover }>
                        <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                        <SketchPicker id = "sketch" color={ this.state.color } onChange={ this.handleChangeColor } />
                        </div> : null }
                    </div>
                    {/* <input class = "right" type="color" value="#e66465" ></input> */}
                    <br></br>
                    <h7> <br></br>Border Color: </h7>
                    <div id = "bordColor"> 
                        <div style={ styles1.swatch } onClick={ this.handleClickColor1 }>
                            <div style={ styles1.color } />
                        </div>
                        { this.state.displayColorPicker1 ? <div style={ styles1.popover }>
                        <div style={ styles1.cover } onClick={ this.handleCloseColor1 }/>
                        <SketchPicker color={ this.state.color1 } onChange={ this.handleChangeColor1 }> </SketchPicker>
                        {/* <SketchPicker color={ this.state.color1 } onChange={ this.handleChangeColor1 } /> */}
                        </div> : null }
                    </div>
                    {/* <input className = "right" type="color" value="#e66465"></input> */}
                    <input input type="text" name="thick" id="thick" onChange = {(e) => this.handleBorderThicknessChange(e)}/>
                    <label class="active" >Border Thickness</label>
                    <input input type="text" name="radius" id="radius" onChange = {(e) => this.handleBorderRadiusChange(e)} />
                    <label className="active "> Border Radius <br></br></label>

                </span>

               </div>
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;

    if(state.firestore.data.allWireframes == undefined)
        return;


    const listOfWireframes = state.firestore.data.allWireframes
    const arrayWireframe = state.firestore.ordered.allWireframes
    // console.log(state.firestore.ordered.allWireframes)
    const currentWireframe = state.firestore.data.allWireframes[id]
    var current = Object.assign({}, currentWireframe);

    if (currentWireframe != undefined) {
        const control = JSON.parse(JSON.stringify(currentWireframe.controlList));
        current.controlList = control;
        currentWireframe.id = id;
    }
    
    return {
        currentWireframe, listOfWireframes, id, current, arrayWireframe,
        profile: state.firebase.profile,
        auth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => ({
    registerName: (currentWireframe, firebase, newName, id, uid) => dispatch(updateHandlerName(currentWireframe, firebase, newName, id, uid)),
  });


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'allWireframes', },
  ]),
)(EditScreen);