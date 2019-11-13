import { Component, OnInit, Input, ContentChild, ElementRef, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: '.app-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentBoxComponent implements OnInit {
  @Input() title: string;
  @Input() cssClass: string;
  @Input() contentCssClass: string;
  @Input() showDataLoader: boolean;
  @Input() headCssClass: string;
  @Input() disableShadow = false;
  @Input() counter: number;
  @ContentChild('content', { static: false }) content: ElementRef;
  @ContentChild('subheader', { static: false }) subheader: ElementRef;
  @ContentChild('buttons', { static: false }) buttons: ElementRef;
  @ContentChild('boxFooter', { static: false }) boxFooter: ElementRef;

  constructor() {}

  ngOnInit() {}
}
