import "./style.css";

const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");

// Set theme based on saved preference or system default
(()=>{
   const savedTheme= localStorage.getItem("theme");
   const systemPrefersDark:boolean =window.matchMedia("(prefers-color-scheme: dark)").matches;

   const isDarkTheme:boolean = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
      document.body.classList.toggle("dark-theme",isDarkTheme);
      const icon = themeToggle?.querySelector("i");
      if (icon) {
        icon.className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }

})()


// Switch between light and dark themes
const toggleTheme = () => {
    const isDarkTheme: boolean = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme",isDarkTheme ? "dark":"light")
    const icon =themeToggle?.querySelector("i")
    if (icon) {
        icon.className = isDarkTheme
          ? "fa-solid fa-sun"
          : "fa-solid fa-moon";
    }
};

themeToggle?.addEventListener("click", toggleTheme);
