import { LightningElement } from 'lwc';
const BOOK_URL = 'https://www.googleapis.com/books/v1/volumes?q=?'
export default class BookApp extends LightningElement {
    connectedCallback(){
        this.fetchBookData()
    }

    fetchBookData(){
        fetch('https://www.googleapis.com/books/v1/volumes?q=mark')
        .then(response=>response.json())
        .then(data=>console.log(data))
        .catch(error=>console.error(error))
    }
}