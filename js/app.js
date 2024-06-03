ymaps.ready(init);
let center = [48.8866527839977, 2.34310679732974]

function init(){
	let map = new ymaps.Map("map-test", {
		center: center,
		zoom: 17
	});
	let placemark = new ymaps.Placemark(center,{},{
		iconLayout: 'default#image',
		iconImageHref: '../img/location.png',
		iconImageSize:[70,70],
		iconlmageOffset:[0,0]
	})
	map.geoObjects.add(placemark)
	placemark.events.add('click', function () {
		
		window.location.href = "../html/forest.html";
		
  });
}


window.addEventListener('scroll', e => {
	document.body.style.cssText += `--scrollTop: ${this.scrollY}px`
})

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
ScrollSmoother.create({
	wrapper: '.wrapper',
	content: '.content'
})

