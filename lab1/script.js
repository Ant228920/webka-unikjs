document.body.innerHTML = "<div>Hello, World!</div> <button onmouseout=\"Change()\" style=\"width: 100px; height: 100px\">Button</button>"

function Change() {
    let element = document.getElementsByTagName('div');
    for(let elem of element){
        elem.innerHTML = "My name";
    }

}



