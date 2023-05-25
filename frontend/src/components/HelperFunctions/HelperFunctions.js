

// setTimeout(function(){
//     var userselection = window.getSelection(); //user selection will be a Selection-Object
//     var rangeObject = userselection.getRangeAt(0);
//     userselection.empty()
// },100)


import {useCallback} from "react";

export function ClickOnBaseIndex(e, InARel = undefined, SetInARel=undefined){
    e.preventDefault()
    console.log(e.key,e.keyCode)
    if(InARel !== undefined && SetInARel !== undefined){

            ['source','predicate','target'].map(s=>{
            let target = document.getElementById(s)
            let sources = Array.from(document.getElementsByClassName(s))
            if(target !== null){

                sources.map(el=>{
                    el.classList.remove(s)
                    console.log('childre',target.children)


                })
                Array.from(document.querySelectorAll('div[class^="bulls"]')).map(e=>{
                    if(e.parentElement.id.toLowerCase() === s){
                        target.removeChild(e)

                    }
                })
                if(target.childNodes){
                    console.log('node',target.childNodes)
                    target.replaceWith(...target.childNodes)
                }

                else{
                    target.remove()
                }

            }

            // sources.map(el=>{
            //     el.classList.remove(nodetype)
            //     console.log('childre',target.children)
            // })


        })


        // let target ='';


        // qui devo fare l'unwrap di tutto
        SetInARel(false)


    }
}


export function DeleteRange(SetStart=undefined,SetEnd=undefined,SetFirstSelected=undefined,SetSecondSelected=undefined,SetCurrentDiv=undefined){
    console.log('deleterange')
    try {
        if (window.getSelection && window.getSelection()) {
            var s = window.getSelection();
            // console.log('delete s', s)
            if (s.rangeCount > 0) {
                var range = s.getRangeAt(0);
                var node_id = range.startContainer.parentNode.id
                console.log('nodeid', node_id)
                if (node_id !== null && node_id !== undefined && node_id !== '') {
                    var child = document.getElementById(node_id)
                    var parent = document.getElementById('paper_doc')
                    // console.log('parent0', node_id)
                    // console.log('parent1', parent)
                    // console.log('parent2', child)
                    if (parent.contains(child) || parent === child) {
                        // s.empty()
                        if (s.rangeCount > 0) {
                            var sel = window.getSelection()

                            if (window.getSelection().empty) {  // Chrome
                                setTimeout(function(){
                                    // console.log('timeout 1')
                                    var userselection = window.getSelection(); //user selection will be a Selection-Object
                                    // var rangeObject = userselection.getRangeAt(0);
                                    userselection.empty()
                                },0.0)
                                // console.log('EMPTY',s.rangeCount)
                                // for(let i = 0; i < sel.rangeCount; i++) {
                                //     if(sel.getRangeAt(i)){
                                //         // s.removeRange(s.getRangeAt(i))
                                //         // sel.empty()
                                //         let range = sel.getRangeAt(i)
                                //         console.log('range found', i,range)
                                //         sel.empty();
                                // window.getSelection().empty()
                                        // window.getSelection().empty();
                                }

                            }

                            // }
                            else if (window.getSelection().removeAllRanges) {  // Firefox
                                // console.log('EMPTY FIREFOX',window.getSelection().removeAllRanges)
                                setTimeout(function(){
                                    // console.log('timeout')
                                    var userselection = window.getSelection(); //user selection will be a Selection-Object
                                    // var rangeObject = userselection.getRangeAt(0);
                                    userselection.removeAllRanges()
                                },0.0)
                                // window.getSelection().removeAllRanges()

                            }
                        }
                    }

                }


            } else if (document.selection) {  // IE?
                var s = window.getSelection();
                if (s.rangeCount > 0) {
                    var range = s.getRangeAt(0);

                    var node_id = range.startContainer.parentNode.id
                    var child = document.getElementById(node_id)
                    var parent = document.getElementById('paper_doc')
                    // console.log('parent1', parent)
                    // console.log('parent2', child)
                    if (parent.contains(child) || parent === child) {
                        document.selection.empty();
                    }
                }
            } else {
                console.log('selected no')
            }
            if (SetStart !== undefined && SetEnd !== undefined && SetCurrentDiv !== undefined && SetFirstSelected !== undefined && SetSecondSelected !== undefined) {
                SetStart(false)
                SetEnd(false)
                SetFirstSelected(false)
                SetSecondSelected(false)
                SetCurrentDiv(false)
            }


    }catch(err){
        console.log('ERROR DELETING RANGE')

    }



}

