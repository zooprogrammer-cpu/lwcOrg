import { LightningElement } from 'lwc';

export default class slider extends LightningElement {
    val = 2;
    clicks = 0; 
    timer; 

    handleChange(event){
        clearTimeout(this.timer); // clear timer whenever handleChange method is called
        // what it does iif you get an onchange event within 200 milliseconds, 
        // those events get discarded
        const targetValue = event.target.value; 
        this.timer = setTimeout(()=>{
            const curEvent = new CustomEvent('sliderclicked', {
                detail: {
                    count : targetValue,
                    clicks: ++this.clicks
                  }
            });
            this.dispatchEvent(curEvent);

        }, 200);

    }
}