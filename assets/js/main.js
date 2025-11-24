/**
 * Shūka アプリケーション グローバルネームスペース
 * 
 * 目的:
 * - すべてのグローバル変数と機能を統一されたネームスペース下に整理
 * - window オブジェクトの汚染を防止
 * - モジュール間の依存関係を明確化
 */
window.ShukaApp = window.ShukaApp || {
  // コア機能
  gallery: null,
  navigation: null,
  effects: null,
  
  // ユーティリティ関数
  utils: {},
  
  // 設定とデータ
  data: {},
  
  // イベントハンドラー
  handlers: {}
};

/**
 * 季節データ設定（MVフィルタ用ラベル）
 * - アイコン/表示名/アクセントカラーのみ保持
 */

/**
 * 季節ラベル定義
 * - MVフィルタ用の表示名と配色
 */
ShukaApp.data.SEASON_LABELS = {
  all:   { icon: '★', name: 'All',    color: '#e5e7eb', thumb: './assets/images/portraits/秀歌.webp' },
  spring:{ icon: '🌸', name: '春',     color: '#f472b6' },
  summer:{ icon: '🌿', name: '夏',     color: '#22d3ee' },
  autumn:{ icon: '🍁', name: '秋',     color: '#fb923c' },
  winter:{ icon: '❄️', name: '冬',     color: '#a5b4fc' },
  none:  { icon: '◎', name: 'その他', color: '#94a3b8', thumb: './assets/images/portraits/秀歌-About-その他.webp' }
};

/**
 * アクセシビリティ機能強化
 * 
 * 目的:
 * - キーボードナビゲーションとスクリーンリーダー対応を改善
 * - マウスとキーボードの使用状況を追跡してフォーカス表示を最適化
 */
function initAccessibilityFeatures() {
  // マウス使用状況の追跡（フォーカス管理のため）
  // マウスクリック時は視覚的なフォーカス表示を無効化
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  
}



/**
 * Navigation Module
 *
 * 役割:
 * - アンカースクロールのスムーズ化
 * - スクロール位置に応じたヘッダー挙動（必要に応じて）
 * - アクティブナビゲーションの更新
 *
 * パフォーマンス配慮:
 * - スクロール/ポインタイベントは `passive: true` を基本にし、
 *   レイアウトスラッシングを避けるため `requestAnimationFrame`/スロットリングの検討余地あり。
 */

