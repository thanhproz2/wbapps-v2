import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html'
})
export class RatingComponent implements OnInit {
  public numberRating: number = 0;
  public commentRating: string = '';
  public commentWords: number = 0;
  public ratingType: string = 'positive';
  public ratingErrorMsg: string = '';
  @Input() public ratingModel: any = null;
  @Input() public test: string = '';
  @Output() public saveRating = new EventEmitter();
  constructor() {}
  ngOnInit() {
    console.log('Rating page');
  }
  openModalRating(ratingInfo): void {
    var self = this;
    this.ratingModel = ratingInfo;
    if (ratingInfo.rated) {
      this.numberRating = ratingInfo.numberRating;
      this.commentRating = ratingInfo.comment;
      this.ratingType = ratingInfo.ratingType;
    } else {
      this.numberRating = 0;
      this.commentRating = '';
      this.ratingType = 'positive';
    }
    this.checkValidDesc();
    $('#modalRating').modal('show');
    $('#rating')
      .children()
      .removeAttr('disabled');
    setTimeout(function() {
      if (ratingInfo.rated) {
        self.setRatingActive();
      }
    }, 1000);
  }
  setRatingActive(): void {
    this.numberRating = Number(this.numberRating || 0);
    if (this.numberRating == 5) {
      $('#star5').trigger('click');
    }
    if (this.numberRating == 4.5) {
      $('#star4half').trigger('click');
    }
    if (this.numberRating == 4) {
      $('#star4').trigger('click');
    }
    if (this.numberRating == 3.5) {
      $('#star3half').trigger('click');
    }
    if (this.numberRating == 3) {
      $('#star3').trigger('click');
    }
    if (this.numberRating == 2.5) {
      $('#star2half').trigger('click');
    }
    if (this.numberRating == 2) {
      $('#star2').trigger('click');
    }
    if (this.numberRating == 1.5) {
      $('#star1half').trigger('click');
    }
    if (this.numberRating == 1) {
      $('#star1').trigger('click');
    }
    if (this.numberRating == 0.5) {
      $('#starhalf').trigger('click');
    }
    $('#rating')
      .children()
      .attr('disabled', 'true');
  }
  closeModalRating(): void {
    $('#modalRating').modal('hide');
  }
  save(): void {
    this.ratingModel.numberRating = this.numberRating;
    this.ratingModel.comment = this.commentRating;
    this.ratingModel.ratingType = this.ratingType;
    this.saveRating.emit(this.ratingModel);
    // $('#modalRating').modal('hide');
  }
  doneRating(): void {
    this.numberRating = 0;
    this.commentRating = '';
    $('#modalRating').modal('hide');
  }
  getStars(rating): string {
    // Get the value
    var val = parseFloat(rating);
    // Turn value into number/100
    var size = (val / 5) * 100;
    return size + '%';
  }
  checkValidDesc() {
    var count = 0;
    var words = this.commentRating.replace(/(^\s*)|(\s*$)/gi, ''); //exclude  start and end white-space
    words = words.replace(/[ ]{3,}/gi, ' '); //3 or more space to 2
    words = words.replace(/\n /, '\n'); // exclude newline with a start spacing
    count = words.split(' ').length + words.split('\n').length - 1;
    this.commentWords = count;
    // this.commentRating = words;
  }
  chooseRatingType(): void {
    console.log('chooseRatingType', this.numberRating);
    this.chooseStar();
  }
  chooseStar(): void {
    this.numberRating = Number(this.numberRating || 0);
    if (this.numberRating > 0) {
      if (this.ratingType == 'positive') {
        if (this.numberRating <= 2.5) {
          // this.toastr.error('The positive rating must be greater than 2.5 stars');
          this.ratingErrorMsg =
            'The positive rating must be greater than 2.5 stars';
        } else {
          this.ratingErrorMsg = '';
        }
      } else {
        if (this.numberRating > 2.5) {
          // this.toastr.error('The negative rating must be less than or equal 2.5 stars');
          this.ratingErrorMsg =
            'The negative rating must be less than or equal 2.5 stars';
        } else {
          this.ratingErrorMsg = '';
        }
      }
    }
  }
}
