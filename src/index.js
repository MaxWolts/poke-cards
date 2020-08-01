async function pokemonCards (num , $body){
    async function call (num){
        aux = parseInt(num)
        if (aux < 650 || !aux){
            if (!aux){
                num = num.toLowerCase()
            }
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
                const data = await response.json()
                //evita pokemon fuera del rango
                if(data.id < 650){
                    return data;
                }else{
                    return 0
                }
            } catch (error) {
                return 0
            }
        }else return 0
    }
    function featuringTemplate(poke) {
        let aux = '<h4>Type:</h4>'
        poke.types.forEach(element => {
            aux = aux + `<p class="type ${element.type.name}">${element.type.name} </p>`
        });
        return (
            `
                <div class="card ${poke.types[0].type.name} fadeIn">
                    <h1 class="card-name">${poke.name.toUpperCase()}</h1>
                    <a class="card-shiny">✨</a>
                    <p class="card-number">N° ${poke.id}</p>
                    <div class="card-img">
                        <div class="img-content">
                            <img src=${poke.sprites.front_default} alt="">
                            <img src=${poke.sprites.back_default} alt="">
                        </div>
                        <div class="img-content-shiny">
                            <img src=${poke.sprites.front_shiny} alt="">
                            <img src=${poke.sprites.back_shiny} alt="">
                        </div>
                    </div>
                    <div class="card-types">${aux}
                    </div>
                    <h4>Stats:</h4>
                    <div class="card-stats">
                        <p class="stat">HP:${poke.stats[0].base_stat}</p>
                        <p class="stat">Atk: ${poke.stats[1].base_stat}</p>
                        <p class="stat">Def: ${poke.stats[2].base_stat}</p>
                        <p class="stat">SA: ${poke.stats[3].base_stat}</p>
                        <p class="stat">SD: ${poke.stats[4].base_stat}</p>
                        <p class="stat">SP: ${poke.stats[5].base_stat}</p>
                    </div>
                </div>
                `
        )
    }
    function createTempLate(HTMLString) {
        const html = document.implementation.createHTMLDocument()
        html.body.innerHTML = HTMLString
        return html.body.children[0]
    }
    function featuringTemplateError() {
        let aux = '<h4>Type: NaN </h4>' + `<p class="type: unknown"></p>`
        return (
            `
                <div class="card normal fadeIn error">
                    <h1 class="card-name">Error</h1>
                    <a class="card-shiny">✨</a>
                    <p class="card-number"><small><strong>Pokémon no encontrado</strong></small></p>
                    <div class="card-img">
                        <div class="img-content">
                            <img src="./src/img/errorNormal.png">
                        </div>
                        <div class="img-content-shiny">
                            <img src="./src/img/errorShiny.png" alt="">

                        </div>
                    </div>
                    <div class="card-types"> <h4> Type: NaN </h4>
                    </div>
                    <h4>Stats:</h4>
                    <div class="card-stats">
                        <p class="stat">HP:99</p>
                        <p class="stat">Atk: 99</p>
                        <p class="stat">Def: 99</p>
                        <p class="stat">SA: 99</p>
                        <p class="stat">SD: 99</p>
                        <p class="stat">SP: 99</p>
                    </div>
                </div>
                `
        )
    }
    let poke = await call(num)
    if(poke != 0){
        let template = featuringTemplate(poke)
        const pokeElement = createTempLate(template)
        $body.append(pokeElement)
        $body.children[0].remove()
    }else {
        let template = featuringTemplateError()
        const pokeElement = createTempLate(template)
        $body.append(pokeElement)
        $body.children[0].remove()
    }
}
(async function exampleCards() {
    let num
    const $body = document.querySelector("body > section.cards-example")
    for(let i=0; i < 5 ; i++){
        loadGif($body.children[i])
    }
    for(let i = 0; i < 5; i++){
        num = Math.floor(Math.random() * (650 - 1) + 1)
        await pokemonCards(num, $body.children[i])
        $body.children[i].children[0]
    }
    shiny()
    //hacer visible el boton
    for(let i = 0;i < 5 ; i++){
        $body.children[i].children[0].children[1].style.display = "block"
    }
})()
//functions shiny
function shiny () {
    const $cards = document.querySelector("body > section.cards-example")
    for (let i = 0; i < 5; i++) {
        let $childCard = $cards.children[i].children[0]
        $childCard.children[1].addEventListener('click', () => {
            let $containerImgs = $childCard.children[3]
            let $container1 = $containerImgs.children[0]
            let $container2 = $containerImgs.children[1]
            changeDisplay($container1, $container2)
        })
    }
}
function changeDisplay($container1, $container2){
    let styleC = window.getComputedStyle($container1)
    let display = styleC.getPropertyValue('display');
    if (display == 'block') {
        $container1.style.display = 'none'
        $container2.style.display = 'block'
    } else {
        $container1.style.display = 'block'
        $container2.style.display = 'none'
    }
}
//add load.gif
function setAttributes($element, attributes) {
    for (const attribute in attributes) {
        $element.setAttribute(attribute, attributes[attribute])
    }
}
function loadGif($card){
    const $loader = document.createElement('img')
    setAttributes($loader, {
        src: 'src/img/loader.gif',
        height: 50,
        width: 50,
    })
    $card.append($loader)
}
//carta buscada
let $card = document.querySelector("body > section.card-search")
let $form = document.querySelector("body > div > form")
$form.addEventListener('submit', async (event) => {
    const data = new FormData($form)
    event.preventDefault()
    let aux = $card.childElementCount 
    //img load
    loadGif($card)
    //eliminar cartas
    if ( aux >= 1){
        $card.children[0].remove()
    }
    $form.style.display = 'none'
    if ($card.childElementCount <= 1){
        await pokemonCards(data.get('name'), $card)
        //shiny
        setTimeout( () => {$card.children[0].children[1].addEventListener('click', ()=>{
            let $childCard = $card.children[0].children[3]
            let $container1 = $childCard.children[0]
            let $container2 = $childCard.children[1]
            changeDisplay($container1, $container2)
        }   
        )} ,0)
        //hacer visible el boton
        setTimeout(() => {
            $card.children[0].children[1].style.display = "block"
            $form.style.display = 'block'
        },0)
    }
    //up al cargar
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
})