class Navigation {
  /**
   * コンストラクタ - ナビゲーション要素の初期化
   */
  constructor() {
    // DOM要素の取得
    this.navMenu = document.getElementById('nav-menu'); // メニュー要素
    this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]'); // アンカーリンク群
    this.header = document.getElementById('header'); // ヘッダー要素
    this.menuToggle = document.getElementById('menu-toggle'); // モバイル用トグル
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    // 初期化処理の実行
    this.init();
  }
  
  /**
   * 初期化処理
   * - イベントバインディング
   * - スクロール処理の初期実行
   */
  init() {
    this.bindEvents();
    this.handleScroll();
  }
  
  /**
   * イベントリスナーのバインディング
   * - スムーズスクロール
   * - 外部クリック検知
   * - スクロール検知
   * - キーボード操作
   */
  bindEvents() {
    
    // アンカーリンクでのスムーズスクロール
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
    
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', this.toggleMenu);
    }

    if (this.navMenu) {
      this.navMenu.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && this.isMobileNav()) {
          this.closeMenu();
        }
      });
    }

    window.addEventListener('resize', this.handleResize);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
    
    
    // スクロール時のヘッダースタイル変更
    window.addEventListener('scroll', () => this.handleScroll());
    
  }
  
  isMobileNav() {
    return window.matchMedia('(max-width: 767px)').matches;
  }
  
  
  /**
   * スムーズスクロール処理
   * アンカーリンククリック時の処理
   * - ページ内の指定セクションにスムーズにスクロール
   * - URLを更新してブックマーク対応
   * - アクティブなナビゲーションリンクを更新
   */
  handleSmoothScroll(e) {
    e.preventDefault(); // デフォルトのリンク動作を無効化
    
    const targetId = e.target.getAttribute('href').substring(1); // #を除いたIDを取得
    const targetElement = document.getElementById(targetId);
    
    this.closeMenu();

    if (targetElement) {
      
      // 固定ヘッダーの高さを考慮したオフセット計算
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      // ネイティブのスムーズスクロール（遅延最小化）
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      
      // スクロールをトリガーせずにURLを更新
      history.pushState(null, null, `#${targetId}`);
      
      // アクティブなナビゲーションリンクを更新
      this.updateActiveNavLink(targetId);
    }
  }
  
  /**
   * カスタムスムーズスクロール（イージング付き）
   * - より細かなアニメーション制御が必要な場合に使用
   * - ease-in-out-cubic イージング関数を使用
   */
  // smoothScrollTo は未使用のため削除しました（ネイティブの window.scrollTo を使用）
  
  /**
   * アクティブナビゲーションリンクの更新
   * - 現在のセクションに対応するナビゲーションリンクにアクティブクラスを付与
   * - アクセシビリティのためにaria-current属性を設定
   */
  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1); // #を除いたリンクのID
      if (href === activeId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page'); // 現在のページを示すARIA属性
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
  
  toggleMenu() {
    if (!this.navMenu) return;
    const willOpen = !this.navMenu.classList.contains('active');
    if (willOpen) {
      this.navMenu.classList.add('active');
      document.body.classList.add('menu-open');
      if (this.menuToggle) {
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
      }
    } else {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (!this.navMenu) return;
    this.navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (this.menuToggle) {
      this.menuToggle.classList.remove('active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  handleResize() {
    if (!this.isMobileNav()) {
      this.closeMenu();
    }
  }
  
  
  
  /**
   * スクロールイベント処理
   * - ヘッダーのスタイル変更（スクロール時の背景変更など）
   * - スクロール位置に応じたアクティブナビゲーションの更新
   */
  handleScroll() {
    const scrolled = window.pageYOffset; // 現在のスクロール位置
    const threshold = 100; // ヘッダースタイル変更の閾値
    
    // 閾値を超えたらヘッダーにスクロールクラスを追加
    if (scrolled > threshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // スクロール位置に基づくアクティブナビゲーションの更新
    this.updateActiveNavOnScroll();
  }
  
  /**
   * スクロール位置に基づくアクティブナビゲーションの更新
   * - 現在表示されているセクションを判定
   * - 対応するナビゲーションリンクをアクティブ状態にする
   */
  updateActiveNavOnScroll() {
    const sections = ['home', 'about', 'gallery', 'contact']; // チェック対象のセクションID
    const headerHeight = this.header.offsetHeight; // ヘッダーの高さ
    const scrollPosition = window.pageYOffset + headerHeight + 100; // 判定位置（オフセット付き）
    
    let activeSection = 'home'; // デフォルトはホームセクション
    
    // 各セクションの位置をチェックして現在のセクションを特定
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section && scrollPosition >= section.offsetTop) {
        activeSection = sectionId;
      }
    }
    
    // アクティブナビゲーションリンクを更新
    this.updateActiveNavLink(activeSection);
  }
}

/**
 * 外部使用用のユーティリティ関数
 * - 外部からセクションにスクロールする際に使用
 * - ヘッダーの高さを考慮したスムーズスクロール
 */
ShukaApp.utils.scrollToSection = function(sectionId) {
  const targetElement = document.getElementById(sectionId);
  const header = document.getElementById('header');
  
  if (targetElement && header) {
    const headerHeight = header.offsetHeight; // ヘッダー高さ取得
    const targetPosition = targetElement.offsetTop - headerHeight; // オフセット計算
    
    // スムーズスクロールでターゲット位置に移動
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};


// モジュールシステム用のエクスポート設定
// CommonJS環境での利用を可能にする
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
/**
 * 季節モジュール
 * - YouTubeのMVを季節フィルタで表示する軽量ギャラリー
 * - クリック時にiframeを生成するライト埋め込みでパフォーマンス最適化
 */

/**
 * SeasonsGallery
 *
 * 役割:
 * - 季節ナビ/パネルの生成と切替
 * - YouTube埋め込みの遅延ロード
 * - 背景テーマ・ARIAの同期更新
 */
class SeasonsGallery {
  constructor(videos = []) {
    this.videos = Array.isArray(videos) ? videos : [];
    this.seasonNav = document.getElementById('season-nav');
    this.seasonContent = document.getElementById('season-content');
    this.navOrder = ['all', 'spring', 'summer', 'autumn', 'winter', 'none'];
    this.currentSeason = 'all';
    this.availableSeasons = this.getAvailableSeasons();
    this.render();
    this.bindEvents();
    this.updateSeasonBackground('tsuyu', 'all');
    this.updateAboutImage(this.currentSeason);
  }

  getAvailableSeasons() {
    const seasons = new Set(['all']);
    this.videos.forEach(video => seasons.add(video.season || 'none'));
    return this.navOrder.filter(season => seasons.has(season));
  }

  render() {
    if (!this.seasonNav || !this.seasonContent) return;
    const navHTML = this.availableSeasons.map((season, index) => {
      const meta = ShukaApp.data.SEASON_LABELS[season] || ShukaApp.data.SEASON_LABELS.none;
      const bg = meta.thumb
        ? `style="background-image:url('${meta.thumb}'); background-size: cover; background-position: center top; background-repeat: no-repeat;"`
        : '';
      return `
        <button class="season-btn ${index === 0 ? 'active' : ''}"
                id="${season}-tab"
                data-season="${season}"
                role="tab"
                aria-selected="${index === 0 ? 'true' : 'false'}"
                aria-controls="${season}-panel"
                ${bg}>
          <span class="season-icon" aria-hidden="true">${meta.icon}</span>
          <span class="season-name">${meta.name}</span>
        </button>
      `;
    }).join('');

    const panels = this.availableSeasons.map((season, index) => `
      <div class="season-panel ${index === 0 ? 'active' : ''}"
           id="${season}-panel"
           role="tabpanel"
           aria-labelledby="${season}-tab"
           aria-hidden="${index === 0 ? 'false' : 'true'}"
           data-season="${season}">
        <div class="mv-grid">
          ${this.getVideosForSeason(season).map(video => this.buildCard(video)).join('')}
        </div>
      </div>
    `).join('');

    this.seasonNav.innerHTML = navHTML;
    this.seasonContent.innerHTML = panels;
    this.seasonButtons = this.seasonNav.querySelectorAll('.season-btn');
    this.seasonPanels = this.seasonContent.querySelectorAll('.season-panel');
  }

  bindEvents() {
    if (!this.seasonNav || !this.seasonContent) return;
    this.seasonNav.addEventListener('click', (e) => {
      const button = e.target.closest('.season-btn');
      if (!button) return;
      this.switchToSeason(button.getAttribute('data-season'));
    });

    this.seasonContent.addEventListener('click', (e) => {
      const thumb = e.target.closest('.mv-thumb');
      if (!thumb) return;
      e.preventDefault();
      this.embedVideo(thumb);
    });
  }

  getVideosForSeason(season) {
    if (season === 'all') return this.videos;
    if (season === 'none') return this.videos.filter(v => (v.season || 'none') === 'none');
    return this.videos.filter(v => v.season === season);
  }

  buildCard(video) {
    const meta = ShukaApp.data.SEASON_LABELS[video.season] || ShukaApp.data.SEASON_LABELS.none;
    const dateText = this.formatDate(video.publishedAt);
    const thumb = video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    return `
      <article class="mv-card" data-season="${video.season || 'none'}">
        <div class="mv-thumb" data-video-id="${video.id}" aria-label="${video.title} を再生">
          <img src="${thumb}" alt="${video.title}" loading="lazy" decoding="async">
          ${video.duration ? `<span class="mv-duration">${video.duration}</span>` : ''}
          <button type="button" aria-label="${video.title} を再生">▶</button>
        </div>
        <div class="mv-meta">
          <span class="mv-chip">
            <span class="dot" style="background:${meta.color};"></span>
            ${meta.name}
          </span>
          <h3 class="mv-title">${video.title}</h3>
          ${dateText ? `<p class="mv-date">${dateText}</p>` : ''}
        </div>
      </article>
    `;
  }

  embedVideo(thumb) {
    if (!thumb || thumb.dataset.playing === 'true') return;
    const videoId = thumb.dataset.videoId;
    if (!videoId) return;
    this.stopOtherVideos(thumb);
    thumb.dataset.playing = 'true';
    thumb.innerHTML = `
      <iframe class="mv-iframe"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1"
              title="YouTube video player"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen></iframe>
    `;
  }

  stopOtherVideos(currentThumb) {
    const scope = this.seasonContent || document;
    const iframes = scope.querySelectorAll('.mv-iframe');
    const stopMessage = JSON.stringify({ event: 'command', func: 'stopVideo', args: [] });
    iframes.forEach(iframe => {
      if (currentThumb && currentThumb.contains(iframe)) return;
      try {
        iframe.contentWindow?.postMessage(stopMessage, '*');
      } catch (e) {
        // noop
      }
      const src = iframe.getAttribute('src');
      if (src && src.includes('autoplay=1')) {
        try {
          const url = new URL(src);
          url.searchParams.set('autoplay', '0');
          iframe.setAttribute('src', url.toString());
        } catch (e) {
          // noop
        }
      }
      const thumb = iframe.closest('.mv-thumb');
      if (thumb) {
        thumb.dataset.playing = 'false';
      }
    });
  }

  switchToSeason(season) {
    if (!this.availableSeasons.includes(season)) season = 'all';
    this.currentSeason = season;
    this.updateSeasonButtons();
    this.updateSeasonPanels();
    this.updateURL(season);
    const backgroundSeason = season === 'all' || season === 'none' ? 'tsuyu' : season;
    this.updateSeasonBackground(backgroundSeason, season);
    this.updateAboutImage(season);
    this.announceSeasonChange(season);
  }

  updateSeasonButtons() {
    if (!this.seasonButtons) return;
    this.seasonButtons.forEach(button => {
      const season = button.getAttribute('data-season');
      const isActive = season === this.currentSeason;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  updateSeasonPanels() {
    if (!this.seasonPanels) return;
    this.seasonPanels.forEach(panel => {
      const season = panel.getAttribute('data-season');
      const isActive = season === this.currentSeason;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
  }

  updateURL(season) {
    const url = new URL(window.location.href);
    url.searchParams.set('season', season);
    window.history.replaceState({}, '', url.toString());
  }

  updateSeasonBackground(backgroundSeason, originalSeason) {
    const washiImages = {
      spring: './assets/images/backgrounds/背景_春模様.webp',
      summer: './assets/images/backgrounds/背景_夏模様.webp',
      autumn: './assets/images/backgrounds/背景_秋模様.webp',
      winter: './assets/images/backgrounds/背景_冬模様.webp',
      tsuyu:  './assets/images/backgrounds/和紙-梅雨.webp'
    };
    const imageUrl = washiImages[backgroundSeason];
    if (imageUrl) {
      const header = document.getElementById('header');
      if (header) header.style.setProperty('--washi-bg', `url('${imageUrl}')`);
      if (document.body) document.body.style.setProperty('--washi-bg', `url('${imageUrl}')`);
    }
    // data-season属性には実際に選択された季節を設定
    const actualSeason = originalSeason || backgroundSeason;
    document.body.setAttribute('data-season', actualSeason);

    const selector = document.getElementById('season-selector');
    if (selector && typeof selector.updateActive === 'function') {
      selector.updateActive(actualSeason);
    }

    // 降下物エフェクトのリセット
    if (typeof window.disableSakura === 'function') window.disableSakura();
    if (typeof window.disableRain === 'function') window.disableRain();
    if (typeof window.disableSnow === 'function') window.disableSnow();
    if (typeof window.disableAutumnLeaves === 'function') window.disableAutumnLeaves();
    if (typeof window.disableSummerWillow === 'function') window.disableSummerWillow();

    // 季節に応じたエフェクト有効化（実際に選択された季節に基づく）
    if (actualSeason === 'spring') {
      if (typeof window.enableSakura === 'function') window.enableSakura();
    } else if (actualSeason === 'summer') {
      if (typeof window.enableSummerWillow === 'function') window.enableSummerWillow();
    } else if (actualSeason === 'autumn') {
      if (typeof window.enableAutumnLeaves === 'function') window.enableAutumnLeaves();
    } else if (actualSeason === 'winter') {
      if (typeof window.enableSnow === 'function') window.enableSnow();
    } else {
      // tsuyu / all / none
      if (typeof window.enableRain === 'function') window.enableRain();
    }
  }

  announceSeasonChange(season) {
    const seasonNames = {
      all: '全て',
      spring: '春',
      summer: '夏',
      autumn: '秋',
      winter: '冬',
      tsuyu: '梅雨',
      none: 'その他'
    };
    const announcement = `${seasonNames[season] || season}のMVを表示しています`;
    let liveRegion = document.getElementById('season-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'season-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.classList.add('sr-only');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = announcement;
  }

  getCurrentSeason() {
    return this.currentSeason;
  }

  updateAboutImage(season) {
    const aboutImage = document.querySelector('.about-image');
    if (!aboutImage) return;
    const seasonImages = {
      all: './assets/images/portraits/秀歌.webp',
      spring: './assets/images/portraits/秀歌-About-春.webp',
      summer: './assets/images/portraits/秀歌-About-夏.webp',
      autumn: './assets/images/portraits/秀歌-About-秋.webp',
      winter: './assets/images/portraits/秀歌-About-冬.webp',
      tsuyu: './assets/images/portraits/秀歌-梅雨.webp',
      none: './assets/images/portraits/秀歌-About-その他.webp'
    };
    const imageUrl = seasonImages[season] || seasonImages.tsuyu;
    aboutImage.src = imageUrl;
    aboutImage.srcset = `${imageUrl} 1x`;
    aboutImage.setAttribute('data-season', season);
    const picture = aboutImage.closest('picture');
    if (picture) {
      // Ensure browsers honoring <source> pick up the new seasonal image
      picture.querySelectorAll('source').forEach(source => {
        source.srcset = `${imageUrl} 1x`;
      });
    }
  }

  formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  }
}


// 外部使用用のグローバル関数（例：フッターリンク）
/**
 * グローバル季節切り替え関数
 * 
 * 機能:
 * - 外部からの季節切り替えを可能にする
 * - フッターリンクやその他の要素から利用
 * 
 * @param {string} season - 切り替え先の季節
 */
ShukaApp.handlers.switchSeason = function(season) {
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    window.seasonsGallery.switchToSeason(season);
  }
}
// 後方互換性のための従来のグローバル参照を維持
window.switchSeason = ShukaApp.handlers.switchSeason;

/**
 * 季節セレクタの初期化
 * 
 * 機能:
 * - season-selectorコンテナ内のボタンイベント設定
 * - アクティブ状態の更新メソッド追加
 * - アクセシビリティ対応（aria-checked）
 */
ShukaApp.utils.initSeasonSelector = function() {
  const selector = document.getElementById('season-selector');
  if (!selector)
    return;
    
  const buttons = selector.querySelectorAll('button[data-season]');
  
  // アクティブ状態更新メソッドを追加
  selector.updateActive = (season) => {
    buttons.forEach(btn => {
      const isActive = btn.getAttribute('data-season') === season;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive); // アクセシビリティ対応
    });
  };
  
  // デフォルト季節（梅雨）で初期状態を設定
  if (window.seasonsGallery && typeof window.seasonsGallery.getCurrentSeason === 'function')
    selector.updateActive(window.seasonsGallery.getCurrentSeason());
    
  // クリックイベントの設定
  selector.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-season]');
    if (!button)
      return;
    const season = button.getAttribute('data-season');
    if (typeof window.switchSeason === 'function')
      window.switchSeason(season);

    // ハンバーガーメニューを閉じる
    if (ShukaApp.navigation && typeof ShukaApp.navigation.closeMenu === 'function') {
      ShukaApp.navigation.closeMenu();
    }
  });
}
// 後方互換性のための従来のグローバル参照を維持
window.initSeasonSelector = ShukaApp.utils.initSeasonSelector;

/**
 * モジュールシステム対応のエクスポート処理
 * 
 * 機能:
 * - CommonJS環境でのモジュールエクスポート
 * - ブラウザ環境でのグローバル変数設定
 */
// CommonJS環境でのエクスポート設定
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SeasonsGallery;
}
// ブラウザ環境でのグローバル変数設定
// SeasonsGallery クラスをネームスペースに追加
ShukaApp.SeasonsGallery = SeasonsGallery;
// 後方互換性のための従来のグローバル参照を維持
window.SeasonsGallery = SeasonsGallery;
/**
 * Main JavaScript Module
 * Coordinates all site functionality and provides utility functions
 */

/**
 * ShūkaAppクラス - メインアプリケーション制御
 * 
 * 役割:
 * - アプリケーション全体の初期化とライフサイクル管理
 * - 交差監視によるアニメーション制御
 * - フォーム処理とバリデーション
 * - パフォーマンス最適化とアクセシビリティ強化
 * - エラーハンドリングと監視
 */
class ShūkaApp {
  /**
   * コンストラクタ - アプリケーションの基本設定
   */
  constructor() {
    this.isLoaded = false; // アプリケーション読み込み完了状態
    this.observers = new Map(); // 監視オブザーバーの管理マップ
    this.init();
  }
  
  /**
   * アプリケーション初期化処理
   * - DOMの読み込み状況に応じて適切なタイミングでsetup実行
   */
  init() {
    // DOM読み込み完了を待機
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }
  
  /**
   * DOM読み込み完了時の処理
   * - 各種機能モジュールの初期化を順次実行
   * - アプリケーション準備完了の通知
   */
  onDOMReady() {
    this.setupPerformanceOptimizations(); // パフォーマンス最適化
    this.setupAccessibilityEnhancements(); // アクセシビリティ機能強化
    this.setupErrorHandling(); // エラーハンドリング設定
    
    // メインコンテンツへの自動スクロール
    const main = document.getElementById('main-content');
    if (main) {
      main.scrollIntoView({ behavior: 'auto' });
    }
    this.isLoaded = true; // アプリケーション読み込み完了フラグ
    
    // 他のモジュール用にアプリケーション準備完了カスタムイベントを発行
    document.dispatchEvent(new CustomEvent('shukaAppReady'));
  }
  
  /**
   * 交差監視オブザーバーの設定
   * 
   * 機能:
   * - 要素がビューポートに入った時のアニメーション実行
   * - パフォーマンスを考慮した閾値設定
   * - 複数要素の効率的な監視管理
   */
  
  /**
   * 要素のアニメーション実行処理
   * 
   * 機能:
   * - ユーザーのアニメーション設定を尊重（reduced-motion対応）
   * - 要素タイプに応じた適切なアニメーション選択
   * - アニメーション完了後のクリーンアップ
   * 
   * @param {HTMLElement} element - アニメーション対象要素
   */
  
  
  /**
   * パフォーマンス最適化機能の初期化
   * 
   * 機能:
   * - IntersectionObserverを使用した画像の遅延読み込み
   * - ビューポート内に入った画像の自動読み込み
   * - ユーザーインタラクション時の重要リソースプリロード
   * - タッチデバイス対応のリソース先読み
   */
  setupPerformanceOptimizations() {
    // 遅延画像読み込みの設定
    if ('IntersectionObserver' in window) {
      // 画像が表示領域に入った際の処理を定義
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              // data-srcからsrcに画像URLを移動して読み込み開始
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img); // 監視終了
            }
          }
        });
      });
      
      // data-src属性を持つ全画像を監視対象に追加
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
      
      // 後でクリーンアップできるようにオブザーバーを保存
      this.observers.set('images', imageObserver);
    }
    
    // ユーザーインタラクション時の重要リソースプリロード
    document.addEventListener('mouseover', this.preloadOnHover, { once: true });
    // タッチデバイス対応：適切なthisコンテキストでのプリロード実行
    document.addEventListener('touchstart', () => this.preloadOnTouch(), { once: true });
  }
  
  /**
   * マウスホバー時の画像プリロード
   * 
   * 機能:
   * - ユーザーのホバー操作を契機とした季節画像の先読み
   * - prefetchリンクによる効率的なリソース読み込み
   * - 季節切り替え時の表示速度向上
   */
  preloadOnHover() {
    // プリロード対象の季節画像リスト
    const seasonImages = [
      './assets/images/portraits/秀歌-About-春.webp',
      './assets/images/portraits/秀歌-About-夏.webp',
      './assets/images/portraits/秀歌-About-秋.webp',
      './assets/images/portraits/秀歌-About-冬.webp'
    ];
    
    // 各季節画像をprefetchで先読み
    seasonImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  /**
   * タッチ操作時の画像プリロード
   * 
   * 機能:
   * - タッチデバイス向けのリソース先読み処理
   * - ホバー処理と同様の画像プリロード実行
   */
  preloadOnTouch() {
    // タッチデバイス向けもホバー時と同様の処理を実行
    this.preloadOnHover();
  }
  
  /**
   * アクセシビリティ機能の拡張設定
   * 
   * 機能:
   * - スキップリンクの設定と動作制御
   * - モーダル・オーバーレイのフォーカス管理
   * - タブキー操作時のフォーカストラップ処理
   * - ページ変更時のスクリーンリーダー向けアナウンス
   */
  setupAccessibilityEnhancements() {
    // スキップリンクは未採用のため、関連バインドは削除済み
    
    // スクリーンリーダー向けのページ変更アナウンス設定
    this.setupRouteAnnouncements();
  }
  
  
  
  /**
   * ルート変更時のスクリーンリーダー向けアナウンス設定
   * 
   * 機能:
   * - ハッシュ変更時の自動セクション検出
   * - 見出し要素からのコンテンツ名取得
   * - スクリーンリーダー向けの適切なナビゲーション通知
   */
  setupRouteAnnouncements() {
    // ハッシュ変更時のナビゲーションアナウンス
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1); // '#'を除去
      if (hash) {
        const section = document.getElementById(hash);
        if (section) {
          // セクション内の見出し要素を検索
          const heading = section.querySelector('h1, h2, h3');
          if (heading) {
            // 見出しテキストを使用してセクション移動をアナウンス
            this.announceToScreenReader(`${heading.textContent}セクションに移動しました`);
          }
        }
      }
    });
  }
  
  /**
   * スクリーンリーダー向けメッセージアナウンス
   * 
   * 機能:
   * - 視覚的に隠されたアナウンサー要素の動的生成
   * - スクリーンリーダーでの自動メッセージ読み上げ
   * 
   * @param {string} message - アナウンスするメッセージ
   */
  announceToScreenReader(message) {
    // 既存のアナウンサー要素を検索
    let announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
      // アナウンサー要素が存在しない場合は新規作成
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.className = 'sr-only'; // 視覚的に隠蔽（既存ユーティリティクラス）
      document.body.appendChild(announcer);
    }
    
    // メッセージを設定してスクリーンリーダーに通知
    announcer.textContent = message;
  }
  
  /**
   * グローバルエラーハンドリングの設定
   * 
   * 機能:
   * - 未処理のJavaScriptエラーの捕捉
   * - プロミス拒否の未処理エラーの監視
   * - エラートラッキングサービスへの送信準備
   * - アプリケーション全体の安定性向上
   */
  setupErrorHandling() {
    // グローバルJavaScriptエラーハンドラー
    window.addEventListener('error', () => {
      // エラートラッキングサービスに送信可能
      // 本格運用時にはログ収集システムとの連携を追加
    });
    
    // 未処理のプロミス拒否エラーハンドラー
    window.addEventListener('unhandledrejection', () => {
      // エラートラッキングサービスに送信可能
      // 非同期処理のエラーを適切に監視・報告
    });
  }
  
  /**
   * パブリックユーティリティメソッド群
   */
  
  /**
   * デバウンス関数 - 連続実行の制御
   * 
   * 機能:
   * - 指定時間内の連続呼び出しを無視し、最後の呼び出しのみ実行
   * - スクロール・リサイズイベントでのパフォーマンス最適化
   * - タイマーベースの遅延実行制御
   * 
   * @param {Function} func - 実行対象の関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @returns {Function} デバウンス処理が適用された関数
   */
  /**
   * デバウンス処理の実装詳細
   * 
   * 動作原理:
   * 1. 新しい呼び出しがあるたびに前のタイマーをキャンセル
   * 2. 新しいタイマーを設定し、指定時間後に関数を実行
   * 3. 連続呼び出しが停止して初めて実行される
   * 
   * 使用例: ユーザー入力の完了待ち、リサイズイベントの遅延実行
   */
  debounce(func, wait) {
    let timeout;  // タイマーIDを保持するクロージャ変数
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);    // タイマーをクリア（必須ではないが安全のため）
        func(...args);             // 最終的な引数で元関数を実行
      };
      clearTimeout(timeout);       // 既存タイマーをキャンセル（連続呼び出しでのリセット）
      timeout = setTimeout(later, wait); // waitミリ秒後に実行する新タイマーを設定
    };
  }
  
  /**
   * スロットル関数 - 実行頻度の制限
   * 
   * 機能:
   * - 指定時間間隔での関数実行を保証
   * - 高頻度イベント（スクロール・マウス移動）でのパフォーマンス制御
   * - 一定間隔での確実な処理実行
   * 
   * @param {Function} func - 実行対象の関数
   * @param {number} limit - 実行間隔（ミリ秒）
   * @returns {Function} スロットル処理が適用された関数
   */
  /**
   * スロットル処理の実装詳細
   * 
   * 動作原理:
   * 1. 初回呼び出しは即座に実行
   * 2. 実行後はinThrottleフラグをtrueに設定
   * 3. フラグがtrueの間は後続の呼び出しを無視
   * 4. limitミリ秒後にフラグをリセットして再び実行可能に
   * 
   * 使用例: スクロールイベント、マウス移動の頻度制限
   */
  throttle(func, limit) {
    let inThrottle;  // スロットル中かどうかを表すフラグ
    return function() {
      const args = arguments;        // 引数を保持
      const context = this;          // thisコンテキストを保持
      if (!inThrottle) {             // スロットル中でない場合のみ実行
        func.apply(context, args);   // 元のコンテキストと引数で関数を実行
        inThrottle = true;           // スロットル状態に移行
        // limitミリ秒後にスロットルを解除し、次回実行を可能に
        setTimeout(() => inThrottle = false, limit);
      }
      // inThrottleがtrueの場合は何もしない（呼び出しを無視）
    };
  }
  
  /**
   * クリーンアップメソッド - リソースの適切な解放
   * 
   * 機能:
   * - 全ての登録済みObserverの切断
   * - メモリリークの防止
   * - アプリケーション終了時の適切なリソース管理
   */
  destroy() {
    // 全てのObserverを切断してメモリリークを防止
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear(); // 観察者Mapをクリア
  }
}

