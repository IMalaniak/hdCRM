import { Component, OnInit, Input, ContentChild, ElementRef, ViewEncapsulation} from '@angular/core';
import { LoaderService } from '@/_shared/services';
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
  @Input() showDataLoader: boolean;
  @ContentChild('content') content: ElementRef;
  @ContentChild('subheader') subheader: ElementRef;
  @ContentChild('buttons') buttons: ElementRef;
  @ContentChild('boxFooter') boxFooter: ElementRef;

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
  }

  get dataIsLoading$(): Observable<boolean> {
    return this.loaderService.showLoader;
  }
}
