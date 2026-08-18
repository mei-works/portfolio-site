/* =====================================================
   script.js — モノトーン・ポートフォリオサイト

   【このファイルでできること】
   1. カスタムカーソルの追従
   2. ローディングアニメーション（カウントアップ）
   3. ハンバーガーメニューの開閉
   4. スクロールフェードイン
===================================================== */


/* =====================================================
   1. カスタムカーソル
   マウスに追従する2つの円（点と輪）を動かす
===================================================== */

/* HTML内のカーソル要素を取得 */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

/* マウスが動いたときの処理 */
document.addEventListener('mousemove', (e) => {
  /* e.clientX / e.clientY はマウスのX・Y座標 */

  /* 点（ドット）はマウスに即座に追従 */
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';

  /* 輪（リング）は少し遅れて追従（CSSのtransitionで遅延している） */
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

/* マウスが画面外に出たときにカーソルを非表示にする */
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});

/*
  リンク・ボタン上でカーソルの輪を大きくする
  querySelectorAll で対象要素をすべて取得し、
  forEach でそれぞれにイベントを設定する
*/
const hoverTargets = document.querySelectorAll('a, button, .gallery-item');

hoverTargets.forEach(el => {
  /* マウスが乗ったとき */
  el.addEventListener('mouseenter', () => {
    cursorRing.classList.add('is-hovering');
  });
  /* マウスが離れたとき */
  el.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('is-hovering');
  });
});


/* =====================================================
   2. ローディングアニメーション
   ページ読み込み時に0〜100のカウントアップを表示し、
   完了したらローディング画面をフェードアウトする
===================================================== */

const loading      = document.querySelector('.loading');
const loadingCount = document.querySelector('.loading-count');

/* カウントアップ関数 */
function countUp(start, end, duration, callback) {
  const startTime = performance.now(); /* 開始時刻を記録 */

  function update(currentTime) {
    /* 経過時間の割合（0〜1）を計算 */
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    /* 現在の数値を計算して表示 */
    const current = Math.floor(progress * (end - start) + start);
    loadingCount.textContent = current;

    if (progress < 1) {
      /* まだ終わっていなければ次のフレームで再実行 */
      requestAnimationFrame(update);
    } else {
      /* 完了したらコールバック関数を呼ぶ */
      callback();
    }
  }

  requestAnimationFrame(update);
}

/* ページ読み込み完了時にカウントアップ開始 */
window.addEventListener('load', () => {
  /* 800msかけて0→100にカウントアップ */
  countUp(0, 100, 800, () => {
    /* 少し待ってからローディング画面を隠す */
    setTimeout(() => {
      loading.classList.add('hidden');
    }, 300);
  });
});


/* =====================================================
   3. ハンバーガーメニューの開閉
===================================================== */

const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');

  /* メニューが開いているときはハンバーガーをXに変形させる */
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

/* リンクをクリックしたらメニューを閉じる */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});


/* =====================================================
   4. スクロールフェードイン
   Intersection Observer API で要素が画面内に入ったか監視する
===================================================== */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* 画面内に入ったら .visible を追加してアニメーション発動 */
        entry.target.classList.add('visible');
        /* 一度表示したら監視をやめる */
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  }
);

/* .reveal クラスがついた要素をすべて監視 */
document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});


/* =====================================================
   5. マーキーのコンテンツを複製する
   テキストが途切れないよう同じ内容を2セット表示する
===================================================== */

const marqueeInner = document.querySelector('.marquee-inner');

if (marqueeInner) {
  /* 元のHTMLを取得して複製し、後ろに追加 */
  const original = marqueeInner.innerHTML;
  marqueeInner.innerHTML = original + original;
  /* CSSアニメーションでは -50% 移動することで
     ちょうど1セット分スクロールし、ループする */
}