/**
 * メインアプリケーションの初期化
 * 
 * 機能:
 * - ShūkaAppクラスのインスタンス生成
 * - グローバルアクセス用にウィンドウオブジェクトに登録
 * - アプリケーションのメイン機能を自動起動
 */
// ShūkaApp インスタンスをネームスペースに追加
ShukaApp.instance = new ShūkaApp();

/**
 * デフォルト季節設定 - 梅雨
 * 
 * 機能:
 * - サイトアクセス時のデフォルト季節を梅雨に設定
 * - ボディ要素にdata-season属性を設定
 */
// 季節カラーモジュール開始
(function setDefaultSeason(){
  // デフォルトは梅雨（tsuyu）
  document.body.dataset.season = "tsuyu";
})();
// 季節カラーモジュール終了

/**
 * 水面波紋エフェクトモジュール
 * 
 * 機能:
 * - マウス操作に連動した美しい波紋エフェクト
 * - 和風の静寂感を表現する控えめな動作
 * - パフォーマンス配慮とアクセシビリティ対応
 */
class WaterRippleEffect {
  /**
   * コンストラクタ - 波紋エフェクトの初期化
   */
  constructor() {
    this.container = document.getElementById('ripple-container'); // 波紋表示用コンテナ
    this.isActive = true; // エフェクトの有効状態
    this.lastRippleTime = 0; // 最後の波紋生成時刻
    this.throttleDelay = 400; // 波紋生成間隔（ミリ秒）- 和風の静寂感を演出
    this.maxRipples = 12; // 同時表示可能な最大波紋数
    this.ripples = []; // 波紋オブジェクトの配列
    this.petalLimit = 100; // 最大アクティブ花びら数
    this.frameTime = 0; // フレーム時間管理
    this.performanceOptimized = false; // パフォーマンス最適化フラグ
    
    this.init();
  }
  