export const updateMentionColor = (mentions_classes,start,stop,concepts,AreasColors) => {
    // console.log('eccomi')
    let concepts_mention = concepts.filter(x=>x.start === start && x.stop === stop)
    waitForElm('.'+mentions_classes).then((mention) => {

        // waitForElm('#'+props.mention_id).then((mention) => {
        console.log('props',mention)
        if(concepts_mention.length === 0){
            mention.style.color = 'rgb(65,105,225)'
            mention.style.backgroundColor = 'rgba(65,105,225,0.1)';

        }
        else if(concepts_mention.length === 1){
            let area = concepts_mention[0]['concept']['area']
            let color_0 = AreasColors[area]

            mention.style.color = color_0
            console.log('colore ',color_0,AreasColors)
            mention.style.backgroundColor = color_0.replace('1)','0.1)')

        }
        else if(concepts_mention.length > 1){
            let color_0 = 'rgba(50,50,50,1)'

            mention.style.color = color_0
            console.log('colore ',color_0,AreasColors)
            mention.style.backgroundColor = color_0.replace('1)','0.1)')

        }
    })


}

export const clearMentionsFromBorder = (id_mention) =>{
    let elements = Array.from(document.getElementsByClassName('men'))
    elements.map(e=>e.style.borderWidth = '0px')
    let e = document.getElementById(id_mention)
    console.log(e)
    if(e){
        e.style.color='';
        e.style.backgroundColor = ''
        e.style.fontWeight = ''

    }



}
export const clearConceptsFromBorder = () =>{
    let elements = Array.from(document.getElementsByClassName('mentionButton'))
    elements.map(e=> {
        // let e = document.getElementById(id_mention)
        // console.log(e)
        if (e) {
            e.style.color = '';
            e.style.backgroundColor = ''
            e.style.fontWeight = ''

        }
    })



}



export const highlightMention = (mention) =>{

    let elements = Array.from(document.getElementsByClassName(mention.mentions))

    let color = 'rgba(65,105,225,1)'
    let background_color = 'rgba(65,105,225,0.1)'
    // itero su elementi aventi mention desiderata
    if (elements.length > 0){
        elements.map(element=>{
            let classes = Array.from(element.classList)
            // elementi overlapping con mention desiderata
            classes = classes.filter(x=>x.startsWith('mention_'))
            // annullo precedenti selezioni sulle overlapping e non
            classes.map(classe=>{
                if (document.getElementById(classe)) {
                    document.getElementById(classe).style.fontWeight = ''
                    document.getElementById(classe).style.color = ''
                    document.getElementById(classe).style.backgroundColor = ''
                    let class_elements = Array.from(document.getElementsByClassName(classe))
                    class_elements.map(c=>{
                        c.style.borderWidth = '0px'
                    })
                }

                if(classes.length === 1 && classes[0] === mention.mentions){
                    // class_elements.map(c=>{
                    //     if(Array.from(c.classList).filter(x=>x.startsWith('mention_')).length === 1){
                    //         color = c.style.color
                    //         background_color = c.style.backgroundColor
                    //     }
                    // })
                    color = element.style.color
                    background_color = element.style.backgroundColor
                    console.log(color,background_color)

                }
                // class_elements.map(c=>{
                //     c.style.borderWidth = '0'
                // })
                element.style.borderWidth = '0'
            })

        })
        // elements.map(e=>{
        //     e.style.color = color
        //     e.style.backgroundColor = background_color
        // })
    }
    if (document.getElementById(mention.mentions)) {
        document.getElementById(mention.mentions).style.fontWeight = 'bold'
        document.getElementById(mention.mentions).style.color = color
        document.getElementById(mention.mentions).style.backgroundColor = background_color
    }

    console.log('mentions',elements)
    elements.map(e=>{
        e.style.borderTop = '2px solid'
        e.style.borderBottom = '2px solid'
        e.style.borderColor = e.style.color
        if (elements.length === 1) {
            e.style.borderLeft = '2px solid'
            e.style.borderRight = '2px solid'

        } else if (elements.indexOf(e) === 0) {
            e.style.borderLeft = '2px solid'
            e.style.borderRight = '0px'

        } else if (elements.indexOf(e) === elements.length - 1) {
            e.style.borderRight = '2px solid'
            e.style.borderLeft = '0px'
        }

    })


}



