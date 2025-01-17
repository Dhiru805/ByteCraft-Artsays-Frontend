import React from 'react'
import { useEffect } from 'react';
// import "./MainSlider.css"
function MainSlider() {
    useEffect(() => {
        // DOM elements
        let nextDom = document.getElementById('hero-slide-next');
        let prevDom = document.getElementById('hero-slide-prev');
        let carouselDom = document.querySelector('.hero-slide-carousel');
        let SliderDom = carouselDom.querySelector('.hero-slide-carousel .hero-slide-list');
        let thumbnailBorderDom = document.querySelector('.hero-slide-carousel .hero-slide-thumbnail');
        let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.hero-slide-item');
        let timeDom = document.querySelector('.hero-slide-carousel .hero-slide-time');
    
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    
        let timeRunning = 3000;
        let timeAutoNext = 7000;
    
        // Handlers
        nextDom.onclick = function () {
          showSlider('hero-slide-next');
        };
    
        prevDom.onclick = function () {
          showSlider('hero-slide-prev');
        };
    
        // Autoplay functionality
        let runNextAuto = setTimeout(() => {
          nextDom.click();
        }, timeAutoNext);
    
        let runTimeOut;
    
        function showSlider(type) {
          let SliderItemsDom = SliderDom.querySelectorAll('.hero-slide-carousel .hero-slide-list .hero-slide-item');
          let thumbnailItemsDom = document.querySelectorAll('.hero-slide-carousel .hero-slide-thumbnail .hero-slide-item');
    
          if (type === 'hero-slide-next') {
            SliderDom.appendChild(SliderItemsDom[0]);
            thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
            carouselDom.classList.add('hero-slide-next');
          } else {
            SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
            thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
            carouselDom.classList.add('hero-slide-prev');
          }
    
          // Clear and reset timeouts
          clearTimeout(runTimeOut);
          runTimeOut = setTimeout(() => {
            carouselDom.classList.remove('hero-slide-next');
            carouselDom.classList.remove('hero-slide-prev');
          }, timeRunning);
    
          clearTimeout(runNextAuto);
          runNextAuto = setTimeout(() => {
            nextDom.click();
          }, timeAutoNext);
        }
    
        // Cleanup to prevent memory leaks
        return () => {
          clearTimeout(runTimeOut);
          clearTimeout(runNextAuto);
        };
      }, []);
    
  return (
   <>
{/*  */}
    {/* hero-slide-carousel  */}
    <div className="hero-slide-carousel">
        {/* hero-slide-list hero-slide-item  */}
        <div className="hero-slide-list">
            <div className="hero-slide-item">
                <img src="artimages/Artboard 1.webp"/>
                <div className="hero-slide-content">
                    <div className="hero-slide-author">Welcome</div>
                    <div className="hero-slide-title">Artsays SLIDER</div>
                    <div className="hero-slide-topic">ANIMAL</div>
                    <div className="hero-slide-des">
                        {/* lorem 50  */}
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?
                    </div>
                    <div className="hero-slide-buttons">
                        <button>SEE MORE</button>
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>
            <div className="hero-slide-item">
                <img src="artimages/Artboard 1.webp"/>
                <div className="hero-slide-content">
                    <div className="hero-slide-author">LUNDEV</div>
                    <div className="hero-slide-title">Artsays SLIDER</div>
                    <div className="hero-slide-topic">ANIMAL</div>
                    <div className="hero-slide-des">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?
                    </div>
                    <div className="hero-slide-buttons">
                        <button>SEE MORE</button>
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>
            <div className="hero-slide-item">
                <img src="artimages/Artboard 1.webp"/>
                <div className="hero-slide-content">
                    <div className="hero-slide-author">LUNDEV</div>
                    <div className="hero-slide-title">Artsays SLIDER</div>
                    <div className="hero-slide-topic">ANIMAL</div>
                    <div className="hero-slide-des">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?
                    </div>
                    <div className="hero-slide-buttons">
                        <button>SEE MORE</button>
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>
            <div className="hero-slide-item">
                <img src="artimages/Artboard 1.webp"/>
                <div className="hero-slide-content">
                    <div className="hero-slide-author">LUNDEV</div>
                    <div className="hero-slide-title">Artsays SLIDER</div>
                    <div className="hero-slide-topic">ANIMAL</div>
                    <div className="hero-slide-des">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?
                    </div>
                    <div className="hero-slide-buttons">
                        <button>SEE MORE</button>
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>
        </div>
        {/* hero-slide-list thumnail  */}
        <div className="hero-slide-thumbnail">
            <div className="hero-slide-item">
                <img src="images/Screenshot 2024-09-05 104726.png"/>
                
            </div>
            <div className="hero-slide-item">
                <img src="images/Screenshot 2024-09-05 104607.png"/>
                
            </div>
            <div className="hero-slide-item">
                <img src="images/Screenshot 2024-09-05 104439.png"/>
            </div>
            <div className="hero-slide-item">
                <img src="images/Screenshot 2024-09-05 104512.png"/>
              
            </div>
            <div className="hero-slide-item">
                <img src="images/Screenshot 2024-09-05 104215.png"/>
                
            </div>
        </div>
        {/* hero-slide-next hero-slide-prev  */}

        <div className="hero-slide-arrows">
        <button id="hero-slide-prev">&lt;</button>  
        <button id="hero-slide-next">&gt;</button>  
        </div>
        {/* hero-slide-time running  */}
        <div className="hero-slide-time"></div>
    </div>

    <script src="app.js"></script>

   </>
  )
}

export default MainSlider