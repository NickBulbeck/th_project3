/* =========================================================================================== 
  I have established a private tradition that all my Treehouse tech degree projects will contain an 
  additional feature with a "Hitch Hiker's Guide To The Galaxy" theme.

  This easter egg is purely a bit of fun. It's also not really an easter egg as it's not hidden, but
  never mind.

  It adheres to good coding practice in the same way bricks don't.
=============================================================================================*/
const paulaNancyMillstoneJennings = () => {
  const fordPrefect = event.target;
  const milliways = document.querySelectorAll('legend');
  const gagHalfrunt = document.querySelector('button[type="submit"]');
  const azgothsOfKria = [
    "Oh, freddled gruntbuggly! Thy micturations are to me as plurdled gabbleblochits on a lurgid bee!",
    "Groop, I implore thee, my foonting turlingdromes,",
    "And hooptiously drangle me with cringled brindlewurdles;",
    "Or I will rend thee in the gobberwarts with my blurglecruncheon,",
  ];
  for (let i=0; i<milliways.length; i++) {
    milliways[i].textContent = azgothsOfKria[i];
  }
  gagHalfrunt.textContent = "See if I don't !";
}

const dentrassi = () => {
  const prostetnicVogonJeltzt = document.querySelector('.container').querySelector('h1');
  const maxQuordlepleen = document.createElement("button");
  maxQuordlepleen.textContent = "Douglas Adams button";
  maxQuordlepleen.classList.add('dontPanic', 'dontPanicSmall');
  prostetnicVogonJeltzt.appendChild(maxQuordlepleen);
  maxQuordlepleen.addEventListener("click",paulaNancyMillstoneJennings,false);
}

dentrassi();