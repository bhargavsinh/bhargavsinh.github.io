document.addEventListener("DOMContentLoaded", function() {
    
    // ૧. Header લોડ કરવું
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
        fetch("header.html")
            .then(response => {
                if (!response.ok) throw new Error("Header ફાઇલ મળી નથી");
                return response.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
                
                // Header લોડ થઈ ગયા પછી જ મેનુ ફંક્શન ચાલુ કરવું
                setupMobileMenu();
            })
            .catch(error => console.error("Header લોડ કરવામાં ભૂલ આવી:", error));
    }

    // ૨. Footer લોડ કરવું (માત્ર એક જ વાર)
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        fetch("footer.html")
            .then(response => {
                if (!response.ok) throw new Error("Footer ફાઇલ મળી નથી");
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error("Footer લોડ કરવામાં ભૂલ આવી:", error));
    }
});

// Hamburger મેનુ ઓપન/ક્લોઝ કરવાનું ફંક્શન
function setupMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", function() {
            // 'active' ક્લાસ ઉમેરશે અથવા હટાવશે
            navbar.classList.toggle("active");
            
            // બટનનો આઇકોન બદલવા માટે (☰ થી ✕)
            if (navbar.classList.contains("active")) {
                menuToggle.innerHTML = "✕";
            } else {
                menuToggle.innerHTML = "☰";
            }
        });
    }
}
// ૧. સૌથી પહેલા navbar અને menuToggle ને સિલેક્ટ કરો
const navbar = document.getElementById('navbar') || document.querySelector('nav');
const menuToggle = document.getElementById('menu-toggle'); // તમારા હેમ્બર્ગર બટનનો ID

// ૨. સુરક્ષિત રીતે ચેક કરો કે જો બંને એલિમેન્ટ હાજર હોય તો જ કોડ રન થાય
if (navbar && menuToggle) {
    if (navbar.classList.contains("active")) {
        menuToggle.innerHTML = "✕"; // મેનૂ ખુલવા પર ક્લોઝ આઇકન
    } else {
        menuToggle.innerHTML = "☰"; // મેનૂ બંધ હોય ત્યારે હેમ્બર્ગર આઇકન
    }
}


// 1. Right Click (કોન્ટેક્સ્ટ મેનૂ) ડિસેબલ કરવું
document.addEventListener('contextmenu', (e) => e.preventDefault());

// 2. Text Copy, Cut, અને Drag ડિસેબલ કરવું
document.addEventListener('copy', (e) => e.preventDefault());
document.addEventListener('cut', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());

// 3. શોર્ટકટ્સ બંધ કરવા (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+C)
document.addEventListener('keydown', (e) => {
  // F12 key
  if (e.key === 'F12') e.preventDefault();

  // Ctrl+U (View Source)
  if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) e.preventDefault();

  // Ctrl+C (Copy)
  if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) e.preventDefault();

  // Ctrl+Shift+I / J / C (DevTools)
  if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
    e.preventDefault();
  }
});

// ૧. રાઈટ-ક્લિક (Right Click) બંધ કરવું
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

// ૨. ટેક્સ્ટ કોપી (Ctrl+C, Cut) અટકાવવું
document.addEventListener('copy', function (e) {
  e.preventDefault();
});
document.addEventListener('cut', function (e) {
  e.preventDefault();
});

// ૩. ડેવલપર ટૂલ્સ અને સોર્સ કોડના શોર્ટકટ્સ બંધ કરવા
document.addEventListener('keydown', function (e) {
  // F12 key (DevTools)
  if (e.keyCode === 123) {
    e.preventDefault();
  }
  // Ctrl + Shift + I (Inspect) અથવા Ctrl + Shift + J (Console) અથવા Ctrl + Shift + C
  if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
    e.preventDefault();
  }
  // Ctrl + U (View Source Code)
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault();
  }
  // Ctrl + C (Copy shortcut)
  if (e.ctrlKey && e.keyCode === 67) {
    e.preventDefault();
  }
});

