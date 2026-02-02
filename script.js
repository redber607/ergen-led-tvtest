document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Product & Category Management Logic ---
    let allProducts = [];
    let allCategories = [];

    const fetchData = async () => {
        try {
            const [pRes, cRes] = await Promise.all([
                fetch('products.json'),
                fetch('categories.json')
            ]);
            allProducts = await pRes.json();
            allCategories = await cRes.json();
        } catch (error) {
            console.warn('Sunucudan veri çekilemedi (Muhtemelen yerel dosya erişimi), yerleşik veriler yükleniyor.');

            // FALLBACK DATA for local file preview (CORS restriction workaround)
            allCategories = [
                { "id": "anakart", "name": "Anakart" },
                { "id": "besleme", "name": "Besleme" },
                { "id": "tcon", "name": "T-Con" },
                { "id": "muhtelif", "name": "Muhtelif" }
            ];

            allProducts = [
                { "id": 1, "name": "LG 42\" Led Bar Takımı", "category": "muhtelif", "price": "850.00", "image": "assets/images/products/led_bar.png", "featured": true },
                { "id": 2, "name": "Samsung UE55 Anakart", "category": "anakart", "price": "2450.00", "image": "assets/images/products/mainboard.png", "featured": true },
                { "id": 3, "name": "Vestel 17IPS Besleme Kartı", "category": "besleme", "price": "750.00", "image": "assets/images/products/power_board.png", "featured": true },
                { "id": 4, "name": "LG 42\" Smart Anakart", "category": "anakart", "price": "1850.00", "image": "assets/images/products/mainboard.png", "featured": false },
                { "id": 5, "name": "Philips 50\" PSU Kart", "category": "besleme", "price": "950.00", "image": "assets/images/products/power_board.png", "featured": false },
                { "id": 6, "name": "AUO T-Con Modül", "category": "tcon", "price": "450.00", "image": "assets/images/products/mainboard.png", "featured": false }
            ];
        } finally {
            renderCategories();
            renderInitial();
        }
    };

    const getCategoryIcon = (id) => {
        const icons = {
            'anakart': 'fa-microchip',
            'besleme': 'fa-bolt',
            'tcon': 'fa-tv',
            'muhtelif': 'fa-box'
        };
        return icons[id] || 'fa-tag';
    };

    const renderCategories = () => {
        // 1. Products Page Filter Buttons
        const filterContainer = document.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.innerHTML = `
                <button class="filter-btn active" data-filter="all">Tümü</button>
                ${allCategories.map(c => `<button class="filter-btn" data-filter="${c.id}">${c.name}</button>`).join('')}
            `;
        }

        // 2. Homepage Category Grid
        const homeCategoryGrid = document.getElementById('homeCategoryGrid');
        if (homeCategoryGrid) {
            homeCategoryGrid.innerHTML = allCategories.slice(0, 4).map(c => `
                <a href="products.html?filter=${c.id}" class="card service-card">
                    <i class="fas ${getCategoryIcon(c.id)}" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem;"></i>
                    <h3>${c.name}</h3>
                    <p style="color: var(--text-secondary);">En kaliteli ${c.name} parçaları için tıklayın.</p>
                </a>
            `).join('');
        }
    };

    const renderPrice = (price) => {
        return `₺${parseFloat(price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    };

    const createProductCard = (product, isFeatured = false) => {
        const categoryLabel = allCategories.find(c => c.id === product.category)?.name || product.category;

        if (isFeatured) {
            return `
                <a href="product-detail.html?id=${product.id}" class="card product-link-card">
                    <img src="${product.image}" alt="${product.name}" class="card-img">
                    <div class="card-content">
                        <span class="card-category text-uppercase">${categoryLabel}</span>
                        <h3 class="card-title">${product.name}</h3>
                        <div class="card-footer">
                            <span class="price">${renderPrice(product.price)}</span>
                            <span class="btn-detail">Detay</span>
                        </div>
                    </div>
                </a>
            `;
        } else {
            return `
                <div class="card product-card" data-category="${product.category}">
                    <a href="product-detail.html?id=${product.id}" style="text-decoration: none; color: inherit; display: block;">
                        <img src="${product.image}" alt="${product.name}" class="card-img">
                        <div class="card-content">
                            <span class="card-category">${categoryLabel}</span>
                            <h3 class="card-title">${product.name}</h3>
                            <p class="price">${renderPrice(product.price)}</p>
                        </div>
                    </a>
                    <div class="card-content" style="padding-top: 0;">
                        <a href="https://wa.me/905000000000?text=${encodeURIComponent(product.name + ' hakkında bilgi almak istiyorum')}" 
                           class="btn-primary btn-block">Sipariş Ver</a>
                    </div>
                </div>
            `;
        }
    };

    const renderProductDetail = (product, container) => {
        const categoryLabel = allCategories.find(c => c.id === product.category)?.name || product.category;

        container.innerHTML = `
            <a href="products.html" class="back-link"><i class="fas fa-arrow-left"></i> Ürünlere Dön</a>
            <div class="product-detail-container">
                <div class="product-image-large">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info-panel">
                    <div class="product-meta">
                        <span class="meta-tag">${categoryLabel}</span>
                        <span class="meta-tag" style="background: rgba(255,59,48,0.1); color: var(--primary-red); border-color: rgba(255,59,48,0.2);">
                            Stokta Var
                        </span>
                    </div>
                    <h1>${product.name}</h1>
                    <p class="product-description">${product.description || 'Bu ürün hakkında detaylı bilgi için lütfen bizimle iletişime geçin.'}</p>
                    <span class="price-large">${renderPrice(product.price)}</span>
                    <div class="action-buttons">
                        <a href="https://wa.me/905000000000?text=${encodeURIComponent(product.name + ' hakkında bilgi almak istiyorum')}" 
                           class="btn-primary" style="padding: 1rem 2rem; flex: 1; text-align: center;">
                           <i class="fab fa-whatsapp"></i> Hemen Sipariş Ver
                        </a>
                        <a href="contact.html" class="btn-primary" style="background: transparent; border: 1px solid var(--accent-gold); color: var(--accent-gold); padding: 1rem 2rem;">
                            Bize Ulaşın
                        </a>
                    </div>
                    <div style="margin-top: 3rem; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px dashed rgba(255,215,0,0.3);">
                         <h4 style="margin-bottom: 1rem; color: var(--accent-gold);"><i class="fas fa-shield-alt"></i> Ergen Elektronik Güvencesi</h4>
                         <p style="font-size: 0.9rem; color: var(--text-secondary);">Tüm ürünlerimiz test edilmiş ve garantilidir. Aynı gün kargo imkanı ile Türkiye'nin her yerine gönderim sağlıyoruz.</p>
                    </div>
                </div>
            </div>
        `;
    };

    const renderInitial = () => {
        const featuredContainer = document.getElementById('featuredGrid');
        const productsContainer = document.getElementById('productsGrid');
        const detailContainer = document.getElementById('productDetailContent');

        if (featuredContainer) {
            const featured = allProducts.filter(p => p.featured).slice(0, 3);
            featuredContainer.innerHTML = featured.map(p => createProductCard(p, true)).join('');
        }

        if (productsContainer) {
            productsContainer.innerHTML = allProducts.map(p => createProductCard(p, false)).join('');

            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');
            const categoryFilter = urlParams.get('filter');

            if (searchQuery) {
                filterProducts(searchQuery.toLowerCase(), true);
                const heroTitle = document.querySelector('.hero-content h1');
                if (heroTitle) heroTitle.innerHTML = `Arama Sonuçları: "<span style="color:var(--accent-gold)">${searchQuery}</span>"`;
            } else if (categoryFilter) {
                filterProducts(categoryFilter, false);
                const filterButtons = document.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-filter') === categoryFilter) btn.classList.add('active');
                    else btn.classList.remove('active');
                });
            }
        }

        if (detailContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            const product = allProducts.find(p => p.id === productId);

            if (product) {
                renderProductDetail(product, detailContainer);
            } else {
                detailContainer.innerHTML = `
                    <div style="padding: 10rem 0; text-align: center;">
                        <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 1rem;"></i>
                        <h2>Ürün Bulunamadı</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Aradığınız ürün stoklarımızda kalmamış veya kaldırılmış olabilir.</p>
                        <a href="products.html" class="btn-primary" style="display: inline-block; padding: 0.8rem 2rem;">Tüm Ürünlere Dön</a>
                    </div>
                `;
            }
        }
    };

    const filterProducts = (filterValue, isSearch = false) => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            let shouldShow = false;
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();

            if (isSearch) {
                if (title.includes(filterValue) || category.includes(filterValue)) shouldShow = true;
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) shouldShow = true;
            }
            card.style.display = shouldShow ? 'block' : 'none';
        });
    };

    // --- Event Listeners ---
    fetchData();

    const homeSearchBtn = document.getElementById('homeSearchBtn');
    const homeSearchInput = document.getElementById('homeSearchInput');

    if (homeSearchBtn && homeSearchInput) {
        const doSearch = () => {
            const query = homeSearchInput.value.trim();
            if (query) {
                if (window.location.pathname.includes('products.html')) {
                    filterProducts(query.toLowerCase(), true);
                    const heroTitle = document.querySelector('.hero-content h1');
                    if (heroTitle) heroTitle.innerHTML = `Arama Sonuçları: "<span style="color:var(--accent-gold)">${query}</span>"`;
                } else {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        };
        homeSearchBtn.addEventListener('click', doSearch);
        homeSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const btn = e.target;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.getAttribute('data-filter'), false);
        }
    });

    // Cookie Consent Logic
    const cookiePopup = document.getElementById('cookiePopup');
    if (cookiePopup && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookiePopup.classList.add('show'), 1000);
    }

    document.getElementById('acceptCookies')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookiePopup.classList.remove('show');
    });

    document.getElementById('rejectCookies')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        cookiePopup.classList.remove('show');
    });

    document.querySelector('#footerCookieLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        cookiePopup.classList.add('show');
    });
});
