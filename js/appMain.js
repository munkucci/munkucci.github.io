const inputs = document.querySelectorAll(".contact-input")
const toggleBtn = document.querySelector(".theme-toggle")

toggleBtn.addEventListener("click", () =>{
	document.body.classList.toggle("dark")
})

inputs.forEach(ipt =>{
	ipt.addEventListener("focus", () =>{
		ipt.parentNode.classList.add("focus")
		ipt.parentNode.classList.add("not-empty")
	})
	ipt.addEventListener("blur", () =>{
		if(ipt.value == "") {
			ipt.parentNode.classList.remove("not-empty")
		}
		ipt.parentNode.classList.remove("focus")
		
	})
})

window.addEventListener('scroll', e => {
	document.body.style.cssText += `--scrollTop: ${this.scrollY}px`
})



