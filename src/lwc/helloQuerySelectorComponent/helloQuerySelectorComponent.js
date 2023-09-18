import { LightningElement } from 'lwc';

export default class HelloQuerySelectorComponent extends LightningElement {
    userName =["John","Smith","Nikki","Tom" ]
    fetchDetailHandler(){
        const elem=this.template.querySelector('h1')
        elem.style.border="1px solid red";
        console.log(item.innerText)

        const userElements =this.template.querySelectorAll('.name')
        console.log(elem.innerText)
        Array.from(userElements).forEach(item=>{
            console.log(item.innerText)
            item.setAttribute("title", item.innerText)
        })

        /// lwc:dom="manual" demo
        const childElem = this.template.querySelector('.child')
        childElem.innerHTML ='<p>Hey I am a child element</p>'

    }
}