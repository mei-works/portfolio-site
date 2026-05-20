/* =====================================================
   【機能一覧】
   1. ハンバーガーメニューの開閉（スマホ用）
   2. スクロールしたときに要素をふわっとフェードイン表示
===================================================== */


/* =====================================================
   1. ハンバーガーメニューの開閉

   仕組み:
   - ボタンをクリックするたびに、メニュー要素に
     "open" クラスを付けたり外したりする
   - "open" がついたときの見た目はstyle.cssで定義してある
===================================================== */

/* HTMLの要素をJavaScriptで操作できるように取得する */
/* getElementById("id名") で、id属性が一致する要素を1つ取得できる */
const toggle   = document.getElementById('nav-toggle'); /* ハンバーガーボタン */
const navLinks = document.getElementById('nav-links');  /* リンクのリスト */

/* ボタンがクリックされたときの処理 */
toggle.addEventListener('click', () => {
  /* classList.toggle("クラス名") は:
     クラスがなければ → 追加する
     クラスがあれば  → 削除する  */
  navLinks.classList.toggle('open');
});

/* ナビのリンクをクリックしたらメニューを閉じる */
/* querySelectorAll で nav-links 内のすべての <a> を取得し、
   forEach でそれぞれにクリックイベントを設定する */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open'); /* "open" クラスを削除してメニューを閉じる */
  });
});


/* =====================================================
   2. スクロール時のフェードイン

   仕組み:
   - Intersection Observer API（交差オブザーバー）を使う
   - 「ある要素が画面内に入ったか？」を監視できるブラウザの機能
   - 入ったら .visible クラスを追加 → CSSでアニメーション発動
===================================================== */

/* IntersectionObserver を作成する
   引数1: 要素が画面に入ったり出たりしたときに呼ばれる関数
   引数2: 監視の設定（オプション） */
const observer = new IntersectionObserver(
  (entries) => {
    /* entries には「監視中のすべての要素の状態」が入っている */
    entries.forEach(entry => {
      /* entry.isIntersecting が true = 要素が画面内に入った */
      if (entry.isIntersecting) {

        /* 画面内に入った要素に .visible クラスを追加する
           CSSの .reveal.visible でフェードインアニメーションが発動する */
        entry.target.classList.add('visible');

        /* 再スクロールしても消えないようにする */
        observer.unobserve(entry.target);
      }
    });
  },
  {
    /* threshold: 要素の何%が見えたらトリガーするか（0〜1の小数） */
    threshold: 0.15,
    /* rootMargin: 検知エリアの調整 */
    rootMargin: '0px 0px -40px 0px'
  }
);

/* .reveal クラスがついた要素をすべて監視対象にする
   querySelectorAll はCSSセレクタで要素を複数取得できる */
document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el); /* 監視スタート */
});
