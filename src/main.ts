import "./style.css";
import { HfInference } from "@huggingface/inference";

const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const promptBtn = document.querySelector<HTMLButtonElement>(".prompt-btn");
const promptForm = document.querySelector<HTMLFormElement>(".prompt-form");
const modelSelect = document.getElementById("model-select") as HTMLSelectElement;
const countSelect = document.getElementById("count-select") as HTMLSelectElement;
const ratioSelect = document.getElementById("ratio-select") as HTMLSelectElement;
const gridGallery = document.querySelector(".gallery-grid") as HTMLDivElement;
const promptInput = document.querySelector<HTMLTextAreaElement>(".prompt-input");

const API_KEY = import.meta.env.VITE_HF_API_KEY;

const hf = new HfInference(API_KEY);

type ImageSelect = {
  selectedModel: string;
  imageCount: number;
  aspectRatio: string;
  promptText: string;
};

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
  const systemPrefersDark: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDarkTheme: boolean = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
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

const getImageDimensions = (aspectRatio: string, baseSize = 512) => {
  if (!aspectRatio) return { width: baseSize, height: baseSize };

  const [width, height] = aspectRatio.split("/").map(Number);

  if (isNaN(width) || isNaN(height) || width === 0 || height === 0) {
    console.warn("Invalid aspect ratio format received. Defaulting to square.");
    return { width: baseSize, height: baseSize };
  }

  const scaleFactor = baseSize / Math.sqrt(width * height);
  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

  return { width: calculatedWidth, height: calculatedHeight };
};

// Update individual card DOM blocks upon resolution or crash
const updateCardStatus = (index: number, status: "success" | "error", data?: string) => {
  const card = document.getElementById(`img-card-${index}`);
  if (!card) return;

  card.classList.remove("loading");
  const statusText = card.querySelector(".status-text");

  if (status === "success" && data) {
    const img = card.querySelector(".result-img") as HTMLImageElement;
    if (img) img.src = data;
  } else {
    card.classList.add("error");
    if (statusText) statusText.textContent = data || "Generation Failed";
  }
};

const generateImages = async ({
  selectedModel,
  imageCount,
  aspectRatio,
  promptText,
}: ImageSelect) => {
  const { width, height } = getImageDimensions(aspectRatio);

  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      const imageBlob = await hf.textToImage({
        model: selectedModel,
        inputs: promptText,

        parameters: {
          width,
          height,
        },
      });

      let imageUrl: string;

      if (typeof imageBlob === "string") {
        imageUrl = imageBlob;
      } else {
        imageUrl = URL.createObjectURL(imageBlob);
      }


      updateCardStatus(i, "success", imageUrl);

      return imageUrl;
    } catch (error) {
      console.error(`Track Error on Image ${i}:`, error);

      const message =
        error instanceof Error ? error.message : "Failed to generate image";

      updateCardStatus(i, "error", message);

      return null;
    }
  });

  await Promise.allSettled(imagePromises);
};




// Create placeholder cards with loading spinners
const createImageCards = (settings: ImageSelect) => {
  gridGallery.innerHTML = "";

  for (let i = 0; i < settings.imageCount; i++) {
    gridGallery.innerHTML += `
      <div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${settings.aspectRatio}">
        <div class="status-container">
          <div class="spinner"></div>
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p class="status-text">Generating...</p>
        </div>
        <img src="" alt="" class="result-img">
      </div>`;
  }

  // Fire execution pipeline
  generateImages(settings);
};

// handle form submission
const handleFormSubmit = (e: SubmitEvent) => {
  e.preventDefault();

  const selectedModel: string = modelSelect.value;
  const imageCount: number = parseInt(countSelect.value) || 1;
  const aspectRatio: string = ratioSelect.value || "1/1";

  if (!promptInput) return;

  const promptText: string = promptInput.value.trim();
  if (!promptText) return alert("Please enter a valid prompt structure.");
  
  createImageCards({ selectedModel, imageCount, aspectRatio, promptText });
};

// Fill prompt input with random example
promptBtn?.addEventListener("click", () => {
  const prompt: string = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  if (promptInput) {
    promptInput.value = prompt;
    promptInput.focus();
  }
});

promptForm?.addEventListener("submit", handleFormSubmit);
themeToggle?.addEventListener("click", toggleTheme);