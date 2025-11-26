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
                    desc: "Leave the hustle and bustle of everyday life and enter the world of Yūgen (subtle grace). The scenery drawn by Shūka lights a quiet lamp in the hearts of people all over the world. Beautiful Japan, with you."
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
    },
    fr: {
        nav: {
            home: "Accueil",
            about: "À propos",
            gallery: "Galerie",
            album: "Album",
            season: {
                all: "Tout",
                spring: "Printemps",
                summer: "Été",
                autumn: "Automne",
                winter: "Hiver",
                other: "Autre"
            },
            effects: "Effets de chute"
        },
        hero: {
            tagline: "Artiste musical tissant les quatre saisons",
            subtitle: "Une nouvelle expérience musicale où l'émotion japonaise rencontre la modernité sonore.",
            cta: {
                gallery: "Voir la galerie",
                about: "À propos de l'artiste"
            }
        },
        about: {
            title: "À propos de Shūka",
            intro: "Des souvenirs de « Wa » (Harmonie) qui transcendent le temps et résonnent dans le cœur.<br>Les saisons changeantes, la beauté du silence, les traditions anciennes.<br>Shūka est un projet qui tisse ces éléments avec une sensibilité moderne pour créer une nouvelle vision du Japon.",
            features: {
                wa: {
                    title: "Jouer l'Harmonie",
                    desc: "L'esthétique japonaise héritée des temps anciens. Nous exprimons ce souffle fragile mais puissant, ici et maintenant. Le cœur immuable du « Wa » ébranlera doucement votre sensibilité."
                },
                senses: {
                    title: "Couleurs tracées par les cinq sens",
                    desc: "Fleurs de cerisier dansantes, silence de la neige, clair de lune. Des images et des mélodies fantastiques se superposent pour peindre des scènes que les mots seuls ne peuvent transmettre. Profitez d'une expérience immersive qui enveloppe doucement votre vue et votre ouïe."
                },
                heart: {
                    title: "Le Japon dans votre cœur",
                    desc: "Quittez l'agitation du quotidien pour le monde de Yūgen (grâce subtile). Le paysage dessiné par Shūka allume une lampe silencieuse dans le cœur des gens du monde entier. Le beau Japon, avec vous."
                }
            }
        },
        gallery: {
            title: "Galerie de clips musicaux",
            subtitle: "Profitez des clips disponibles sur YouTube au fil des saisons."
        },
        album: {
            title: "Album"
        },
        footer: {
            description: "Artiste musical tissant les quatre saisons",
            follow: "Suivre Shūka",
            copyright: "© 2025 Shūka. Tous droits réservés."
        }
    },
    "zh-TW": {
        nav: {
            home: "首頁",
            about: "關於",
            gallery: "畫廊",
            album: "專輯",
            season: {
                all: "全部",
                spring: "春",
                summer: "夏",
                autumn: "秋",
                winter: "冬",
                other: "其他"
            },
            effects: "飄落特效"
        },
        hero: {
            tagline: "編織四季的音樂藝術家",
            subtitle: "日本情感與現代聲音共鳴的全新音樂體驗。",
            cta: {
                gallery: "查看畫廊",
                about: "關於藝術家"
            }
        },
        about: {
            title: "關於 Shūka",
            intro: "超越時空，在心中迴響的「和」之記憶。<br>四季的變遷，寂靜之美，古老的傳統。<br>Shūka 是一個以現代感性編織這些元素，紡織出全新日本世界觀的企劃。",
            features: {
                wa: {
                    title: "演奏和諧",
                    desc: "自古傳承的日本美學。我們在此刻表現那脆弱而強大的氣息。不變的「和」之心將靜靜地撼動您的感性。"
                },
                senses: {
                    title: "五感描繪的色彩",
                    desc: "飛舞的櫻花，雪的寂靜，月光。夢幻般的影像與旋律重疊，描繪出單靠言語無法傳達的情景。請享受溫柔包圍視覺與聽覺的沉浸式體驗。"
                },
                heart: {
                    title: "心中的日本",
                    desc: "遠離日常的喧囂，前往幽玄的世界。Shūka 描繪的景色在世界各地人們的心中點亮一盞靜謐的燈。美麗的日本，與您同在。"
                }
            }
        },
        gallery: {
            title: "音樂影片畫廊",
            subtitle: "隨著季節欣賞 YouTube 上公開的 MV。"
        },
        album: {
            title: "專輯"
        },
        footer: {
            description: "編織四季的音樂藝術家",
            follow: "追蹤 Shūka",
            copyright: "© 2025 Shūka. All rights reserved."
        }
    },
    es: {
        nav: {
            home: "Inicio",
            about: "Acerca de",
            gallery: "Galería",
            album: "Álbum",
            season: {
                all: "Todo",
                spring: "Primavera",
                summer: "Verano",
                autumn: "Otoño",
                winter: "Invierno",
                other: "Otro"
            },
            effects: "Efectos de caída"
        },
        hero: {
            tagline: "Artista musical que teje las cuatro estaciones",
            subtitle: "Una nueva experiencia musical donde la emoción japonesa se encuentra con el sonido moderno.",
            cta: {
                gallery: "Ver galería",
                about: "Sobre el artista"
            }
        },
        about: {
            title: "Acerca de Shūka",
            intro: "Recuerdos de \"Wa\" (Armonía) que trascienden el tiempo y resuenan en el corazón.<br>Las estaciones cambiantes, la belleza del silencio, las tradiciones antiguas.<br>Shūka es un proyecto que teje estos elementos con sensibilidad moderna para crear una nueva visión del mundo de Japón.",
            features: {
                wa: {
                    title: "Tocando la Armonía",
                    desc: "Estética japonesa heredada de tiempos antiguos. Expresamos ese aliento frágil pero poderoso aquí y ahora. El corazón inmutable de \"Wa\" sacudirá silenciosamente tu sensibilidad."
                },
                senses: {
                    title: "Colores trazados por los cinco sentidos",
                    desc: "Cerezos danzantes, silencio de la nieve, luz de luna. Imágenes y melodías fantásticas se superponen para pintar escenas que no se pueden transmitir solo con palabras. Disfruta de una experiencia inmersiva que envuelve suavemente tu visión y oído."
                },
                heart: {
                    title: "Japón en tu corazón",
                    desc: "Deja el ajetreo de la vida cotidiana y ve al mundo de Yūgen (gracia sutil). El paisaje dibujado por Shūka enciende una lámpara tranquila en los corazones de las personas de todo el mundo. Hermoso Japón, contigo."
                }
            }
        },
        gallery: {
            title: "Galería de videos musicales",
            subtitle: "Disfruta de los MV disponibles en YouTube junto con las estaciones."
        },
        album: {
            title: "Álbum"
        },
        footer: {
            description: "Artista musical que teje las cuatro estaciones",
            follow: "Seguir a Shūka",
            copyright: "© 2025 Shūka. Todos los derechos reservados."
        }
    },
    pt: {
        nav: {
            home: "Início",
            about: "Sobre",
            gallery: "Galeria",
            album: "Álbum",
            season: {
                all: "Tudo",
                spring: "Primavera",
                summer: "Verão",
                autumn: "Outono",
                winter: "Inverno",
                other: "Outro"
            },
            effects: "Efeitos de queda"
        },
        hero: {
            tagline: "Artista musical tecendo as quatro estações",
            subtitle: "Uma nova experiência musical onde a emoção japonesa encontra o som moderno.",
            cta: {
                gallery: "Ver galeria",
                about: "Sobre o artista"
            }
        },
        about: {
            title: "Sobre Shūka",
            intro: "Memórias de \"Wa\" (Harmonia) que transcendem o tempo e ressoam no coração.<br>As estações em mudança, a beleza do silêncio, tradições antigas.<br>Shūka é um projeto que tece esses elementos com sensibilidade moderna para criar uma nova visão de mundo do Japão.",
            features: {
                wa: {
                    title: "Tocando Harmonia",
                    desc: "Estética japonesa herdada de tempos antigos. Expressamos esse fôlego frágil, mas poderoso, aqui e agora. O coração imutável de \"Wa\" agitará silenciosamente sua sensibilidade."
                },
                senses: {
                    title: "Cores traçadas pelos cinco sentidos",
                    desc: "Flores de cerejeira dançantes, silêncio da neve, luar. Imagens e melodias fantásticas se sobrepõem para pintar cenas que não podem ser transmitidas apenas por palavras. Desfrute de uma experiência imersiva que envolve suavemente sua visão e audição."
                },
                heart: {
                    title: "Japão em seu coração",
                    desc: "Deixe a agitação da vida cotidiana e vá para o mundo de Yūgen (graça sutil). A paisagem desenhada por Shūka acende uma lâmpada tranquila nos corações das pessoas em todo o mundo. Lindo Japão, com você."
                }
            }
        },
        gallery: {
            title: "Galeria de vídeos musicais",
            subtitle: "Aproveite os MVs disponíveis no YouTube junto com as estações."
        },
        album: {
            title: "Álbum"
        },
        footer: {
            description: "Artista musical tecendo as quatro estações",
            follow: "Siga Shūka",
            copyright: "© 2025 Shūka. Todos os direitos reservados."
        }
    },
    id: {
        nav: {
            home: "Beranda",
            about: "Tentang",
            gallery: "Galeri",
            album: "Album",
            season: {
                all: "Semua",
                spring: "Musim Semi",
                summer: "Musim Panas",
                autumn: "Musim Gugur",
                winter: "Musim Dingin",
                other: "Lainnya"
            },
            effects: "Efek Jatuh"
        },
        hero: {
            tagline: "Artis Musik yang Menenun Empat Musim",
            subtitle: "Pengalaman musik baru di mana emosi Jepang bertemu dengan suara modern.",
            cta: {
                gallery: "Lihat Galeri",
                about: "Tentang Artis"
            }
        },
        about: {
            title: "Tentang Shūka",
            intro: "Kenangan akan \"Wa\" (Harmoni) yang melampaui waktu dan bergema di hati.<br>Pergantian musim, keindahan keheningan, tradisi kuno.<br>Shūka adalah proyek yang menenun semua ini dengan sensibilitas modern untuk memutar pandangan dunia baru tentang Jepang.",
            features: {
                wa: {
                    title: "Memainkan Harmoni",
                    desc: "Estetika Jepang yang diwarisi dari zaman kuno. Kami mengekspresikan nafas yang rapuh namun kuat itu di sini dan saat ini. Hati \"Wa\" yang tidak berubah akan diam-diam menggetarkan kepekaan Anda."
                },
                senses: {
                    title: "Warna yang Ditelusuri oleh Lima Indra",
                    desc: "Bunga sakura yang menari, keheningan salju, cahaya bulan. Gambar dan melodi yang fantastis tumpang tindih untuk melukis pemandangan yang tidak dapat disampaikan dengan kata-kata saja. Nikmati pengalaman mendalam yang dengan lembut membungkus penglihatan dan pendengaran Anda."
                },
                heart: {
                    title: "Jepang di Hati Anda",
                    desc: "Tinggalkan hiruk-pikuk kehidupan sehari-hari dan pergi ke dunia Yūgen (keanggunan halus). Pemandangan yang digambar oleh Shūka menyalakan lampu yang tenang di hati orang-orang di seluruh dunia. Jepang yang indah, bersama Anda."
                }
            }
        },
        gallery: {
            title: "Galeri Video Musik",
            subtitle: "Nikmati MV yang tersedia di YouTube seiring dengan musim."
        },
        album: {
            title: "Album"
        },
        footer: {
            description: "Artis Musik yang Menenun Empat Musim",
            follow: "Ikuti Shūka",
            copyright: "© 2025 Shūka. Hak cipta dilindungi undang-undang."
        }
    }
};

