document.body.addEventListener("click", (e) => {
    const sparkCount = 12;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      document.body.appendChild(spark);
  
      const angle = (i * 360) / sparkCount;
      const dx = 50 * Math.cos((angle * Math.PI) / 180);
      const dy = 50 * Math.sin((angle * Math.PI) / 180);
      spark.style.setProperty("--dx", `${dx}px`);
      spark.style.setProperty("--dy", `${dy}px`);
      spark.style.left = `${e.pageX}px`;
      spark.style.top = `${e.pageY}px`;
      spark.addEventListener("animationend", () => spark.remove());
    }
  });
  
  
  window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
      preloader.classList.add('hide');
    }, 2000); // Задержка в 2000 миллисекунд (2 секунды)
  });