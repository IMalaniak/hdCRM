import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor() {
  }
  
  ngOnInit() {  
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("nav");

    //Hamburger toggle
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle('active');
      hamburger.classList.toggle('not-active');
    });
 
    //Navbar shrink animation
    window.onscroll = function() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        nav.classList.add('nav-shrink');
      } else {
        nav.classList.remove('nav-shrink');
      }

    //Navbar md remove shrink animation
      if (window.matchMedia("(max-width: 991px)").matches) {
        nav.classList.remove('nav-shrink');
      }
    };

  }
}
