import { LightningElement, api } from 'lwc';
import LightningConfirm from 'lightning/confirm';

export default class RecordCardQuickFiles extends LightningElement {
    async onDeleteAllFilesButtonClick() {
        const confirmation = await LightningConfirm.open({
            Message: "Are you sure you want to delete all files?",
            Variant: 'headerless',
            Label: 'Are you sure you want to delete all files?'

        });
        if (confirmation) {
            console.log('Deleting Files');
            //... proceed with
            //... Apex Logic to delete Files.
            //... We will not check this comment.
        }
    }
}