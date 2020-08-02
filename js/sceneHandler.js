/**
 * Author: Daniel Elias
 * Year: 2020
 * Sets the event listener for buttons in HTML and interactions in the canvas
 */

function initControls(){
    //Icons
    document.getElementById('smiley').addEventListener('click', App.changeIcon);
    document.getElementById('wink').addEventListener('click', App.changeIcon);
    document.getElementById('laugh').addEventListener('click', App.changeIcon);
    document.getElementById('star').addEventListener('click', App.changeIcon);
    document.getElementById('heart').addEventListener('click', App.changeIcon);
    document.getElementById('flag').addEventListener('click', App.changeIcon);
    document.getElementById('ny').addEventListener('click', App.changeIcon);
    document.getElementById('plane').addEventListener('click', App.changeIcon);
    document.getElementById('earth').addEventListener('click', App.changeIcon);
    document.getElementById('girl').addEventListener('click', App.changeIcon);
    document.getElementById('factory').addEventListener('click', App.changeIcon);
    document.getElementById('boy').addEventListener('click', App.changeIcon);
    document.getElementById('email').addEventListener('click', App.changeIcon);
    document.getElementById('web').addEventListener('click', App.changeIcon);
    document.getElementById('laptop').addEventListener('click', App.changeIcon);
    //Colors
    document.getElementById('f6b923').addEventListener('click', App.changeColor);
    document.getElementById('ff760e').addEventListener('click', App.changeColor);
    document.getElementById('fb2323').addEventListener('click', App.changeColor);
    document.getElementById('fdd25c').addEventListener('click', App.changeColor);
    document.getElementById('a9f352').addEventListener('click', App.changeColor);
    document.getElementById('ff947a').addEventListener('click', App.changeColor);
    document.getElementById('77b8a0').addEventListener('click', App.changeColor);
    document.getElementById('bf83ff').addEventListener('click', App.changeColor);
    document.getElementById('ff6291').addEventListener('click', App.changeColor);
    //Interaction click events
    App.canvas.addEventListener('mousedown', App.onDocumentMouseDown);
    
}