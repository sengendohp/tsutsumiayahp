document.addEventListener('DOMContentLoaded', () => {

    const imageCount = 4; // hero1〜hero4
    const images = [];

    for (let i = 1; i <= imageCount; i++) {
        images.push(`images/heroslider/hero${i}.png`);
    }

    let currentIndex = 0;
    const sliderImage = document.getElementById('sliderImage');
    const FADE_TIME = 500; // 0.5秒
    const INTERVAL_TIME = 7000; // 7秒

    function changeImage(direction) {
        // フェードアウト
        sliderImage.style.opacity = 0;

        setTimeout(() => {
            currentIndex =
                (currentIndex + direction + images.length) % images.length;

            sliderImage.src = images[currentIndex];

            // フェードイン
            sliderImage.style.opacity = 1;
        }, FADE_TIME);
    }

    // ボタン用にグローバル公開
    window.changeImage = changeImage;

    // ★ 自動スライド
    setInterval(() => {
        changeImage(1);
    }, INTERVAL_TIME);
});

// サーバー経由で X API を呼ぶ想定
async function fetchTweets() {
  try {
    const response = await fetch('/api/getTweets'); // 自作のサーバー側エンドポイント
    const tweets = await response.json();

    const ul = document.getElementById('tweet-list');
    ul.innerHTML = '';

    tweets.forEach(tweet => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="https://x.com/${tweet.username}/status/${tweet.id}" target="_blank" rel="noopener noreferrer">${tweet.text}</a>`;
      ul.appendChild(li);
    });

  } catch (err) {
    console.error('ツイート取得エラー', err);
  }
}

window.addEventListener('load', fetchTweets);

const scrollBtn = document.getElementById('scrollToTop');

scrollBtn.addEventListener('click', function(e) {
  e.preventDefault();

  const start = window.pageYOffset;
  const duration = 800; // アニメーション時間(ms)
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3); // イージング関数
  }

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    window.scrollTo(0, start * (1 - easedProgress));

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
});
