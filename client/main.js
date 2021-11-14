const round = (num, decimalPlace) => Number(Math.round(num + "e" + decimalPlace) + "e-" + decimalPlace);


const cardEles = document.querySelectorAll(".card")

const createObserver = () => {
  let observer;

  let options = {
    root: null,
    rootMargin: "0px",
    threshold: buildThresholdList()
  };

  observer = new IntersectionObserver(handleIntersect, options);
  // observer.observe(cardEles)
  cardEles.forEach(el => {
    observer.observe(el)
  });
};



const buildThresholdList = () => {
  let thresholds = [];
  let numSteps = 30;
  let lowestThreshold = .25
  let highestThreshold = .75
  let increment = 1/numSteps;
  let x = lowestThreshold;

  // thresholds.push(0);
  // thresholds.push(lowestThreshold);

  while (x <= highestThreshold) {
    thresholds.push(x);
    x = round(x + increment, 6);  
  }

  // thresholds.push(highestThreshold);
  // thresholds.push(1);
  console.log(thresholds);
  return thresholds;
};

const handleIntersect = (entries, observer) => {
  const thresholds = observer.thresholds;
  // console.log(thresholds[thresholds.length -1] - thresholds[0])
  // const thresholdRange = thresholds[thresholds.length -1] - thresholds[0]
  entries.forEach((entry, index) => {
    let thresholdIndex = 0;

    for (let i = 0; i < thresholds.length; i++) {
      if (entry.intersectionRatio < thresholds[0]) {
        thresholdIndex = 0;
      } else if (entry.intersectionRatio > thresholds[thresholds.length - 1]) {
        thresholdIndex = thresholds.length - 1;
      } else if (entry.intersectionRatio > thresholds[i] && entry.intersectionRatio < thresholds[i + 1]) {
        thresholdIndex = i
      };
    };

    const opacityRatio = thresholdIndex / (thresholds.length -1);
    entry.target.style.opacity = opacityRatio;
    // entry.target.style.opacity = entry.intersectionRatio;

    // if (entry.intersectionRatio < thresholds[0]) {
    //   entry.target.style.opacity = 0;
    // } else if (entries.intersectionRatio > thresholds[thresholds.length -1]) {
    //   entry.target.style.opacity = 1;
    // } else {
    //   entry.target.style.opacity = entry.intersectionRatio;
    // }

    if (entry.target.classList.contains('card1')) {
      // console.log(opacityRatio, index, thresholds.length -1, entry.intersectionRatio)
      console.log(entry.intersectionRatio, thresholdIndex, opacityRatio)
    }

  });
};

createObserver();






//Old working code

// const sectionEls = document.querySelectorAll(".card");
// console.log(sectionEls);

// const options = {
//   rootMargin: "-10% 0% -10% 0%",
//   threshold: .10
// };

// const observer = new IntersectionObserver(entries => {
//   entries.forEach(function(entry) {
//     if (entry.isIntersecting) {
//       entry.target.classList.add("in-view");
//       entry.target.classList.remove(".card");
//     } else {
//       entry.target.classList.remove("in-view");
//       entry.target.classList.add(".card");
//     }
//   });
// }, options);

// sectionEls.forEach(el => observer.observe(el));