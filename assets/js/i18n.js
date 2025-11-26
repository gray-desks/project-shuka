/**
 * Internationalization (i18n) Module
 * Handles language switching and text replacement.
 */

const translations = {
    ja: {
        nav: {
            home: "Home",
            about: "About",
            gallery: "Gallery",
            album: "Album",
            season: {
                all: "All",
                spring: "春",
                summer: "夏",
                autumn: "秋",
                winter: "冬",
                other: "その他"
            },
            effects: "降下物エフェクト"
        },
        hero: {
            tagline: "四季を奏でる音楽アーティスト",
            subtitle: "日本の情緒と現代サウンドが響き合う、新しい音楽体験",
            cta: {
                gallery: "ギャラリーを見る",
                about: "アーティストについて"
            }
        },
        about: {
            title: "About Shūka",
            intro: "時を超え、心に響く「和」の記憶。<br>四季の移ろい、静寂の美、古来の伝統。<br>秀歌 -Shūka- は、それらを現代の感性で織りなし、新たな日本の世界観を紡ぎ出すプロジェクトです。",
            features: {
                wa: {
                    title: "和を奏でる",
                    desc: "古来より受け継がれた日本の美学。その儚くも力強い息吹を、今、ここに表現します。変わらない「和」の心が、あなたの感性を静かに揺さぶります。"
                },
                senses: {
                    title: "五感で辿る彩り",
                    desc: "桜の舞、雪の静寂、月の光。幻想的な映像と旋律が重なり合い、言葉では伝えきれない情景を描きます。視覚と聴覚を優しく包み込む、没入体験をお楽しみください。"
                },
                heart: {
                    title: "心に、日本を",
                    desc: "日常の喧騒を離れ、幽玄の世界へ。秀歌が描く景色が、世界中の人々の心に静かな灯をともします。美しい日本を、あなたと共に。"
                }
            }
        },
        gallery: {
            title: "Music Video Gallery",
            subtitle: "YouTubeで公開中のMVを季節とともにお楽しみください"
        },
        album: {
            title: "Album"
        },
        footer: {
            description: "四季を奏でる音楽アーティスト",
            follow: "秀歌をフォローする",
            copyright: "© 2025 秀歌 - Shūka. All rights reserved."
        }
    },
    en: {
        nav: {
            home: "Home",
            about: "About",
            gallery: "Gallery",
            album: "Album",
            season: {
                all: "All",
                spring: "Spring",
                summer: "Summer",
                autumn: "Autumn",
                winter: "Winter",
                other: "Other"
            },
            effects: "Falling Effects"
        },
        hero: {
            tagline: "Music Artist Weaving the Four Seasons",
            subtitle: "A new musical experience where Japanese emotion meets modern sound.",
            cta: {
                gallery: "View Gallery",
                about: "About Artist"
            }
        },
        about: {
            title: "About Shūka",
            intro: "Memories of \"Wa\" (Harmony) that transcend time and resonate in the heart.<br>The changing seasons, the beauty of silence, ancient traditions.<br>Shūka is a project that weaves these together with modern sensibility to spin a new worldview of Japan.",
            features: {
                wa: {
                    title: "Playing Harmony",
                    desc: "Japanese aesthetics inherited from ancient times. We express that fragile yet powerful breath here and now. The unchanging heart of \"Wa\" will quietly shake your sensibilities."
                },
                senses: {
                    title: "Colors Traced by Five Senses",
                    desc: "Dancing cherry blossoms, silence of snow, moonlight. Fantastic images and melodies overlap to paint scenes that cannot be conveyed by words alone. Please enjoy an immersive experience that gently wraps your vision and hearing."
                },
                heart: {
                    title: "Japan in Your Heart",
                    desc: "Leave the hustle and bustle of everyday life and go to the world of Yūgen (subtle grace). The scenery drawn by Shūka lights a quiet lamp in the hearts of people all over the world. Beautiful Japan, with you."
                }
            }
        },
        gallery: {
            title: "Music Video Gallery",
            subtitle: "Enjoy MVs available on YouTube along with the seasons."
        },
        album: {
            title: "Album"
        },
        footer: {
            description: "Music Artist Weaving the Four Seasons",
            follow: "Follow Shūka",
            copyright: "© 2025 Shūka. All rights reserved."
        }
    }
};

class I18n {
    constructor() {
        this.currentLang = 'ja'; // Default language
        this.translations = translations;
    }

    init() {
        // Check localStorage or browser preference
        const savedLang = localStorage.getItem('shuka_lang');
        if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
            this.currentLang = savedLang;
        } else {
            // Detect browser language
            // If Japanese, use 'ja'. For ANY other language, default to 'en'.
            const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            this.currentLang = browserLang.startsWith('ja') ? 'ja' : 'en';
        }

        this.updateDOM();
        this.updateLangAttribute();
    }

    setLanguage(lang) {
        if (lang !== 'ja' && lang !== 'en') return;
        this.currentLang = lang;
        localStorage.setItem('shuka_lang', lang);
        this.updateDOM();
        this.updateLangAttribute();

        // Dispatch event for other components if needed
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    updateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(this.translations[this.currentLang], key);
            if (translation) {
                if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                    el.placeholder = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });

        // Update active state of language switcher if it exists
        document.querySelectorAll('.lang-switch-btn').forEach(btn => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateLangAttribute() {
        document.documentElement.lang = this.currentLang;
    }

    getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    }

    t(key) {
        return this.getNestedTranslation(this.translations[this.currentLang], key) || key;
    }
}

// Export instance
export const i18n = new I18n();
