import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CategoryDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-details',
  templateUrl: 'category-details.html',
})
export class CategoryDetailsPage {

  selectedItem: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
    this.initialize();
  }

  //Método executado sempre que a página é iniciada
  initialize(){
    this.selectedItem = this.navParams.get('category');
  }

  //O primeiro LifeCycleEvent a ser executado
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CategoryDetails');
  }

}
