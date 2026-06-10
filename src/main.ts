import "./style.css";

const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const promptBtn = document.querySelector<HTMLButtonElement>(".prompt-btn");
const promptForm = document.querySelector<HTMLFormElement>(".prompt-form");
const modelSelect = document.getElementById(
  "model-select",
) as HTMLSelectElement;
const countSelect = document.getElementById(
  "count-select",
) as HTMLSelectElement;
const ratioSelect = document.getElementById(
  "ratio-select",
) as HTMLSelectElement;
const gridGallery = document.querySelector(".gallery-grid") as HTMLDivElement;

const promptInput =
  document.querySelector<HTMLTextAreaElement>(".prompt-input");

const examplePrompts: string[] = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

// Set theme based on saved preference or system default
(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark: boolean = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const isDarkTheme: boolean =
    savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  const icon = themeToggle?.querySelector("i");
  if (icon) {
    icon.className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
})();

// Switch between light and dark themes
const toggleTheme = () => {
  const isDarkTheme: boolean = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  const icon = themeToggle?.querySelector("i");
  if (icon) {
    icon.className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
};


// Create placeholder cards with loading spinners
const createImageCards = (
  selectedModel: string,
  imageCount: number,
  aspectRatio: string,
  promptText: string,
) => {

  gridGallery.innerHTML=""

  for (let i = 0; i < imageCount; i++) {
    gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
            <div class="status-container">
              <div class="spinner"></div>
              <i class="fa-solid fa-triangle-exclamation"></i>
              <p class="status-text">Generating...</p>
            </div>
            <img src="" alt="" class="result-img">
            </div>`;
    
  }

};

// handle form submission
const handleFormSubmit = (e: SubmitEvent) => {
  e.preventDefault();

  const selectedModel: string = modelSelect.value;
  const imageCount: number = parseInt(countSelect.value) || 1;
  const aspectRatio: string = ratioSelect.value || "1/1";

  if (!promptInput) return;

  const promptText: string = promptInput?.value.trim();
  createImageCards(selectedModel, imageCount, aspectRatio, promptText);
};

// Fill prompt input with random example
promptBtn?.addEventListener("click", () => {
  const prompt: string =
    examplePrompts[Math.floor(Math.random() * examplePrompts.length)];

  promptInput!.value = prompt;
  promptInput!.focus();
});

promptForm?.addEventListener("submit", handleFormSubmit);
themeToggle?.addEventListener("click", toggleTheme);
