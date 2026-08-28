function openModal(e){document.getElementById(e).style.display="block"}
function closeModal(e){document.getElementById(e).style.display="none"}

document.addEventListener("DOMContentLoaded", () => {
  if (window.terminalSimLoaded) return;
  window.terminalSimLoaded = true;

  document.querySelectorAll(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).forEach(link => {
    if (link.querySelector("img")) {
      link.classList.add("image-popup");
      link.addEventListener("click", e => {
        e.preventDefault();
        const modal = document.createElement("div");
        modal.className = "lightbox";
        modal.innerHTML = `
          <div class="lightbox-content">
            <img src="${link.href}" alt="">
            <span class="lightbox-close">&times;</span>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector(".lightbox-close").onclick = () => modal.remove();
        modal.onclick = evt => { if (evt.target === modal) modal.remove(); };
      });
    }
  });

  const terminal = document.getElementById("terminal-output");
  const startBtn = document.getElementById("start-terminal");
  const audio = document.getElementById("boot-sound");

  function runTerminal() {
    terminal.innerHTML = "";
    if (audio) audio.play();

    const now = new Date();
    const motdDate = now.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    });

    const sysLoad = (Math.random() * 1.5).toFixed(2);
    const processes = Math.floor(Math.random() * 200) + 100;
    const memUsage = Math.floor(Math.random() * 60) + 20;
    const diskUsage = (Math.random() * 50).toFixed(1);

    const lines = [
      "Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)",
      "",
      "* Documentation:  https://help.ubuntu.com",
      "* Management:     https://landscape.canonical.com",
      "* Support:        https://ubuntu.com/support",
      "",
      `System information as of ${motdDate}`,
      "",
      `System load: ${sysLoad}   Processes: ${processes}   Users logged in: 1`,
      `Usage of /:  ${diskUsage}% of 50.0GB   Memory usage: ${memUsage}%   Swap usage: 0%`,
      "",
      "admin@ubuntu:~$ git clone https://github.com/microbitcoder652/microbit-v2-outdoor-kit.git",
      "admin@ubuntu:~$ cd microbit-v2-outdoor-kit",
      "admin@ubuntu:~$ npm install",
      "> Installing dependencies...",
      "> Resolving packages...",
      "> Fetching microbit-core@2.1.0",
      "> Fetching outdoor-kit-sensors@1.3.4",
      "> Linking binaries...",
      `> Done in ${(Math.random() * 5 + 2).toFixed(2)}s.`,
      "admin@ubuntu:~$ npm run build",
      "> Building outdoor-kit dashboard...",
      "> Compiling sensor modules...",
      "> Optimizing assets...",
      "> Build complete ✔",
      "admin@ubuntu:~$ npm start",
      "> Starting local server at http://localhost:3000",
      "> Ready! 🚀"
    ];

    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
      if (lineIndex >= lines.length) {
        const prompt = document.createElement("div");
        prompt.innerHTML = '<span class="blinker">▍</span>';
        terminal.appendChild(prompt);
        return;
      }

      const currentLine = lines[lineIndex];
      let lineEl = terminal.querySelector(`[data-line="${lineIndex}"]`);
      if (!lineEl) {
        lineEl = document.createElement("div");
        lineEl.dataset.line = lineIndex;
        lineEl.textContent = "";
        terminal.appendChild(lineEl);
      }

      if (charIndex < currentLine.length) {
        lineEl.textContent += currentLine.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, 45);
      } else {
        charIndex = 0;
        lineIndex++;
        setTimeout(typeNextChar, 300);
      }
    }

    typeNextChar();

    if (startBtn) {
      startBtn.style.transition = "opacity 0.5s ease";
      startBtn.style.opacity = "0";
      setTimeout(() => startBtn.style.display = "none", 500);
    }
  }

  if (startBtn) {
    startBtn.addEventListener("click", runTerminal, { once: true });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".greedy-nav");
  if (!nav) return;

  const btn = nav.querySelector(".greedy-nav__toggle");
  const vlinks = nav.querySelector(".visible-links");
  const hlinks = nav.querySelector(".hidden-links");

  const update = () => {
    const available = nav.clientWidth - (btn ? btn.clientWidth : 0);
    let required = vlinks.scrollWidth;

    if (required > available) {
      while (vlinks.scrollWidth > available && vlinks.children.length > 0) {
        hlinks.prepend(vlinks.lastElementChild);
      }
    } else {
      while (
        hlinks.children.length > 0 &&
        vlinks.scrollWidth + hlinks.firstElementChild.scrollWidth < available
      ) {
        vlinks.append(hlinks.firstElementChild);
      }
    }

    if (btn) btn.classList.toggle("hidden", hlinks.children.length === 0);
  };

  update();
  window.addEventListener("resize", update);

  if (btn) {
    btn.addEventListener("click", () => {
      hlinks.classList.toggle("hidden");
      btn.classList.toggle("close");
    });
  }
});
