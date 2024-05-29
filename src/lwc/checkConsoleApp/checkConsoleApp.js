/**
 *
 */

import {LightningElement, wire} from 'lwc';
import {IsConsoleNavigation} from "lightning/platformWorkspaceApi";

export default class CheckConsoleApp extends LightningElement {
  // this returns true if the user is in a console app
  @wire(IsConsoleNavigation)
  isConsoleNavigation;
}