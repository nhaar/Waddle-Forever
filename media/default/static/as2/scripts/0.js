window.onload = function() {
    const sizeButton = document.getElementById("bigscreen");
    const langSelect = document.getElementById("langselect");
    const noFlash = document.getElementById("noflash");
    const game = document.getElementById("game");
    const afterGame = game.nextElementSibling;
    let border;
    const toggle = function() {
        const image = sizeButton.children[0];
        if (image.id.substr(0, 2) == "sm") {
            image.id = image.id.replace("sm", "big");
            border = document.createElement("div");
            border.classList.add("border");
            game.parentElement.removeChild(game);
            [game.width, game.height] = ["760px", "480px"];
            document.body.insertBefore(border, afterGame);
            border.appendChild(game);
            window.location.hash = "small";
            noFlash.style.marginTop = "-10px";
            setCookie("size", "small");
        } else {
            image.id = image.id.replace("big", "sm");
            border.parentElement.removeChild(border);
            [game.width, game.height] = ["100%", "98%"];
            document.body.insertBefore(game, afterGame);
            window.location.hash = "";
            noFlash.style.marginTop = "0";
            setCookie("size", "big");
        }
    }
    if (window.location.hash == "#small" || getCookie("size") == "small") {
        toggle();
    }
    sizeButton.onmouseup = toggle;
    
    langSelect.onchange = function() {
        location = this.options[this.selectedIndex].value;
    }
}