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
  all: { icon: '★', name: 'All', color: '#e5e7eb', thumb: './assets/images/portraits/秀歌.webp' },
  spring: { icon: '🌸', name: '春', color: '#f472b6' },
  summer: { icon: '🌿', name: '夏', color: '#22d3ee' },
  autumn: { icon: '🍁', name: '秋', color: '#fb923c' },
  winter: { icon: '❄️', name: '冬', color: '#a5b4fc' },
  none: { icon: '◎', name: 'その他', color: '#94a3b8', thumb: './assets/images/portraits/秀歌-About-その他.webp' }
};

/**
 * アクセシビリティ機能強化
 */
function initAccessibilityFeatures() {
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
}



/**
 * Navigation Module
 */
class Navigation {
  constructor() {
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    this.header = document.getElementById('header');
    this.menuToggle = document.getElementById('menu-toggle');
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
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

  handleSmoothScroll(e) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    this.closeMenu();

    if (targetElement) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      history.pushState(null, null, `#${targetId}`);
      this.updateActiveNavLink(targetId);
    }
  }

  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === activeId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
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



  handleScroll() {
    const scrolled = window.pageYOffset;
    const threshold = 100;

    if (scrolled > threshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    this.updateActiveNavOnScroll();
  }

  updateActiveNavOnScroll() {
    const sections = ['home', 'about', 'gallery', 'contact'];
    const headerHeight = this.header.offsetHeight;
    const scrollPosition = window.pageYOffset + headerHeight + 100;

    let activeSection = 'home';

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section && scrollPosition >= section.offsetTop) {
        activeSection = sectionId;
      }
    }

    this.updateActiveNavLink(activeSection);
  }
}

// ヘッダー高さを考慮したスムーズスクロール
ShukaApp.utils.scrollToSection = function (sectionId) {
  const targetElement = document.getElementById(sectionId);
  const header = document.getElementById('header');

  if (targetElement && header) {
    const headerHeight = header.offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * 全てのYouTube動画を停止（一時停止）する
 * 
 * 機能:
 * - ページ内の全てのYouTube iframeに対して一時停止コマンドを送信
 * - 新しい動画を再生する際に、他の動画を止めるために使用
 * 
 * @param {HTMLIFrameElement} excludeIframe - 停止対象から除外するiframe（現在再生しようとしているもの）
 */
ShukaApp.utils.stopAllVideos = function (excludeIframe = null) {
  const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
  const pauseMessage = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] });

  iframes.forEach(iframe => {
    if (iframe === excludeIframe) return;

    // postMessageで一時停止コマンド送信
    try {
      iframe.contentWindow?.postMessage(pauseMessage, '*');
    } catch (e) {
      // クロスオリジンエラー等は無視
    }

    // ギャラリーの場合、再生状態フラグをリセット
    const thumb = iframe.closest('.mv-thumb');
    if (thumb) {
      thumb.dataset.playing = 'false';
    }
  });
};

/**
 * YouTubeプレーヤーの状態変更を監視するグローバルリスナー
 * - iframe内の再生ボタンが直接クリックされた場合に対応
 * - 再生開始(playerState: 1)を検知して、他の動画を停止
 */
ShukaApp.utils.setupYouTubeGlobalListener = function () {
  window.addEventListener('message', (e) => {
    // YouTubeからのメッセージか確認
    if (e.origin !== "https://www.youtube.com") return;

    try {
      const data = JSON.parse(e.data);

      // 再生開始イベント (info.playerState === 1: Playing)
      if (data.event === 'infoDelivery' && data.info && data.info.playerState === 1) {
        // メッセージ送信元のiframeを特定
        const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
        let sourceIframe = null;

        for (const iframe of iframes) {
          if (iframe.contentWindow === e.source) {
            sourceIframe = iframe;
            break;
          }
        }

        // 送信元以外の動画を停止
        if (sourceIframe) {
          ShukaApp.utils.stopAllVideos(sourceIframe);
        }
      }
    } catch (err) {
      // JSON parse error or other structure mismatch (ignore)
    }
  });
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}