  /**
   * 初期化処理
   * - コンテナの存在確認
   * - ユーザー設定のチェック
   * - イベント設定
   */
  init() {
    if (!this.container) {
      return; // コンテナが存在しない場合は終了
    }
    
    this.checkUserPreferences();
    this.bindEvents();
  }
  
  /**
   * ユーザー設定の確認
   * - アニメーション削減設定の尊重
   * - 小画面での無効化
   * - 低スペック端末でのパフォーマンス調整
   */
  checkUserPreferences() {
    // ユーザーのアニメーション削減設定を尊重
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.isActive = false;
      this.container.style.display = 'none';
      return;
    }

    // 小画面（スマートフォン）では波紋を無効化
    const smallScreenQuery = window.matchMedia('(max-width: 768px)');
    if (smallScreenQuery.matches) {
      this.isActive = false;
      this.container.style.display = 'none';
      return;
    }
    
    // 低スペック端末の判定 - 静寂感を保ちつつパフォーマンスを最適化
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.throttleDelay = 600; // より低い頻度で生成
      this.maxRipples = 8; // 最大波紋数を削減
    }
  }
  
  /**
   * イベントリスナーの設定
   * 
   * 機能:
   * - マウス・タッチ操作に対する波紋生成イベント
   * - ユーザー設定変更の監視
   * - デバイス特性変更への動的対応
   */
  bindEvents() {
    if (!this.isActive) return;
    
    // マウス移動イベント: カーソルの軌跡に沿った波紋生成（スロットル処理付き）
    // スロットルで程よく制限し、パフォーマンスと静寂感をバランスよく保つ
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // クリックイベント: ユーザーアクション時の即座波紋生成
    // マウス移動と異なりスロットルなしで直ちに反応、ユーザーフィードバックを重視
    document.addEventListener('click', (e) => this.handleClick(e));
    
    // タッチイベント: スマートフォン・タブレットでの波紋生成
    // passive: trueでスクロールパフォーマンスを最適化（preventDefault()を呼ばないことを保証）
    document.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: true });
    
    // ユーザーのアニメーション設定変更を監視
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        this.disable(); // アニメーション削減設定時は無効化
      } else {
        this.enable(); // 設定解除時は有効化
      }
    });

    // ビューポートサイズ変更による自動調整
    const smallScreenQuery = window.matchMedia('(max-width: 768px)');
    smallScreenQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.disable(); // 小画面時は無効化
      } else {
        this.enable(); // 大画面復帰時は有効化
      }
    });
    
    // 定期的な古い波紋のクリーンアップ（2秒間隔）
    setInterval(() => this.cleanupRipples(), 2000);
    
    // パフォーマンスモニタリングと動的調整
    this.monitorPerformance();
  }
  
  /**
   * マウス移動イベントハンドラー - 静謐な水面の波紋エフェクト
   * 鯉の泳ぐ日本庭園の池をイメージした優雅な波紋を生成
   * @param {MouseEvent} e - マウスイベントオブジェクト
   * @description 和風の美意識に基づいた繊細な波紋表現で、過度な重複を避けながら
   *              自然な水面の動きを再現。パフォーマンスを考慮したスロットリング制御
   */
  handleMouseMove(e) {
    if (!this.isActive || !this.shouldCreateRipple()) return;
    
    // 静謐な鯉の池の波紋を最小限の重複で生成
    this.createTranquilRipples(e.clientX, e.clientY);
    this.lastRippleTime = Date.now();
  }
  
  /**
   * クリックイベントハンドラー - 豪華な和風クリックエフェクト
   * クリック位置に特別な日本風の豪華な波紋エフェクトを生成
   * @param {MouseEvent} e - マウスクリックイベント
   * @description ユーザーのクリック操作に対して、金箔を散らしたような
   *              贅沢で印象的な波紋エフェクトで応答。和の美学を体現
   */
  handleClick(e) {
    if (!this.isActive) return;

    const { clientX: x, clientY: y } = e;
    // 豪華な日本風クリックエフェクトを生成
    this.createLuxuriousClickEffect(x, y);
  }
  
  /**
   * タッチイベントハンドラー - モバイル端末での波紋生成
   * タッチ操作に応じて中程度の波紋エフェクトを作成
   * @param {TouchEvent} e - タッチイベントオブジェクト
   * @description スマートフォンやタブレットでの直感的な操作体験を提供。
   *              指先の動きに自然に反応する和風の水面エフェクト
   */
  handleTouch(e) {
    if (!this.isActive || !e.touches[0]) return;
    
    const touch = e.touches[0];
    this.createRipple(touch.clientX, touch.clientY, 'medium');
  }
  
  /**
   * 波紋生成の可否判定 - パフォーマンス最適化のスロットリング制御
   * 前回の波紋生成から十分な時間が経過しているかを確認
   * @returns {boolean} 波紋を生成すべきかどうかの判定結果
   * @description 穏やかで静謐なタイミング制御により、過度な波紋の重複を防ぎ
   *              自然な水面の動きを演出。CPUリソースの効率的な利用
   */
  shouldCreateRipple() {
    const now = Date.now();
    return (now - this.lastRippleTime) > this.throttleDelay; // 穏やかで静謐なタイミング制御
  }
  
  /**
   * 波紋エレメントの生成 - 和風の水面エフェクトのコア機能
   * 指定された位置、サイズ、色で美しい波紋を作成し、DOMに追加
   * @param {number} x - 波紋の中心X座標
   * @param {number} y - 波紋の中心Y座標  
   * @param {string} size - 波紋のサイズ (small/medium/large/huge)
   * @param {string} color - 波紋の色テーマ (default/rainbow/gold)
   * @description 日本庭園の池に石を投げ入れた時の美しい波紋を再現。
   *              サイズに応じた自然な拡散パターンと、金箔や虹色などの
   *              豪華な視覚効果オプション。メモリ効率を考慮した自動削除機能付き
   */
  createRipple(x, y, size = 'medium', color = 'default') {
    if (!this.isActive || this.ripples.length >= this.maxRipples) return;
    
    const ripple = document.createElement('div');
    ripple.className = `ripple ${size} ${color}`;
    
    // タイプに基づく波紋サイズの確率的計算
    // Math.random()で各範囲内のランダム値を生成し、自然なバリエーションを実現
    // 公式: baseSize + Math.random() * variationRange
    const sizeMap = {
      small: Math.random() * 120 + 80,     // 80-200px: 80 + (0-120)の範囲
      medium: Math.random() * 200 + 150,   // 150-350px: 150 + (0-200)の範囲
      large: Math.random() * 300 + 200,    // 200-500px: 200 + (0-300)の範囲
      huge: Math.random() * 400 + 300      // 300-700px: 300 + (0-400)の範囲
    };
    
    const rippleSize = sizeMap[size] || sizeMap.medium;
    
    // 波紋の配置 - 中心座標を基準とした正確な位置決め
    // 円形要素の中心をクリック地点に合わせるため、半径分を減算
    ripple.style.width = `${rippleSize}px`;                    // 波紋の幅
    ripple.style.height = `${rippleSize}px`;                   // 波紋の高さ
    ripple.style.left = `${x - rippleSize / 2}px`;             // X座標: 中心 - 半径
    ripple.style.top = `${y - rippleSize / 2}px`;              // Y座標: 中心 - 半径
    
    // 回転と初期スケールの設定
    // 0°-360°のランダム回転で自然な動きを演出
    // 初期スケール0から開始して後のCSSアニメーションで拡大
    const rotation = Math.random() * 360;                       // 0-360度のランダム回転角
    ripple.style.transform = `scale(0) rotate(${rotation}deg)`;  // 初期状態: 非表示 + 回転設定
    
    // 色彩効果の動的生成 - HSL色空間を利用した鮮やかなグラデーション
    if (color === 'rainbow') {
      // 虹色モード: HSLでランダムな色相と補色を組み合わせたグラデーション
      const hue = Math.random() * 360;                          // 0-360度のランダム色相
      // 中心から外側に向かって: メインカラー → 補色(+60度) → 透明
      ripple.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.8) 0%, hsla(${hue + 60}, 70%, 60%, 0.4) 40%, transparent 80%)`;
    } else if (color === 'gold') {
      // 金色モード: 金色系で統一したグラデーション (富貴な印象)
      // RGB値: (255,215,0)金 → (255,165,0)オレンジ金 → (255,140,0)濃いオレンジ金
      ripple.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.6) 30%, rgba(255, 140, 0, 0.3) 60%, transparent 90%)';
    }
    
    // コンテナへの追加と追跡配列への登録
    this.container.appendChild(ripple);
    this.ripples.push({
      element: ripple,
      createdAt: Date.now()
    });
    
    // アニメーション完了後の自動削除 - メモリリーク防止
    const animationDuration = size === 'huge' ? 3500 : size === 'large' ? 2800 : size === 'small' ? 1200 : 1800;
    setTimeout(() => {
      this.removeRipple(ripple);
    }, animationDuration);
  }
  
  /**
   * 波紋エレメントの削除 - メモリとDOM要素の適切な管理
   * 指定された波紋要素をDOMから削除し、追跡配列からも除去
   * @param {HTMLElement} rippleElement - 削除対象の波紋DOM要素
   * @description パフォーマンス維持のため、不要になった波紋要素を確実に削除。
   *              メモリリークを防ぎ、長時間の利用でも快適な動作を保証
   */
  removeRipple(rippleElement) {
    if (rippleElement && rippleElement.parentNode) {
      rippleElement.parentNode.removeChild(rippleElement);
    }
    
    // 追跡配列からも除去
    this.ripples = this.ripples.filter(ripple => ripple.element !== rippleElement);
  }
  
  /**
   * 波紋のクリーンアップ処理 - 古い波紋の自動削除
   * 一定時間経過した波紋を自動的に検出・削除し、メモリを最適化
   * @description 3秒以上経過した波紋を一括クリーンアップし、パフォーマンスを維持。
   *              長時間のインタラクションでもDOM要素のたまりやメモリリークを防止
   */
  cleanupRipples() {
    const now = Date.now();
    const oldRipples = this.ripples.filter(ripple => {
      return (now - ripple.createdAt) > 3000; // 3秒以上経過した波紋を削除
    });
    
    oldRipples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }

  /**
   * 静謐な鯉の池の波紋生成 - 日本の美意識に基づくエレガントな水面演出
   * マウス移動時に静寂で美しい水面の波紋を作成
   * @param {number} x - 波紋の中心X座標
   * @param {number} y - 波紋の中心Y座標
   * @description 日本庭園の池に石を静かに落とした時の美しい波紋を再現。
   *              墨絵のような繊細な滿ち効果と、穏やかな次第波紋で自然な感情を表現
   */
  createTranquilRipples(x, y) {
    // 主要な穏やかな波紋 - 静水に石を落としたような美しさ
    this.createRipple(x, y, 'small', 'elegant');
    
    // 時折発生する第二波紋 - 墨絵の滿ち効果を再現
    if (Math.random() < 0.12) { // 静寂さを増すため、発生頻度を低めに設定
      setTimeout(() => {
        const offsetX = (Math.random() * 20 - 10); // 繊細さを出すための小さなオフセット
        const offsetY = (Math.random() * 20 - 10);
        this.createRipple(x + offsetX, y + offsetY, 'small', 'subtle');
      }, Math.random() * 500 + 200); // 自然な感覺のための遺延時間
    }
    
    // 非常に稀な大きな波紋 - 水面の深みを表現するバリエーション
    if (Math.random() < 0.05) {
      setTimeout(() => {
        this.createRipple(x, y, 'medium', 'subtle');
      }, Math.random() * 800 + 400);
    }
  }

  /**
   * 禅に着想を得た繊細なクリックエフェクト生成
   * 禅の美学に基づく上品で静寂なクリック演出
   * @param {number} x - エフェクトの中心X座標
   * @param {number} y - エフェクトの中心Y座標
   * @description 墨絵、浮遊する葉、微かな光の滿み、静寂の点を組み合わせた
   *              豪華でありながら静謐な日本の美意識を体現するエフェクト
   */
  createZenClickEffect(x, y) {
    // 墨滴の滿み - 書道の美しさを表現
    this.createInkDrops(x, y, 6);

    // 浮遊する葉 - 清涼な風のような動き
    setTimeout(() => {
      this.createFloatingLeaves(x, y, 4);
    }, 200);

    // 微かな光の滿み - 柔らかな光の演出
    setTimeout(() => {
      this.createSubtleGlow(x, y, 120);
    }, 100);

    // 静寂の点 - 穏やかな余韻の表現
    this.createTranquilDots(x, y, 8);
  }

  /**
   * 墨滴の滿みエフェクト生成 - 書道の美しさをデジタルで再現
   * 中心点から穏やかに拡散する小さな墨滴を作成
   * @param {number} x - 墨滴の中心X座標
   * @param {number} y - 墨滴の中心Y座標
   * @param {number} count - 墨滴の数
   * @description 日本の書道や墨絵の美意識を参考に、穏やかで上品な
   *              墨の滿み効果をアニメーションで表現。控えめなサイズと動き
   */
  createInkDrops(x, y, count) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'ink-drop';

      // 控えめなサイズ
      const size = Math.random() * 4 + 3; // 3-7px
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      drop.style.left = `${x - size / 2}px`;
      drop.style.top = `${y - size / 2}px`;

      // 穏やかな拡散
      const angle = (360 / count) * i + (Math.random() * 60 - 30);
      const distance = 30 + Math.random() * 50; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.8 + 1.5).toFixed(2); // 1.5-2.3秒

      drop.style.setProperty('--dx', `${dx}px`);
      drop.style.setProperty('--dy', `${dy}px`);
      drop.style.animationDuration = `${duration}s`;

      this.container.appendChild(drop);
      setTimeout(() => drop.remove(), duration * 1000);
    }
  }

  /**
   * 微かな光の滿みエフェクト生成 - 柔らかな光の演出
   * 中心から緊やかに広がる幻想的な光りを作成
   * @param {number} x - 光の中心X座標
   * @param {number} y - 光の中心Y座標
   * @param {number} size - 光のサイズ
   * @description 表情豊かで神秘的な光の演出で、クリック体験に魅力を追加。
   *              和の美学における「光と影」の繊細な表現をデジタルで再現
   */
  createSubtleGlow(x, y, size) {
    if (!this.container) return;

    const glow = document.createElement('div');
    glow.className = 'subtle-glow';
    glow.style.width = `${size}px`;
    glow.style.height = `${size}px`;
    glow.style.left = `${x - size / 2}px`;
    glow.style.top = `${y - size / 2}px`;

    this.container.appendChild(glow);
    setTimeout(() => glow.remove(), 2000);
  }

  /**
   * Create floating leaves - 浮遊する葉
   */
  createFloatingLeaves(x, y, count) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'floating-leaf';

      // 自然なサイズの葉
      const width = Math.random() * 4 + 2; // 2-6px
      const height = Math.random() * 3 + 2; // 2-5px
      leaf.style.width = `${width}px`;
      leaf.style.height = `${height}px`;
      leaf.style.left = `${x - width / 2}px`;
      leaf.style.top = `${y - height / 2}px`;

      // ゆっくりと舞い散る
      const angle = Math.random() * 360;
      const distance = 40 + Math.random() * 60; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1.5 + 2).toFixed(2); // 2-3.5秒

      leaf.style.setProperty('--dx', `${dx}px`);
      leaf.style.setProperty('--dy', `${dy}px`);
      leaf.style.animationDuration = `${duration}s`;

      // ランダムなグラデーション角度
      const leafAngle = Math.random() * 360;
      leaf.style.setProperty('--leaf-angle', `${leafAngle}deg`);

      this.container.appendChild(leaf);
      setTimeout(() => leaf.remove(), duration * 1000);
    }
  }

  /**
   * 静寂の点エフェクト生成 - 穏やかな余韻を表現する点の演出
   * 中心から放射状に静かに拡散する小さな点を配置
   * @param {number} x - 点の中心X座標
   * @param {number} y - 点の中心Y座標
   * @param {number} count - 点の数
   * @description 禅の思想における「空」や「無」を表現する繊細な点のアニメーション。
   *              控えめながら印象深い、静謐な美しさを演出する日本の美意識の体現
   */
  createTranquilDots(x, y, count) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'tranquil-dot';
      dot.style.left = `${x - 1}px`;
      dot.style.top = `${y - 1}px`;

      // 静かに放射状に拡散
      const angle = (360 / count) * i;
      const distance = 20 + Math.random() * 40; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.5 + 1).toFixed(2); // 1-1.5秒

      dot.style.setProperty('--dx', `${dx}px`);
      dot.style.setProperty('--dy', `${dy}px`);
      dot.style.animationDuration = `${duration}s`;

      this.container.appendChild(dot);
      setTimeout(() => dot.remove(), duration * 1000);
    }
  }

  /**
   * 桜の花びらバーストエフェクト生成 - 豪華なクリック演出
   * 中心から桜の花びらが華やかに舞い散るエフェクトを作成
   * @param {number} x - 花びらの中心X座標
   * @param {number} y - 花びらの中心Y座標
   * @param {number} count - 花びらの数（デフォルト: 8）
   * @description 日本の春の象徴である桜の花びらが舞い散る美しい瞬間を表現。
   *              ユーザーのクリック操作に対して、贅沢で印象的な視覚体験を提供
   */
  createSakuraBurst(x, y, count = 8) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';

      const size = Math.random() * 12 + 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${x - size / 2}px`;
      petal.style.top = `${y - size / 2}px`;

      const angle = Math.random() * 360;
      const distance = 80 + Math.random() * 80;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1 + 2).toFixed(2);

      petal.style.setProperty('--dx', `${dx}px`);
      petal.style.setProperty('--dy', `${dy}px`);
      petal.style.animationDuration = `${duration}s`;

      this.container.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000);
    }
  }

  /**
   * 壮麗な日本風クリックエフェクト生成 - 複数のエフェクトを組み合わせた豪華な演出
   * 金色の巨大波紋、桜の花びら、歌舞伎風の渦、浮遊要素などを総合した華やかなエフェクト
   * @param {number} x - エフェクトの中心X座標
   * @param {number} y - エフェクトの中心Y座標
   * @description ユーザーのクリック操作に対して最も豪華で印象的な体験を提供。
   *              日本の伝統的な美意識を現代のデジタル表現で昇華させた、記憶に残る視覚演出
   */
  createLuxuriousClickEffect(x, y) {
    this.createRipple(x, y, 'huge', 'gold');
    this.createSakuraBurst(x, y, 14);
    this.createKabukiSwirls(x, y, 2);
    this.createFloatingElements(x, y, 12);
    this.createSubtleGlow(x, y, 200);
    this.createClickFlash(x, y);
  }

  /**
   * 歌舞伎風の渦エフェクト生成 - 伝統芸能の動的美しさをデジタル表現
   * 歌舞伎の舞台演出に着想を得た螺旋状の渦エフェクト
   * @param {number} x - 渦の中心X座標
   * @param {number} y - 渦の中心Y座標
   * @param {number} count - 渦の数（デフォルト: 2）
   * @description 日本の伝統芸能である歌舞伎の力強く美しい動きを参考にした
   *              螺旋状の渦エフェクトで、クリック体験に文化的な深みを追加
   */
  createKabukiSwirls(x, y, count = 2) {
    if (!this.container) return;
    for (let i = 0; i < count; i++) {
      const swirl = document.createElement('div');
      swirl.className = 'kabuki-swirl';
      const size = 40 + Math.random() * 20;
      swirl.style.width = `${size}px`;
      swirl.style.height = `${size}px`;
      swirl.style.left = `${x - size / 2}px`;
      swirl.style.top = `${y - size / 2}px`;
      swirl.style.animationDuration = `${(Math.random() * 0.4 + 0.8).toFixed(2)}s`;
      this.container.appendChild(swirl);
      setTimeout(() => swirl.remove(), 1000);
    }
  }

  /**
   * Create intense gold foil sparkle effect - キラン！金箔の煌めき演出
   */
  createGoldFoilEffect(x, y) {
    // メイン中央スパークル - より大きく強烈に
    this.createGoldSparkle(x, y, 60);
    
    // 瞬間爆発エフェクト
    this.createGoldBurst(x, y, 20);
    
    // 金箔粒子の舞い散り - より多く
    this.createGoldParticles(x, y, 18);
    
    // 金箔のかけら
    setTimeout(() => {
      this.createGoldFlakes(x, y, 15);
    }, 50);
    
    // 背景シマー - より強烈に
    setTimeout(() => {
      this.createGoldShimmer(x, y, 120);
    }, 80);
    
    // セカンドウェーブ
    setTimeout(() => {
      this.createGoldSparkle(x, y, 35);
      this.createGoldParticles(x, y, 10);
    }, 150);
    
    // サードウェーブ - 余韻
    setTimeout(() => {
      this.createGoldFlakes(x, y, 8);
    }, 300);
  }

  /**
   * Create central gold sparkle - メイン金箔煌めき
   */
  createGoldSparkle(x, y, size) {
    if (!this.container) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'gold-sparkle';
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x - size / 2}px`;
    sparkle.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }

  /**
   * Create floating gold particles - 金箔粒子 - 強化版
   */
  createGoldParticles(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      
      // より大きな粒子でキラキラ感アップ
      const size = Math.random() * 6 + 4; // 4-10px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;
      
      // より広範囲に散る
      const angle = (360 / count) * i + (Math.random() * 90 - 45);
      const distance = 80 + Math.random() * 120; // より遠くまで飛ぶ
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.6 + 1.2).toFixed(2); // 1.2-1.8秒
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const gradientAngle = Math.random() * 360;
      particle.style.setProperty('--particle-angle', `${gradientAngle}deg`);
      
      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), duration * 1000);
    }
  }

  /**
   * Create gold shimmer background - 金箔シマー背景 - 強化版
   */
  createGoldShimmer(x, y, size) {
    if (!this.container) return;
    
    const shimmer = document.createElement('div');
    shimmer.className = 'gold-shimmer';
    shimmer.style.width = `${size}px`;
    shimmer.style.height = `${size}px`;
    shimmer.style.left = `${x - size / 2}px`;
    shimmer.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(shimmer);
    setTimeout(() => shimmer.remove(), 1000);
  }

  /**
   * Create gold flakes - 金箔のかけら
   */
  createGoldFlakes(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('div');
      flake.className = 'gold-flake';
      
      // 不規則なサイズの金箔
      const width = Math.random() * 8 + 3; // 3-11px
      const height = Math.random() * 6 + 2; // 2-8px
      flake.style.width = `${width}px`;
      flake.style.height = `${height}px`;
      flake.style.left = `${x - width / 2}px`;
      flake.style.top = `${y - height / 2}px`;
      
      // ゆっくりと舞い散る
      const angle = Math.random() * 360;
      const distance = 60 + Math.random() * 100;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1 + 1.5).toFixed(2); // 1.5-2.5秒
      
      flake.style.setProperty('--dx', `${dx}px`);
      flake.style.setProperty('--dy', `${dy}px`);
      flake.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const flakeAngle = Math.random() * 360;
      flake.style.setProperty('--flake-angle', `${flakeAngle}deg`);
      
      this.container.appendChild(flake);
      setTimeout(() => flake.remove(), duration * 1000);
    }
  }

  /**
   * Create gold burst explosion - 金箔爆発エフェクト
   */
  createGoldBurst(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const burst = document.createElement('div');
      burst.className = 'gold-burst';
      burst.style.left = `${x - 2}px`;
      burst.style.top = `${y - 2}px`;
      
      // 放射状に爆発
      const angle = (360 / count) * i;
      const distance = 40 + Math.random() * 60;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.3 + 0.4).toFixed(2); // 0.4-0.7秒
      
      burst.style.setProperty('--dx', `${dx}px`);
      burst.style.setProperty('--dy', `${dy}px`);
      burst.style.animationDuration = `${duration}s`;
      
      this.container.appendChild(burst);
      setTimeout(() => burst.remove(), duration * 1000);
    }
  }

  /**
   * Create floating elements like cherry blossom petals on water
   */
  createFloatingElements(x, y, count = 6) {
    if (!this.container) return;
    const activeParticles = this.container.querySelectorAll('.refined-particle').length;
    if (activeParticles >= 15) return; // 静寂感のための低めの上限

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'refined-particle';
      const size = Math.random() * 3 + 2; // 2-5px - very small and delicate
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;

      // より有機的で、整理されすぎない拡散パターン
      const angle = Math.random() * 360; // 完全にランダムな方向
      const distance = 60 + Math.random() * 60; // より優しい拡散
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const dur = (Math.random() * 1.2 + 2).toFixed(2); // 2-3.2s - very slow and graceful
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${dur}s`;

      // 自然らしさのための微細な色彩変化を追加
      const opacity = 0.3 + Math.random() * 0.3; // 0.3-0.6 opacity
      particle.style.background = `radial-gradient(
        circle,
        rgba(75, 85, 99, ${opacity}) 0%,
        rgba(107, 114, 128, ${opacity * 0.6}) 50%,
        transparent 100%
      )`;

      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), dur * 1000);
    }
  }

  /**
   * Creates a brief radial flash at click location
   */
  createClickFlash(x, y){
    if(!this.container) return;
    const flash=document.createElement('div');
    flash.className='click-flash';
    const size=20;
    flash.style.width=`${size}px`;
    flash.style.height=`${size}px`;
    flash.style.left=`${x-size/2}px`;
    flash.style.top=`${y-size/2}px`;
    this.container.appendChild(flash);
    setTimeout(()=>flash.remove(),600);
  }

  enable() {
    this.isActive = true;
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
  
  disable() {
    this.isActive = false;
    if (this.container) {
      this.container.style.display = 'none';
    }
    
    // 既存の全ての波紋をクリア
    this.ripples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }
  
  // 外部制御用のパブリックメソッド
  toggle() {
    if (this.isActive) {
      this.disable();
    } else {
      this.enable();
    }
  }
  
  createCustomRipple(x, y, color, size = 200) {
    if (!this.isActive) return;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.background = `radial-gradient(circle, ${color}40 0%, ${color}20 20%, ${color}10 40%, transparent 80%)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(ripple);
    
    setTimeout(() => {
      this.removeRipple(ripple);
    }, 1500);
  }
  
  /**
   * Monitor performance and dynamically optimize for 60fps
   */
  monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkPerformance = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // FPSが50を下回った場合は最適化を実行
        if (fps < 50 && !this.performanceOptimized) {
          this.optimizeForPerformance();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };
    
    requestAnimationFrame(checkPerformance);
  }
  
  /**
   * Optimize settings for better performance
   */
  optimizeForPerformance() {
    this.performanceOptimized = true;
    this.throttleDelay = Math.max(this.throttleDelay * 1.5, 600); // Slower ripples
    this.maxRipples = Math.max(this.maxRipples - 3, 6); // Fewer ripples
    
    // 既存の波紋数を削減
    while (this.ripples.length > this.maxRipples) {
      const oldestRipple = this.ripples.shift();
      this.removeRipple(oldestRipple.element);
    }
  }
}

// DOM読み込み完了時に波紋エフェクトを初期化
let waterRipples;
function initWaterRipples() {
  if (waterRipples) return;
  waterRipples = new WaterRippleEffect();
  // ウォーターリップルエフェクトをネームスペースに追加
  ShukaApp.effects = waterRipples;
  // 後方互換性のための従来のグローバル参照を維持
  window.waterRipples = waterRipples;
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => initWaterRipples(), { timeout: 3000 });
} else {
  window.addEventListener('load', () => initWaterRipples(), { once: true });
}

/**
 * 水面波紋エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 外部から水面波紋エフェクトを制御可能
 * - カスタム波紋の任意の場所での生成
 * - UIインタラクションやユーザー設定からのエフェクト制御
 */

/**
 * 水面波紋エフェクトのオン/オフを切り替え
 */
ShukaApp.utils.toggleRipples = function() {
  if (window.waterRipples) {
    window.waterRipples.toggle();
  }
};

/**
 * 指定した位置でカスタム波紋を生成
 * 
 * @param {number} x - 波紋のX座標
 * @param {number} y - 波紋のY座標
 * @param {string} color - 波紋の色（CSSカラー形式）
 * @param {number} size - 波紋のサイズ（ピクセル）
 */
ShukaApp.utils.createCustomRipple = function(x, y, color, size) {
  if (window.waterRipples) {
    window.waterRipples.createCustomRipple(x, y, color, size);
  }
};


/**
 * DOM読み込み完了時のアプリケーション初期化
 * 
 * 処理順序:
 * 1. ページ状態の設定（トランジション有効化）
 * 2. アクセシビリティ機能の初期化
 * 3. リソースプリフェッチの開始
 * 4. ナビゲーション・UI要素の初期化
 * 5. 動的コンテンツの生成
 * 6. 季節ギャラリー機能の初期化
 * 
 * 注意:
 * - 処理順序が重要：DOM生成 → クラス初期化 → イベントバインド
 * - 動的生成された要素に対するイベントの再設定が必須
 */
document.addEventListener('DOMContentLoaded', () => {
  // ページ読み込み完了状態をマーク（CSSトランジションを有効化）
  document.body.classList.add('loaded');
  
  // アクセシビリティ機能の初期化（スキップリンク、フォーカス管理など）
  initAccessibilityFeatures();
  

  // スクロールボタンイベントハンドラーの初期化
  initScrollButtons();

  // モバイルナビゲーションシステムの初期化
  if (typeof Navigation !== 'undefined') {
    // ナビゲーションインスタンスをネームスペースに追加
    ShukaApp.navigation = new Navigation();
  }
  
  // MVデータの取得とギャラリー初期化
  const deferredInit = async () => {
    // 画像読み込みエラーのハンドリング設定
    setupImageErrorHandling();

    const mvData = await generateSeasonGallery();
    ShukaApp.gallery = new SeasonsGallery(mvData);
    window.seasonsGallery = ShukaApp.gallery;

    // URLパラメータから季節を読み込んで適用
    const urlParams = new URLSearchParams(window.location.search);
    const seasonFromURL = urlParams.get('season');
    if (seasonFromURL && ShukaApp.gallery.availableSeasons.includes(seasonFromURL)) {
      ShukaApp.gallery.switchToSeason(seasonFromURL);
    }

    if (typeof initSeasonSelector === 'function')
      initSeasonSelector(); // 季節セレクターコンポーネントの初期化
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => deferredInit(), { timeout: 2000 });
  } else {
    setTimeout(() => deferredInit(), 0);
  }

  // フッター季節ボタンは現在DOMに存在しないため未初期化（安全に無効化）
  // setupFooterSeasonButtons();
});

/**
 * スクロールボタンハンドラーの初期化
 * 
 * 機能:
 * - data-scroll-target属性を持つ全ボタンにイベントリスナー追加
 * - クリック時に指定されたセクションへのスムーススクロール実行
 * - ナビゲーションリンクやCTAボタンの統一処理
 */
function initScrollButtons() {
  // data-scroll-target属性を持つ全要素を取得
  document.querySelectorAll('[data-scroll-target]').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-scroll-target');
      ShukaApp.utils.scrollToSection(target); // スムーススクロール関数を呼び出し
    });
  });
}

/**
 * MVデータを取得
 * - 静的JSON（assets/data/mv.json）からYouTube動画メタデータを読み込む
 */
async function generateSeasonGallery() {
  try {
    const res = await fetch('./assets/data/mv.json', { cache: 'no-store' });
    const data = await res.json();
    if (!Array.isArray(data))
      return [];
    return data.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  } catch (e) {
    console.error('Failed to load mv.json', e);
    return [];
  }
}



/**
 * 画像読み込みエラーの個別ハンドリング
 * 
 * 機能:
 * - 破損した画像やネットワークエラー時のフォールバック処理
 * - 重複エラーハンドリングの防止（一度処理した画像の再処理を回避）
 * - 特定クラスを持つ要素の適切な非表示処理
 * - エラー情報のコンソール出力でデバッグ支援
 * 
 * @param {HTMLImageElement} img - エラーが発生した画像要素
 */
function handleImageError(img) {
  // 重複エラーハンドリングを防止（同じ画像に対して一度だけ処理）
  if (!img.dataset.errorHandled) {
    img.dataset.errorHandled = 'true'; // 処理済みフラグを設定
    
    // フォールバック処理：特定クラスの要素は完全に非表示
    if (img.classList.contains('about-image') || img.classList.contains('creator-avatar')) {
      img.style.display = 'none'; // レイアウトを崩さないように非表示
    }
  }
}

/**
 * 全サイトの画像エラーハンドリングの初期化
 * 
 * 機能:
 * - ページ内の全画像要素を取得してエラーイベントリスナーを一括登録
 * - 画像読み込み失敗時の自動フォールバック処理を設定
 * - 動的に生成された画像を含む全ての画像に対応
 * - ネットワークエラーやファイル破損時のユーザー体験向上
 */
function setupImageErrorHandling() {
  // ページ内の全画像要素にエラーハンドラーを一括追加
  document.querySelectorAll('img').forEach(img => {
    // 各画像にエラーイベントリスナーを登録
    img.addEventListener('error', () => handleImageError(img));
  });
}