export const RemovehighlightMention = (mention) =>{

    let elements = Array.from(document.getElementsByClassName(mention.mentions))

    let color = 'rgba(65,105,225,1)'
    let background_color = 'rgba(65,105,225,0.1)'
    // itero su elementi aventi mention desiderata
    if (elements.length > 0){
        elements.map(element=>{
            let classes = Array.from(element.classList)
            // elementi overlapping con mention desiderata
            classes = classes.filter(x=>x.startsWith('mention_'))
            // annullo precedenti selezioni sulle overlapping e non
            classes.map(classe=>{
                if (document.getElementById(classe)) {
                    document.getElementById(classe).style.fontWeight = ''
                    document.getElementById(classe).style.color = ''
                    document.getElementById(classe).style.backgroundColor = ''
                    let class_elements = Array.from(document.getElementsByClassName(classe))
                    class_elements.map(c=>{
                        c.style.borderWidth = '0px'
                    })
                }

                if(classes.length === 1 && classes[0] === mention.mentions){
                    // class_elements.map(c=>{
                    //     if(Array.from(c.classList).filter(x=>x.startsWith('mention_')).length === 1){
                    //         color = c.style.color
                    //         background_color = c.style.backgroundColor
                    //     }
                    // })
                    color = element.style.color
                    background_color = element.style.backgroundColor
                    console.log(color,background_color)

                }
                // class_elements.map(c=>{
                //     c.style.borderWidth = '0'
                // })
                element.style.borderWidth = '0'
            })

        })
        elements.map(e=>{
            e.style.color = color
            e.style.backgroundColor = background_color
        })
    }

    //per i concetti
    elements.map(element=>{
        let element_id = element.id.split('_')
        let classes = Array.from(element.classList)
        // elementi overlapping con mention desiderata
        classes = classes.filter(x=>x.startsWith('mention_'))
        // annullo precedenti selezioni sulle overlapping e non
        classes.map(classe=> {
            let elements_class = Array.from(document.getElementsByClassName(classe))
            elements_class.map(e => {
                console.log(e.style.borderWidth)
                if (e.style.borderWidth !== '0px' && e.style.borderWidth !== '0' && e.style.borderWidth !== '') {
                    element.style.borderTop = '2px solid'
                    element.style.borderBottom = '2px solid'
                    element.style.borderColor = element.style.color
                    let e_id = e.id.split('_')
                    if (elements_class.length === 1) {
                        element.style.borderLeft = '2px solid'
                        element.style.borderRight = '2px solid'

                    } else if (parseInt(e_id[e_id.length -1]) > parseInt(element_id[element_id.length -1])) {
                        element.style.borderLeft = '2px solid'
                        element.style.borderRight = '0px'

                    } else if (parseInt(e_id[e_id.length -1]) < parseInt(element_id[element_id.length -1])) {
                        element.style.borderRight = '2px solid'
                        element.style.borderLeft = '0px'
                    }
                }
            })

        })
    })



    // if (document.getElementById(mention.mentions)) {
    //     document.getElementById(mention.mentions).style.fontWeight = 'bold'
    //     document.getElementById(mention.mentions).style.color = color
    //     document.getElementById(mention.mentions).style.backgroundColor = background_color
    // }
    //
    // console.log('mentions',elements)
    // elements.map(e=>{
    //     e.style.borderTop = '2px solid'
    //     e.style.borderBottom = '2px solid'
    //     e.style.borderColor = color
    //     if (elements.length === 1) {
    //         e.style.borderLeft = '2px solid'
    //         e.style.borderRight = '2px solid'
    //
    //     } else if (elements.indexOf(e) === 0) {
    //         e.style.borderLeft = '2px solid'
    //         e.style.borderRight = '0px'
    //
    //     } else if (elements.indexOf(e) === elements.length - 1) {
    //         e.style.borderRight = '2px solid'
    //         e.style.borderLeft = '0px'
    //     }
    //
    // })


}