class I18n {
    constructor() {
        this.currentLang = 'ja'; // Default language
        this.translations = translations;
        this.supportedLangs = ['ja', 'en', 'fr', 'zh-TW', 'es', 'pt', 'id'];
    }

    init() {
        // Check localStorage or browser preference
        const savedLang = localStorage.getItem('shuka_lang');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        } else {
            // Detect browser language
            const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();

            // Handle specific cases like zh-TW
            if (browserLang === 'zh-tw' || browserLang === 'zh-hk') {
                this.currentLang = 'zh-TW';
            } else {
                // For other languages, check the primary language code
                const primaryLang = browserLang.split('-')[0];
                if (this.supportedLangs.includes(primaryLang)) {
                    this.currentLang = primaryLang;
                } else {
                    // Default to English for unsupported languages, unless it's Japanese
                    this.currentLang = primaryLang === 'ja' ? 'ja' : 'en';
                }
            }
        }

        this.updateDOM();
        this.updateLangAttribute();
    }

    setLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) return;
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
        // Note: The UI structure will change to a dropdown, so this might need adjustment in main.js or here
        // For now, we'll keep a generic active class toggle for any element with data-lang matching current
        document.querySelectorAll('[data-lang]').forEach(el => {
            if (el.dataset.lang === this.currentLang) {
                el.classList.add('active');
                el.setAttribute('aria-selected', 'true');
            } else {
                el.classList.remove('active');
                el.setAttribute('aria-selected', 'false');
            }
        });

        // Update dropdown trigger text if it exists
        const langTriggerText = document.querySelector('.lang-dropdown-trigger .current-lang-text');
        if (langTriggerText) {
            const langNames = {
                ja: '日本語',
                en: 'English',
                fr: 'Français',
                'zh-TW': '繁體中文',
                es: 'Español',
                pt: 'Português',
                id: 'Bahasa Indonesia'
            };
            langTriggerText.textContent = langNames[this.currentLang] || langNames.en;
        }
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