/* ============================================
   HEADER v2 — add to the bottom of script.js
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    if (menuToggle && navbar) {
        const closeMenu = () => {
            navbar.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };
        const openMenu = () => {
            navbar.classList.add('is-open');
            menuToggle.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navbar.classList.contains('is-open');
            isOpen ? closeMenu() : openMenu();
        });

        // close the mobile menu after a link is tapped
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) closeMenu();
            });
        });

        // close on Escape, and on outside click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) closeMenu();
        });

        // reset state when resizing across the mobile/desktop breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) closeMenu();
        });
    }

    // shrink the header once the page scrolls
    if (header) {
        const onScroll = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});
/* ============================================
   SEARCH FUNCTIONALITY (Static JS Search)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Header Load થયા પછી Search Elements મેળવવા માટે setTimeout નો ઉપયોગ
    setTimeout(() => {
        const searchBtn = document.getElementById('search-btn');
        const searchModal = document.getElementById('search-modal');
        const closeSearch = document.getElementById('close-search');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const searchBoxContainer = document.getElementById('search-box-container');

        // વેબસાઈટનો ડેટા (અહીં તમે પેજ અને તેના કીવર્ડ્સ ઉમેરી શકો છો)
        const siteData = [
            { title: "Home Page (મુખ્ય પૃષ્ઠ)", url: "index.html", keywords: "home, main, ભાર્ગવસિંહ, bhargavsinh, sisodiya, રાજપૂત" },
            { title: "About Me (મારા વિશે)", url: "about.html", keywords: "about, bio, pushtimarg, maharana pratap, puranmalji, શુદ્ધાદ્વૈત, મેવાડ, heritage" },
            { title: "Resume / CV (બાયોડેટા)", url: "resume.html", keywords: "resume, cv, education, skills, bca, college, mahisagar, birth, બાયોડેટા, computer, gpsc" },
            { title: "Articles & Blogs (લેખ અને બ્લોગ)", url: "blog.html", keywords: "blog, articles, લેખ, pushtimarg gruh seva, mewar history, સૂર્યવંશ, સિસોદિયા કુળ" },
            { title: "Genealogy (વંશાવલી)", url: "vanshavali.html", keywords: "vanshavali, genealogy, history, family tree, મેવાડ, સિસોદિયા, ઇતિહાસ, ગુહિલોત" },
            { title: "Contact Us (સંપર્ક કરો)", url: "contact.html", keywords: "contact, email, whatsapp, address, appointment, સંપર્ક, એપોઇન્ટમેન્ટ, anand vihar bhavan" },
            { title: "Projects (પ્રોજેક્ટ્સ)", url: "projects.html", keywords: "projects, work, development, coding, github, bharblock, script, lipi" }
        ];

        if (searchBtn && searchModal && closeSearch) {
            
            // સર્ચ ઓપન કરવા માટે
            const openSearchModal = () => {
                searchModal.classList.remove('hidden');
                searchModal.classList.add('flex');
                // એનિમેશન માટે થોડો સમય આપીને ક્લાસ એડ કરવો
                setTimeout(() => {
                    searchModal.classList.remove('opacity-0');
                    searchBoxContainer.classList.remove('scale-95');
                    searchBoxContainer.classList.add('scale-100');
                    searchInput.focus();
                }, 10);
            };

            // સર્ચ બંધ કરવા માટે
            const closeSearchModal = () => {
                searchModal.classList.add('opacity-0');
                searchBoxContainer.classList.remove('scale-100');
                searchBoxContainer.classList.add('scale-95');
                setTimeout(() => {
                    searchModal.classList.add('hidden');
                    searchModal.classList.remove('flex');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                    searchResults.classList.add('hidden');
                }, 300);
            };

            searchBtn.addEventListener('click', openSearchModal);
            closeSearch.addEventListener('click', closeSearchModal);
            
            // બહાર ક્લિક કરવાથી પૉપઅપ બંધ થાય
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal) closeSearchModal();
            });

            // Escape કી દબાવવાથી બંધ થાય
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
                    closeSearchModal();
                }
            });

            // સર્ચ લોજીક (Search Logic)
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                searchResults.innerHTML = ''; // જૂના પરિણામો દૂર કરવા

                if (query.length > 0) {
                    // ડેટા ફિલ્ટર કરો (Title અથવા Keyword મેચ થવા જોઈએ)
                    const filteredData = siteData.filter(item => 
                        item.title.toLowerCase().includes(query) || 
                        item.keywords.toLowerCase().includes(query)
                    );

                    searchResults.classList.remove('hidden');

                    if (filteredData.length > 0) {
                        filteredData.forEach(item => {
                            const resultItem = document.createElement('a');
                            resultItem.href = item.url;
                            resultItem.className = "block p-4 border-b border-amber-900/30 hover:bg-amber-900/30 transition-colors rounded-xl group mx-2 my-1";
                            resultItem.innerHTML = `
                                <div class="flex items-center gap-3">
                                    <span class="text-xl text-amber-500/50 group-hover:text-amber-400 transition-colors">📄</span>
                                    <div>
                                        <h4 class="text-amber-300 font-bold text-lg group-hover:text-amber-200 transition-colors">${item.title}</h4>
                                        <span class="text-xs text-amber-500/60 block mt-0.5">${item.url}</span>
                                    </div>
                                </div>
                            `;
                            searchResults.appendChild(resultItem);
                        });
                    } else {
                        searchResults.innerHTML = `
                            <div class="p-8 text-center flex flex-col items-center">
                                <span class="text-4xl mb-3 opacity-50">📂</span>
                                <p class="text-amber-200/80 font-medium">"${e.target.value}" માટે કોઈ પરિણામ મળ્યું નથી.</p>
                                <p class="text-sm text-amber-500/60 mt-1">કૃપા કરીને અન્ય શબ્દ દાખલ કરો.</p>
                            </div>
                        `;
                    }
                } else {
                    searchResults.classList.add('hidden');
                }
            });
        }
    }, 500); // 500ms ડીલે જેથી Header સંપૂર્ણપણે લોડ થઈ જાય
});