export const recomputeColor = (mention_prop,appearborder)=>{

    let all_mentions = Array.from(document.getElementsByClassName('men'))
    let mentions_to_hgih = []
    mention_prop.mentions.split(' ').map(c=>{
        all_mentions.map(t=>{
            let t_classes = Array.from(t.classList)
            if(t_classes.indexOf(c) !== -1){
                mentions_to_hgih.push(t)
                if(appearborder === false){
                    t.style.border = '0px'
                }

            }
        })

    })
    let color = 'rgba(65,105,225,1)'
    let background_color = 'rgba(65,105,225,0.1)'
    mentions_to_hgih.map((mention,i)=>{
        let classes_mention = Array.from(mention.classList).filter(x => x.startsWith('mention_'))
        if(classes_mention.length === 1){
            color = mention.style.color
            background_color = mention.style.backgroundColor
            mentions_to_hgih.map(m=>{
                let classes_m = Array.from(m.classList).filter(x => x.startsWith('mention_'))
                if(classes_m.length > 1) {
                    m.style.color = color
                    m.style.backgroundColor = background_color
                }
            })
        }
    mentions_to_hgih.map((mention,i)=> {
        if (appearborder) {
            if (document.getElementById(mention_prop.mentions)) {
                document.getElementById(mention_prop.mentions).style.fontWeight = 'bold'
                document.getElementById(mention_prop.mentions).style.color = color
                document.getElementById(mention_prop.mentions).style.backgroundColor = background_color
            }

            mention.style.borderTop = '2px solid'
            mention.style.borderBottom = '2px solid'
            mention.style.borderColor = color
            if (mentions_to_hgih.length === 1) {
                mention.style.borderLeft = '2px solid'
                mention.style.borderRight = '2px solid'
            } else if (i === 0) {
                mention.style.borderLeft = '2px solid'
                mention.style.borderRight = '0px'
            } else if (i === mentions_to_hgih.length - 1) {
                mention.style.borderRight = '2px solid'
                mention.style.borderLeft = '0px'

            }
        } else {
            document.getElementById(mention_prop.mentions).style.fontWeight = 'normal'
            document.getElementById(mention_prop.mentions).style.color = ''
            document.getElementById(mention_prop.mentions).style.backgroundColor = ''
            if (Array.from(mention.classList).indexOf('underlined') !== -1) {

                let overlapping_classes = Array.from(mention.classList).filter(x => x.startsWith('mention_'))
                console.log(overlapping_classes)

                overlapping_classes.map(classe => {
                    if (classe !== mention_prop.mentions) {
                        console.log(document.getElementsByClassName(classe))
                        let elements = Array.from(document.getElementsByClassName(classe))
                        console.log(elements)
                        elements.map(e => console.log(e.style.border))
                        if (elements.filter(x => x.style.border !== '0px').length > 0) {
                            mention.style.borderTop = '2px solid'
                            mention.style.borderBottom = '2px solid'
                            mention.style.borderColor = color
                            if (mentions_to_hgih.length === 1) {
                                mention.style.borderLeft = '2px solid'
                                mention.style.borderRight = '2px solid'
                            } else if (elements.indexOf(mention) === 0) {
                                mention.style.borderLeft = '2px solid'
                                mention.style.borderRight = '0px'

                            } else if (elements.indexOf(mention) === elements.length - 1) {
                                mention.style.borderRight = '2px solid'
                                mention.style.borderLeft = '0px'
                            }
                        }
                    }

                })

            }
        }


    })

    })





}