/**
 * 季節ギャラリー（YouTube MV表示・フィルタリング）
 */
class SeasonsGallery {
  constructor(videos = []) {
    this.videos = Array.isArray(videos) ? videos : [];
    this.seasonNav = document.getElementById('season-nav');
    this.seasonContent = document.getElementById('season-content');
    this.navOrder = ['all', 'spring', 'summer', 'autumn', 'winter', 'none'];
    this.currentSeason = 'all';
    this.availableSeasons = this.getAvailableSeasons();

    // ページネーション設定
    this.itemsPerPage = 6; // 1回に表示する件数
    this.displayCounts = {}; // 各季節ごとの現在の表示件数を保持
    this.availableSeasons.forEach(s => this.displayCounts[s] = this.itemsPerPage);

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

    const panels = this.availableSeasons.map((season, index) => {
      const allVideos = this.getVideosForSeason(season);
      const count = this.displayCounts[season] || this.itemsPerPage;
      const visibleVideos = allVideos.slice(0, count);
      const hasMore = allVideos.length > count;

      return `
      <div class="season-panel ${index === 0 ? 'active' : ''}"
           id="${season}-panel"
           role="tabpanel"
           aria-labelledby="${season}-tab"
           aria-hidden="${index === 0 ? 'false' : 'true'}"
           data-season="${season}">
        <div class="mv-grid" id="${season}-grid">
          ${visibleVideos.map(video => this.buildCard(video)).join('')}
        </div>
        ${hasMore ? `
          <div class="load-more-container">
            <button class="load-more-btn" data-season="${season}">
              <span>Load More</span>
              <svg class="icon" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
              <div class="load-more-spinner"></div>
            </button>
          </div>
        ` : ''}
      </div>
    `}).join('');

    this.seasonNav.innerHTML = navHTML;
    this.seasonContent.innerHTML = panels;
    this.seasonButtons = this.seasonNav.querySelectorAll('.season-btn');
    this.seasonPanels = this.seasonContent.querySelectorAll('.season-panel');

    // もっと見るボタンのイベントバインド
    this.bindLoadMoreButtons();
  }

