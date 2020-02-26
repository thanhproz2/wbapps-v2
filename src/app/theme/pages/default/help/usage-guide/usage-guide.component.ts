import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-usage-guide',
  templateUrl: './usage-guide.component.html',
  styles: []
})
export class UsageGuideComponent implements OnInit {
  keywords: string;
  oldKeywords: string;

  @ViewChild('search') search: ElementRef;

  constructor() {
    this.keywords = '';
    this.oldKeywords = '';
  }

  ngOnInit(): void {}

  clearSearch() {
    this.keywords = '';
    this.filterText();
    this.search.nativeElement.focus();
  }

  filterText() {
    $.expr[':'].contains = function(a, i, m) {
      return (
        $(a)
          .text()
          .toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0
      );
    };
    var keywords = this.keywords;
    keywords = keywords.trim();
    if (keywords == '') {
      return $('p:contains(' + keywords + ')').css('background', 'none');
    }
    if (keywords != '') {
      $('p:contains(' + this.oldKeywords + ')').css('background', 'none');
    }
    $('p:contains(' + keywords + ')').css('background', 'yellow');
    this.oldKeywords = keywords;
  }
}
