document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     HERO SLIDER
  =============================== */
  (() => {
    const images = [
      "images/heroslider/hero1.png",
      "images/heroslider/hero2.png",
      "images/heroslider/hero3.png"
    ];

    const links = [
      "https://comic-walker.com/detail/KC_006257_S/episodes/KC_0062570000200011_E?episodeType=latest",
      "https://doax-venusvacation.jp/cartoon.html",
      "https://piccoma.com/web/product/8192/episodes"
    ];

    let currentIndex = 0;
    const sliderImage = document.getElementById("sliderImage");
    const sliderLink = document.getElementById("sliderLink");
    if (!sliderImage || !sliderLink) return;

    const FADE_TIME = 500;
    const INTERVAL_TIME = 7000;

    function changeImage(direction) {
      sliderImage.style.opacity = 0;

      setTimeout(() => {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        sliderImage.src = images[currentIndex];
        sliderLink.href = links[currentIndex];
        sliderImage.style.opacity = 1;
      }, FADE_TIME);
    }

    window.changeImage = changeImage;
    setInterval(() => changeImage(1), INTERVAL_TIME);
  })();


  /* ===============================
      X (Twitter) FETCH
  ============================== */
  (() => {
    const list = document.getElementById('tweet-list');
    if (!list) return;

    async function fetchTweets() {
      try {
        const res = await fetch('/api/getTweets');
        const tweets = await res.json();

        list.innerHTML = '';
        tweets.forEach(tweet => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="https://x.com/${tweet.username}/status/${tweet.id}"
               target="_blank" rel="noopener noreferrer">
              ${tweet.text}
            </a>`;
          list.appendChild(li);
        });
      } catch (err) {
        console.error('ツイート取得エラー', err);
      }
    }

    window.addEventListener('load', fetchTweets);
  })();


  /* ===============================
      SCROLL TO TOP
  ============================== */
  (() => {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.preventDefault();

      const startY = window.pageYOffset;
      const duration = 800;
      const startTime = performance.now();
      const easeOut = t => 1 - Math.pow(1 - t, 3);

      function animate(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, startY * (1 - easeOut(progress)));
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  })();


  /* ===============================
      HEADER / NAV CONTROL
  ============================== */
  (() => {
    const BREAKPOINT = 1200;

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const dropdown = document.querySelector('.nav-dropdown');
    const trigger = dropdown?.querySelector('.dropdown-trigger');

    if (!nav || !dropdown || !trigger) return;

    let mode = null; // 'pc' | 'sp'

    function resetMenuState() {
      nav.classList.remove('is-open');
      dropdown.classList.remove('is-open');
    }

    toggle?.addEventListener('click', e => {
      e.stopPropagation();
      if (window.innerWidth > BREAKPOINT) return;
      nav.classList.toggle('is-open');
    });

    document.addEventListener('click', e => {
      if (window.innerWidth > BREAKPOINT) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        resetMenuState();
      }
    });

    function bindDesktop() {
      dropdown.addEventListener('mouseenter', openDropdown);
      dropdown.addEventListener('mouseleave', closeDropdown);
    }

    function unbindDesktop() {
      dropdown.removeEventListener('mouseenter', openDropdown);
      dropdown.removeEventListener('mouseleave', closeDropdown);
    }

    function openDropdown() {
      dropdown.classList.add('is-open');
    }

    function closeDropdown() {
      dropdown.classList.remove('is-open');
    }

    function bindMobile() {
      trigger.addEventListener('click', toggleDropdown);
    }

    function unbindMobile() {
      trigger.removeEventListener('click', toggleDropdown);
    }

    function toggleDropdown(e) {
      e.preventDefault();
      dropdown.classList.toggle('is-open');
    }

    function applyMode() {
      const nextMode = window.innerWidth > BREAKPOINT ? 'pc' : 'sp';
      if (mode === nextMode) return;

      resetMenuState();

      if (mode === 'pc') unbindDesktop();
      if (mode === 'sp') unbindMobile();

      if (nextMode === 'pc') bindDesktop();
      if (nextMode === 'sp') bindMobile();

      mode = nextMode;
    }

    applyMode();
    window.addEventListener('resize', applyMode);
  })();

  /* ===============================
     COMICS COMMON RENDERER
  =============================== */
  // 共通のHTML生成関数
function createComicHtml(item) {
    const hasUrl = item.url && item.url !== "";
    
    // NON-DIGITAL（URLなし）の時だけラベルを作成
    const labelHtml = !hasUrl ? `<span class="product-label status-non-digital">NON-DIGITAL</span>` : '';
    
    const tag = hasUrl ? 'a' : 'div';
    const attr = hasUrl ? `href="${item.url}" target="_blank"` : '';

    return `
      <${tag} ${attr} class="product-item">
        ${labelHtml}
        <img src="${item.image}" alt="${item.title}">
        <p class="product-name">${item.title}</p>
      </${tag}>
    `;
  }

  /* ===============================
     COMICS (JSON FETCH) - TOP PAGE (Limit 6)
  =============================== */
  (() => {
    const comicsGrid = document.getElementById('comicsGrid');
    if (!comicsGrid) return;

    fetch('/data/comics.json')
      .then(res => {
        if (!res.ok) throw new Error('JSON not found');
        return res.json();
      })
      .then(data => {
        comicsGrid.innerHTML = '';
        data.comics
          .filter(item => !item.title.includes('【'))
          .slice(0, 6)
          .forEach(item => {
            comicsGrid.insertAdjacentHTML('beforeend', createComicHtml(item));
          });
      })
      .catch(err => {
        console.error('既刊データ読み込み失敗:', err);
        comicsGrid.innerHTML = '<p>現在、情報を読み込めません。</p>';
      });
  })();

  /* ===============================
     COMICS (JSON FETCH) - FULL LIST
  =============================== */
  (() => {
    const fullGrid = document.getElementById('comicsGridFull');
    if (!fullGrid) return;

    fetch('/data/comics.json')
      .then(res => {
        if (!res.ok) throw new Error('JSON not found');
        return res.json();
      })
      .then(data => {
        fullGrid.innerHTML = ''; 
        data.comics
          .filter(item => !item.title.includes('【'))
          .forEach(item => {
            fullGrid.insertAdjacentHTML('beforeend', createComicHtml(item));
          });
      })
      .catch(err => {
        console.error('全件データの読み込み失敗:', err);
        fullGrid.innerHTML = '<p>現在、情報を読み込めません。</p>';
      });
  })();

});

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});