(function () {

})();
//замена кнопки file по умолчанию
function HandleBrowseClick() {
    var fileinput = document.getElementById("browse");
    fileinput.click();
}

function Handlechange() {
    var fileinput = document.getElementById("browse");
    var textinput = document.getElementById("filename");
    textinput.value = fileinput.value;
}
//