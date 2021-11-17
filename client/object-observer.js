// Creating round function becuase there isn't one for decimal places. 
// Need to round for float weirdness. Check out https://floating-point-gui.de/
const round = (num, decimalPlace) => Number(Math.round(num + "e" + decimalPlace) + "e-" + decimalPlace);

const cardEles = document.querySelectorAll(".card")

// Creates instances of the IntersectiopnObserver class for each .card element
// Invokes the buildThresholdList function to create all thresholds.
const createObserver = () => {
  let observer;

  let options = {
    root: null,
    rootMargin: "0px",
    threshold: buildThresholdList()
  };

  observer = new IntersectionObserver(handleIntersect, options);
  cardEles.forEach(el => observer.observe(el));
};

// builds the threshold array for the observer's options.
// Set the low and max thresholds and the function will create as many thresholds defined in the numSteps variable. 
const buildThresholdList = () => {
  let thresholds = [];
  let numSteps = 20;
  let lowestThreshold = .25
  let highestThreshold = .75
  let thresholdRange = highestThreshold - lowestThreshold;
  let increment = thresholdRange/numSteps;
  let x = lowestThreshold;

  while (x <= highestThreshold) {
    thresholds.push(x);
    x = round(x + increment, 6);  
  }

  console.log(thresholds);
  return thresholds;
};

// handles the observer event each time the target hits a threshold
const handleIntersect = (entries, observer) => {
  const thresholds = observer.thresholds;

  // Loops through every element created in the createObserver call. 
  entries.forEach(entry => {
    let thresholdIndex = 0;

    // finds the index value of the thresholds based on the intersectionRatio (% of the object that is on screen).
    for (let i = 0; i < thresholds.length; i++) {
      if (entry.intersectionRatio <= thresholds[0]) {
        thresholdIndex = 0;
      } else if (entry.intersectionRatio >= thresholds[thresholds.length - 1]) {
        thresholdIndex = thresholds.length - 1;
      } else if (entry.intersectionRatio >= thresholds[i] && entry.intersectionRatio < thresholds[i + 1]) {
        thresholdIndex = i
      };
    };

    // figures out the opacity ratio which is different than the intersection ratio. Needed for smoother transitions. 
    const opacityRatio = thresholdIndex / (thresholds.length -1);

    // Sets the targets opacity
    entry.target.style.opacity = opacityRatio;

    // if (entry.target.classList.contains('card1')) {
    //   console.log(entry.intersectionRatio, thresholdIndex, opacityRatio)
    // }

  });
};