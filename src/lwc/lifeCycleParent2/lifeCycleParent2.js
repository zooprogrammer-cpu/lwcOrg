import { LightningElement } from 'lwc';

export default class LifeCycleParent2 extends LightningElement {
    isChildVisible = false; 
    //construcot rmethod gets called first
    constructor(){
        super()
        console.log('parent constructor called')
    }

    //conenected callBack method gets called second
    connectedCallback(){
        console.log("parent connectedCallback called")
    }

    //renderedCallback - slows down perfromance. fires more than once again and gain whenever something changes. Child to parent. 
    renderedCallback(){
        console.log("parent renderedCallback called")
    }

    handleClick(){
        this.isChildVisible = !this.isChildVisible; 
    }

    errorCallback(error, stack){
        console.error(error.message)
        console.error(stack)


    }
    

}