export const recomputeConceptColor = (mention_prop,appearborder)=>{

    let all_mentions = Array.from(document.getElementsByClassName('men'))
    let mentions_to_hgih = []
    mention_prop.split(' ').map(c=>{
        all_mentions.map(t=>{
            let t_classes = Array.from(t.classList)
            if(t_classes.indexOf(c) !== -1){
                mentions_to_hgih.push(t)
                if(appearborder === false){
                    t.style.border = '0px'
                }

            }
        })

    })
    mentions_to_hgih.map((mention,i)=>{
        let classes_mention = Array.from(mention.classList).filter(x => x.startsWith('mention_'))
        let color = 'rgba(65,105,225,1)'
        let background_color = 'rgba(65,105,225,0.1)'
        if(classes_mention.length === 1){
            color = mention.style.color
            background_color = mention.style.backgroundColor
            mentions_to_hgih.map(m=>{
                let classes_m = Array.from(m.classList).filter(x => x.startsWith('mention_'))
                if(classes_m.length > 1) {
                    m.style.color = color
                    m.style.backgroundColor = background_color
                }
            })
        }
        if(appearborder){

            mention.style.borderTop = '2px solid'
            mention.style.borderBottom = '2px solid'
            mention.style.borderColor = color
            if(mentions_to_hgih.length === 1){
                mention.style.borderLeft = '2px solid'
                mention.style.borderRight = '2px solid'
            }else if(i === 0){
                mention.style.borderLeft = '2px solid'
                mention.style.borderRight = '0px'
            }
            else if(i === mentions_to_hgih.length -1){
                mention.style.borderRight = '2px solid'
                mention.style.borderLeft = '0px'

            }
        }else{
            // document.getElementById(concept).style.fontWeight = 'normal'
            // document.getElementById(concept).style.color = ''
            // document.getElementById(concept).style.backgroundColor = ''
            if(Array.from(mention.classList).indexOf('underlined') !== -1){

                let overlapping_classes = Array.from(mention.classList).filter(x=>x.startsWith('mention_'))
                console.log(overlapping_classes)

                overlapping_classes.map(classe=>{
                    if (classe !== mention_prop){
                        console.log(document.getElementsByClassName(classe))
                        let elements = Array.from(document.getElementsByClassName(classe))
                        console.log(elements)
                        elements.map(e=>console.log(e.style.border))
                        if(elements.filter(x=>x.style.border !== '0px').length > 0){
                            mention.style.borderTop = '2px solid'
                            mention.style.borderBottom = '2px solid'
                            mention.style.borderColor = color
                            if(mentions_to_hgih.length === 1){
                                mention.style.borderLeft = '2px solid'
                                mention.style.borderRight = '2px solid'
                            }else if(elements.indexOf(mention) === 0){
                                mention.style.borderLeft = '2px solid'
                                mention.style.borderRight = '0px'

                            }
                            else if(elements.indexOf(mention) === elements.length -1){
                                mention.style.borderRight = '2px solid'
                                mention.style.borderLeft = '0px'
                            }
                        }
                    }

                })

            }
        }




    })





}
export const updateRelMentionColor = (role,mention_init = null) => {


    if(!role){
        let sources =  Array.from(document.getElementsByClassName('source'))
        let sources_c = sources.map(source=>source.classList)
        sources_c = sources_c.map(x=>[...x])
        let sources_classes = []
        sources_c.map(x=>{
            console.log(x)
            let c = []
            x.map(y=>{
                if(y.startsWith('mention_')){
                    c.push(y)

                }
            })
            sources_classes.push(c)
        })


        // sources_classes = sources_classes.filter(x=>x.startsWith('mention_'))
        let predicates =  Array.from(document.getElementsByClassName('predicate'))
        let predicates_c = predicates.map(source=>source.classList)
        predicates_c = predicates_c.map(x=>[...x])
        let predicates_classes = []
        predicates_c.map(x=>{
            let c = []
            x.map(y=>{
                if(y.startsWith('mention_')){
                    c.push(y)

                }
            })
            predicates_classes.push(c)
        })
        // predicates_classes = predicates_classes.filter(x=>x.startsWith('mention_'))
        let target =  Array.from(document.getElementsByClassName('target'))
        let target_c = target.map(source=>source.classList)
        target_c = target_c.map(x=>[...x])
        let target_classes = []
        target_c.map(x=>{
            let c = []
            x.map(y=>{
                if(y.startsWith('mention_')){
                    c.push(y)

                }
            })
            target_classes.push(c)
        })        // target_classes = target_classes.filter(x=>x.startsWith('mention_'))

        sources_classes.map(x=>{
            let elements = Array.from(document.getElementsByClassName(x))
            console.log(elements)
            elements.map(e=>{
                e.classList.remove('predicate')
                e.classList.remove('target')
                e.classList.remove('source')
                e.classList.add('source')
            })

        })
        predicates_classes.map(x=>{
            let elements = Array.from(document.getElementsByClassName(x))
            elements.map(e=>{
                e.classList.remove('predicate')
                e.classList.remove('target')
                e.classList.remove('source')
                e.classList.add('predicate')
            })

        })
        target_classes.map(x=>{
            let elements = Array.from(document.getElementsByClassName(x))
            elements.map(e=>{
                e.classList.remove('predicate')
                e.classList.remove('target')
                e.classList.remove('source')
                e.classList.add('target')
            })

        })

    }else{
        console.log(Array.from(document.getElementsByClassName(mention_init)))
        Array.from(document.getElementsByClassName(mention_init)).map((mention) => {
            // mentions.map((mention) => {
            mention.classList.remove('predicate')
            mention.classList.remove('target')
            mention.classList.remove('source')

            mention.classList.add(role.toLowerCase())
            // waitForElm('#'+props.mention_id).then((mention) => {

        })
    }




}




export function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
