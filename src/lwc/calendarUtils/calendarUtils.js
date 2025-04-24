const formatEvents = (events, config) => {

     const invertColor = (hex = '#FFFFFF', bw) => {
          if (hex.indexOf('#') === 0) {
               hex = hex.slice(1);
          }
          // convert 3-digit hex to 6-digits.
          if (hex.length === 3) {
               hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          }
          if (hex.length !== 6) {
               throw new Error('Invalid HEX color.');
          }
          let r = parseInt(hex.slice(0, 2), 16),
               g = parseInt(hex.slice(2, 4), 16),
               b = parseInt(hex.slice(4, 6), 16);
          if (bw) {
               return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
          }
          // invert color components
          r = (255 - r).toString(16);
          g = (255 - g).toString(16);
          b = (255 - b).toString(16);
          // pad each with zeros and return
          return "#" + padZero(r) + padZero(g) + padZero(b);
     }
     
     const msToHMS = (duration) => {
          let seconds = Math.floor((duration / 1000) % 60),
               minutes = Math.floor((duration / (1000 * 60)) % 60),
               hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
          
          hours = (hours < 10) ? "0" + hours : hours;
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;
               
          return hours + ":" + minutes + ":" + seconds ;
     }

     return events.map(event => {
          event.id = event.Id
          // event.status = event.Shift_Status__c
          event.title = event[config.titleField]
          event.start = event[config.startDatetimeField]
          event.end = event[config.endDatetimeField]
          // event.textColor = invertColor(event?.Color__c, true)
          // event.borderColor = event.Color__c
          // event.backgroundColor = event.Color__c
          return event
     })
}

const jsToApexDate = (date) => {
     const year = date.getFullYear()
     const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
     const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() 
     return `${year}-${month}-${day}`
}

export { formatEvents, jsToApexDate }