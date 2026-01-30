/**
 * Created by ashbas on 1/29/26.
 */

import LightningDatatable from "lightning/datatable";
import customPicklist from './customPicklist.html';

export default class CustomTypesGlobal extends LightningDatatable {
  static customTypes = {
    industryPicklist: {
      template: customPicklist,
      standardCellLayout: true,
      typeAttributes: ['label', 'value', 'placeholder', 'options'],
    }
  };


}