  bindLoadMoreButtons() {
    this.seasonContent.querySelectorAll('.load-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const season = e.currentTarget.getAttribute('data-season');
        this.loadMore(season, e.currentTarget);
      });
    });
  }

  loadMore(season, btn) {
    if (btn) {
      btn.classList.add('loading');
      const span = btn.querySelector('span');
      if (span) span.textContent = 'Loading...';
    }

    // 擬似的なローディング遅延（UX向上）
    setTimeout(() => {
      const currentCount = this.displayCounts[season] || this.itemsPerPage;
      const allVideos = this.getVideosForSeason(season);
      const nextVideos = allVideos.slice(currentCount, currentCount + this.itemsPerPage);

      this.displayCounts[season] = currentCount + this.itemsPerPage;

      // グリッドに直接追加（再レンダリングしない）
      const grid = document.getElementById(`${season}-grid`);
      if (grid) {
        const fragment = document.createDocumentFragment();
        nextVideos.forEach((video, index) => {
          const temp = document.createElement('div');
          temp.innerHTML = this.buildCard(video);
          const card = temp.firstElementChild;
          card.classList.add('new-item');
          card.style.animationDelay = `${index * 0.1}s`; // 順番に出現
          fragment.appendChild(card);
        });
        grid.appendChild(fragment);
      }

      // ボタンの状態更新または削除
      const hasMore = allVideos.length > this.displayCounts[season];
      if (!hasMore && btn) {
        const container = btn.closest('.load-more-container');
        if (container) {
          container.style.opacity = '0';
          setTimeout(() => container.remove(), 500);
        }
      } else if (btn) {
        btn.classList.remove('loading');
        const span = btn.querySelector('span');
        if (span) span.textContent = 'Load More';
      }
    }, 800); // 800msの遅延
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

    // 他の全ての動画を停止
    ShukaApp.utils.stopAllVideos();

    this.stopOtherVideos(thumb);
    thumb.dataset.playing = 'true';

    // Check current language for captions
    const currentLang = document.documentElement.lang || 'ja';
    let ccParams = '';

    if (currentLang !== 'ja') {
      // For non-Japanese languages, force captions on and set language preference
      let ytLang = currentLang;
      // Map internal language codes to YouTube supported codes if necessary
      if (currentLang === 'zh-TW') ytLang = 'zh-Hant';

      ccParams = `&cc_load_policy=1&cc_lang_pref=${ytLang}&hl=${ytLang}`;
    } else {
      ccParams = '&hl=ja';
    }

    thumb.innerHTML = `
      <iframe class="mv-iframe"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&playsinline=1${ccParams}"
              title="YouTube video player"
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
    this.updateAlbumVisibility(season); // アルバムの表示切り替え
    this.announceSeasonChange(season);
  }

  updateAlbumVisibility(season) {
    const albumSection = document.getElementById('album');
    if (!albumSection) return;

    const albums = albumSection.querySelectorAll('.album-card');
    let visibleCount = 0;

    albums.forEach(album => {
      const albumSeason = album.getAttribute('data-season');
      // 'all'の場合は全て表示、それ以外はシーズン一致で表示
      const isVisible = season === 'all' || albumSeason === season;

      if (isVisible) {
        album.style.display = ''; // デフォルトのdisplayに戻す（flex）
        visibleCount++;
      } else {
        album.style.display = 'none';
      }
    });

    // 表示するアルバムがない場合はセクションごと隠す（オプション）
    // albumSection.style.display = visibleCount > 0 ? '' : 'none';
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
      tsuyu: './assets/images/backgrounds/和紙-梅雨.webp'
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
ShukaApp.handlers.switchSeason = function (season) {
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
ShukaApp.utils.initSeasonSelector = function () {
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

    // Update Trigger Button (Desktop)
    const trigger = document.querySelector('.season-dropdown-trigger');
    if (trigger) {
      const selectedBtn = selector.querySelector(`button[data-season="${season}"]`);
      if (selectedBtn) {
        const icon = selectedBtn.querySelector('.season-icon').textContent;
        // Map season to i18n key
        const i18nKey = season === 'none' ? 'nav.season.other' : `nav.season.${season}`;

        const iconSpan = trigger.querySelector('.current-season-icon');
        if (iconSpan) iconSpan.textContent = icon;

        const textSpan = trigger.querySelector('.current-season-text');
        if (textSpan) {
          textSpan.setAttribute('data-i18n', i18nKey);
          // If i18n is available, translate immediately
          if (window.i18n && typeof window.i18n.t === 'function') {
            textSpan.textContent = window.i18n.t(i18nKey);
          }
        }
      }
    }
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
 * エフェクト切り替えスイッチの初期化
 */
ShukaApp.utils.initEffectToggle = function () {
  const toggleCheckbox = document.getElementById('effect-toggle-checkbox');
  if (!toggleCheckbox) return;

  // 初期状態の設定（グローバル設定に合わせる）
  toggleCheckbox.checked = window.isEffectsEnabled;

  // 切り替えイベント
  toggleCheckbox.addEventListener('change', (e) => {
    if (typeof window.toggleEffects === 'function') {
      window.toggleEffects(e.target.checked);
    }
  });
};

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
    return function () {
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
(function setDefaultSeason() {
  // デフォルトは梅雨（tsuyu）
  document.body.dataset.season = "tsuyu";
})();
// 季節カラーモジュール終了


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

    if (ShukaApp.utils.initEffectToggle)
      ShukaApp.utils.initEffectToggle(); // エフェクト切り替えスイッチの初期化

    initAlbumPlayers(); // アルバムプレイヤーの初期化

    if (ShukaApp.utils.setupYouTubeGlobalListener)
      ShukaApp.utils.setupYouTubeGlobalListener(); // YouTubeグローバルリスナーの初期化

    // Listen for language changes to update players
    window.addEventListener('languageChanged', (e) => {
      const lang = e.detail.language;
      updateAllPlayersLanguage(lang);
    });
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

/**
 * アルバムプレイヤーの初期化
 * - トラックリストのクリックイベントを処理
 * - iframeの再生動画を切り替え
 * - 初期ロード時の言語設定適用
 */
function initAlbumPlayers() {
  // 1. トラック切り替えイベントの設定
  document.addEventListener('click', (e) => {
    // .album-track またはその子要素がクリックされたか判定
    const track = e.target.closest('.album-track');
    if (!track) return;

    // 必要なデータを取得
    const videoId = track.dataset.videoId;
    const playerList = track.closest('.album-tracks');
    if (!playerList) return;

    const playerId = playerList.dataset.playerId;
    const iframe = document.getElementById(playerId);

    if (iframe && videoId) {
      // 他の動画を停止（このiframeは除外）
      ShukaApp.utils.stopAllVideos(iframe);

      // 現在の言語設定を確認
      const currentLang = document.documentElement.lang || 'ja';
      let ytLang = currentLang;
      if (currentLang === 'zh-TW') ytLang = 'zh-Hant';
      const ccParams = currentLang !== 'ja' ? `&cc_load_policy=1&cc_lang_pref=${ytLang}&hl=${ytLang}` : '&hl=ja';

      // iframeのsrcを更新して動画を切り替え（自動再生 + 言語設定）
      iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1${ccParams}`;

      // activeクラスの切り替え
      playerList.querySelectorAll('.album-track').forEach(t => t.classList.remove('active'));
      track.classList.add('active');
    }
  });

  // 2. 既存のiframeに対して初期言語設定を適用
  const currentLang = document.documentElement.lang || 'ja';
  let ytLang = currentLang;
  if (currentLang === 'zh-TW') ytLang = 'zh-Hant';
  const ccParams = currentLang !== 'ja' ? `&cc_load_policy=1&cc_lang_pref=${ytLang}&hl=${ytLang}` : '&hl=ja';
  const iframes = document.querySelectorAll('.album-video-area iframe');

  iframes.forEach(iframe => {
    let src = iframe.getAttribute('src');
    if (!src) return;

    // 既存のパラメータを削除して重複を防止
    src = src.replace(/&cc_load_policy=1/, '').replace(/&cc_lang_pref=[a-zA-Z-]+/, '').replace(/&hl=[a-zA-Z-]+/, '');

    // パラメータを追加
    iframe.setAttribute('src', src + ccParams);
  });
}



