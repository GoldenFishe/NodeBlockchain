"use strict";

document.getElementById('blocks').onclick = () => {
    fetch('/blocks', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(json => {
        console.log(json);
    })
};

document.getElementById('mine').onclick = () => {
    fetch('/mine', {
        method: 'POST',
        body: {
            data: 'First block'
        }
    }).then(() => {
        fetch('/blocks', {
            method: 'GET'
        }).then(res => {
            return res.json();
        }).then(json => {
            console.log(json);
        })
    });
};