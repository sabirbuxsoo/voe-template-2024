(() => {
	let multistepContainers = document.querySelectorAll(".multistep");
	const correlationIds = ["step_one", "step_two", "step_three"]

	let initStep = async (step, multistepContainer) => {
		if (step.classList.contains("multistep__prev-container-inner") || step.classList.contains("multistep__step") || step.classList.contains("multistep__timeline-item--prev")) {
			if (step.classList.contains("multistep__prev-container-inner") && step.dataset.prevStep) {
				step = multistepContainer.querySelector(`.multistep__timeline-item[data-next-step="${ step.dataset.prevStep }"]`);
			}

			const baseUrl = `https://api.hubspot.com/cms/v3/hubdb/tables/${ multistepContainer.dataset.tid }/rows?portalId=${ multistepContainer.dataset.pid }`,
						requestOptions = (step.dataset.parentProperty && step.dataset.parentValue ? `&${ step.dataset.parentProperty }=${ step.dataset.parentValue }` : ``) + (step.dataset.property && step.dataset.value ? `&${ step.dataset.property }=${ step.dataset.value }` : ``),
						request = await fetch(`${ baseUrl }${ requestOptions }`),
						response = await request.json(),
						results = response.results,
						shapeBaseUrl = multistepContainer.dataset.shapesUrl,
						titleValue = step.dataset.property == "step_one" ? multistepContainer.dataset.stepTwo : step.dataset.property == "step_two" ? multistepContainer.dataset.stepThree : multistepContainer.dataset.stepOne;

			let shapeValue = 0,
					stepsArray = [],
					htmlArray = [];

			results && results.map((result, index) => {
				const resultValue = step.dataset.property == "step_one" ? result.values.step_two : step.dataset.property == "step_two" ? result.values.step_three : result.values.step_one;

				if (stepsArray.indexOf(resultValue) == -1) {
					shapeValue++;
					if (shapeValue === 7) { shapeValue = 1 }

					if (step.dataset.property === "step_two") {
						const htmlData = `<div class="multistep__step multistep__step--last span3 columns dnd-column"${ step.dataset.property ? ` data-parent-property="${ step.dataset.property }" data-parent-value="${ step.dataset.value }"` : `` }>
						<div class="image-container square border-thin border-solid gray-border-color d-flex flex-flow-column align-items-center p-relative o-hidden">
							<div class="p-absolute t-50 s-50 translate-c-c fw fh p-14">
								<div class="p-relative fw fh d-flex flex-flow-column align-items-center justify-content-center translate-c-s">
									<img loading="lazy" class="p-absolute t-50 s-50 translate-c-c fw fh" src="${ shapeBaseUrl }shape-color-${ shapeValue }.svg">
								</div>
								<div class="p-absolute t-50 s-50 translate-c-c fw fh p-4 d-flex flex-flow-column align-items-center justify-content-center text-align-center">
									${ result.values.step_four_description.replaceAll("<p>", "<p class='display-xs-h3 display-md-h3 display-xl-h3 first-color'><b>").replaceAll("</p>", "</b></p>") }
									<a ${ result.values.step_three.name === "Page" ? "href='" + result.values.step_four_link + "'" : result.values.step_three.name === "Numéro de téléphone" ? ("href='tel:" + result.values.step_four_link + "'").replaceAll(" ", "") : "" } class="button white-color first-bg first-border-color${ result.values.step_three.name === "Formulaire" ? " button--form" : '' }"${ result.values.step_three.name === "Formulaire" ? " data-form='" + result.values.step_four_link + "'" : '' }>${ result.values.step_four_button_text }</a>
								</div>
							</div>
						</div>
					</div>`;

						htmlArray.push(htmlData);
						stepsArray.push(resultValue);
					} else {
						const htmlData = `<div class="multistep__step span3 columns dnd-column" data-property="${ correlationIds[step.dataset.nextStep] ? correlationIds[step.dataset.nextStep] : correlationIds[0] }" data-value="${ resultValue }"${ step.dataset.property ? ` data-parent-property="${ step.dataset.property }" data-parent-value="${ step.dataset.value }"` : `` } data-next-step="${ parseInt(step.dataset.nextStep) + 1 }">
						<div class="image-container square ${ step.dataset.property == "step_one" ? "fourth-bg" : step.dataset.property == "step_two" ? "third-bg" : "second-bg" } d-flex flex-flow-column align-items-center p-relative o-hidden">
							<div class="p-absolute t-50 s-50 translate-c-c fw fh p-14">
								<div class="p-relative fw fh d-flex flex-flow-column align-items-center justify-content-center">
									<img loading="lazy" class="p-absolute t-50 s-50 translate-c-c fw fh" src="${ shapeBaseUrl }shape-${ shapeValue }.svg">
								</div>
								<div class="p-absolute t-50 s-50 translate-c-c fw fh p-8 d-flex flex-flow-column align-items-center justify-content-center text-align-center">
									<h3 class="white-color mb-0 p-relative z-sm">${ resultValue }</h3>
								</div>
							</div>
						</div>
					</div>`;

						htmlArray.push(htmlData);
						stepsArray.push(resultValue);
					}
				}

				if (index === results.length - 1) {
					if (step.dataset.property && multistepContainer.querySelector(`.multistep__timeline-item[data-property="${ step.dataset.property }"]`)) {
						multistepContainer.querySelector(`.multistep__timeline-item[data-property="${ step.dataset.property }"]`).dataset.value = step.dataset.value;

						let prevTimelineItems = multistepContainer.querySelectorAll(`.multistep__timeline-item:has( ~ .multistep__timeline-item[data-property="${ step.dataset.property }"])`);
						let nextTimelineItems = multistepContainer.querySelectorAll(`.multistep__timeline-item[data-property="${ step.dataset.property }"] ~ .multistep__timeline-item`);
						multistepContainer.querySelector(`.multistep__timeline-item[data-property="${ step.dataset.property }"]`).classList.add("active");

						if (prevTimelineItems) {
							prevTimelineItems.forEach(prevTimelineItem => {
								prevTimelineItem.classList.remove("active");
								prevTimelineItem.classList.add("multistep__timeline-item--prev");
							})
						}

						if (nextTimelineItems) {
							nextTimelineItems.forEach(nextTimelineItem => {
								delete nextTimelineItem.dataset.value;
								nextTimelineItem.classList.remove("active");
								nextTimelineItem.classList.remove("multistep__timeline-item--prev");
							})
						}
					} else {
						let multistepTimelineItems = multistepContainer.querySelectorAll(`.multistep__timeline-item`);

						if (multistepTimelineItems) {
							multistepTimelineItems.forEach((multistepTimelineItem, index) => {
								if (index === 0) {
									multistepTimelineItem.classList.add("active");
									multistepTimelineItem.classList.remove("multistep__timeline-item--prev");
								} else {
									multistepTimelineItem.classList.remove("active");
									multistepTimelineItem.classList.remove("multistep__timeline-item--prev");
									delete multistepTimelineItem.dataset.value;
								}
							})
						}
					}

					multistepContainer.querySelector(".multistep__title h2").innerHTML = decodeURIComponent(titleValue).replaceAll("+", " ");
					multistepContainer.querySelector(".multistep__container").innerHTML = htmlArray.join("");
					multistepContainer.querySelector(".multistep__form-container-inner").innerHTML = '';
					multistepContainer.querySelector(".multistep__prev-container-inner").href = step.dataset.parentProperty ? `${ baseUrl }${ (step.dataset.parentProperty && step.dataset.parentValue ? `&${ step.dataset.parentProperty }=${ step.dataset.parentValue }` : ``) }` : `${ baseUrl }`;

					if (step.dataset.property) { 
						multistepContainer.querySelector(".multistep__prev-container-inner").innerHTML = `<svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5333 17.5L1.99997 9.5M1.99997 9.5L10.5333 1.5M1.99997 9.5L20.1333 9.5" stroke="currentColor" stroke-width="2"/></svg>Précédent`; 
						if (step.dataset.nextStep) {
							multistepContainer.querySelector(".multistep__prev-container-inner").dataset.prevStep = parseInt(step.dataset.nextStep) - 1; 
						} else {							
							multistepContainer.querySelector(".multistep__prev-container-inner").dataset.prevStep = ''; 
						}
					} else { 
						multistepContainer.querySelector(".multistep__prev-container-inner").innerHTML = '';
						multistepContainer.querySelector(".multistep__prev-container-inner").dataset.nextStep = ''; 
					}
				}
			})			
		}
	}

	let initForm = async (formButton, multistepContainer) => {
		const formId = formButton.dataset.form;

		hbspt.forms.create({
			region: "na1",
			portalId: multistepContainer.dataset.pid,
			formId: formId,
			target: ".multistep .multistep__form-container .multistep__form-container-inner"
		})
	}

	let initMultistepContainer = (multistepContainer) => {
		multistepContainer.addEventListener("click", (event) => {
			event.target.classList.contains("multistep__step") && initStep(event.target, multistepContainer);
			event.target.classList.contains("button--form") && initForm(event.target, multistepContainer);
			event.target.classList.contains("multistep__timeline-item") && initStep(event.target, multistepContainer);
			if (event.target.classList.contains("multistep__prev-container-inner")) {
				event.preventDefault();
				initStep(event.target, multistepContainer);
			} 
		})
	}

	multistepContainers && multistepContainers.forEach(multistepContainer => initMultistepContainer(multistepContainer));
})();