/**
 * 全てのYouTubeプレイヤーの言語設定を更新
 * - 言語切り替え時に呼び出される
 */
function updateAllPlayersLanguage(lang) {
  const currentLang = lang || 'ja';
  let ytLang = currentLang;
  if (currentLang === 'zh-TW') ytLang = 'zh-Hant';
  const ccParams = currentLang !== 'ja' ? `&cc_load_policy=1&cc_lang_pref=${ytLang}&hl=${ytLang}` : '&hl=ja';

  // Update Album Players
  const albumIframes = document.querySelectorAll('.album-video-area iframe');
  albumIframes.forEach(iframe => {
    let src = iframe.getAttribute('src');
    if (!src) return;

    // Clean URL
    src = src.replace(/&cc_load_policy=1/, '').replace(/&cc_lang_pref=[a-zA-Z-]+/, '').replace(/&hl=[a-zA-Z-]+/, '');

    // Update URL (will reload video)
    iframe.setAttribute('src', src + ccParams);
  });

  // Update Gallery Players (if any are playing)
  const galleryIframes = document.querySelectorAll('.mv-iframe');
  galleryIframes.forEach(iframe => {
    let src = iframe.getAttribute('src');
    if (!src) return;

    // Clean URL
    src = src.replace(/&cc_load_policy=1/, '').replace(/&cc_lang_pref=[a-zA-Z-]+/, '').replace(/&hl=[a-zA-Z-]+/, '');

    // Update URL
    iframe.setAttribute('src', src + ccParams);
  });
}
