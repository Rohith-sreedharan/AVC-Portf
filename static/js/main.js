document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
  document.body.style.position = 'static';

  // HEADER NAV IN MOBILE
  const sidebar = document.querySelector(".ul-sidebar");
  const opener = document.querySelector(".ul-header-sidebar-opener");
  const closer = document.querySelector(".ul-sidebar-closer");
  const mobileMenuContent = document.querySelector(".to-go-to-sidebar-in-mobile");
  const headerNavMobileWrapper = document.querySelector(".ul-sidebar-header-nav-wrapper");
  const headerNavOgWrapper = document.querySelector(".ul-header-nav-wrapper");

  function updateMenuPosition() {
    if (!mobileMenuContent || !headerNavMobileWrapper || !headerNavOgWrapper) return;
    if (window.innerWidth < 992) {
      if (!headerNavMobileWrapper.contains(mobileMenuContent)) {
        headerNavMobileWrapper.appendChild(mobileMenuContent);
      }
    } else {
      if (!headerNavOgWrapper.contains(mobileMenuContent)) {
        headerNavOgWrapper.appendChild(mobileMenuContent);
      }
    }
  }
  updateMenuPosition();
  window.addEventListener("resize", updateMenuPosition);

  if (opener && sidebar) opener.addEventListener("click", () => sidebar.classList.add("active"));
  if (closer && sidebar) closer.addEventListener("click", () => sidebar.classList.remove("active"));

  // Menu dropdown/submenu in mobile
  const headerNavMobile = document.querySelector(".ul-header-nav");
  if (headerNavMobile) {
    const items = headerNavMobile.querySelectorAll(".has-sub-menu");
    items.forEach((item) => {
      if (window.innerWidth < 992) {
        item.addEventListener("click", () => item.classList.toggle("active"));
      }
    });
  }

  // Header search in mobile
  const searchOpener = document.querySelector(".ul-header-mobile-search-opener");
  const searchCloser = document.querySelector(".ul-header-mobile-search-closer");
  const searchFormWrapper = document.querySelector(".ul-header-search-form-wrapper");
  if (searchOpener && searchFormWrapper) searchOpener.addEventListener("click", () => searchFormWrapper.classList.add("active"));
  if (searchCloser && searchFormWrapper) searchCloser.addEventListener("click", () => searchFormWrapper.classList.remove("active"));

  // Header top Splide slider
  if (document.querySelector(".ul-header-top-slider") && typeof Splide !== 'undefined') {
    try {
      new Splide('.ul-header-top-slider', {
        arrows: false,
        pagination: false,
        type: 'loop',
        drag: 'free',
        focus: 'center',
        perPage: 9,
        autoWidth: true,
        gap: 15,
        autoScroll: { speed: 1.5 },
      }).mount(window.splide?.Extensions || {});
    } catch (e) { /* no-op */ }
  }

  // SlimSelect for search category (support both legacy and new IDs)
  let searchSelectSelector = null;
  if (document.getElementById('ul-header-search-category')) {
    searchSelectSelector = '#ul-header-search-category';
  } else if (document.getElementById('headerSearchCategory')) {
    searchSelectSelector = '#headerSearchCategory';
  }
  if (searchSelectSelector && typeof SlimSelect !== 'undefined') {
    new SlimSelect({
      select: searchSelectSelector,
      settings: { showSearch: false }
    });
  }

  // MixItUp filtering
  if (document.querySelector(".ul-filter-products-wrapper") && typeof mixitup !== 'undefined') {
    mixitup('.ul-filter-products-wrapper');
  }

  // Swiper sliders
  if (typeof Swiper !== 'undefined') {
    // Banner thumbs slider
    let bannerThumbSlider = null;
    if (document.querySelector(".ul-banner-img-slider")) {
      bannerThumbSlider = new Swiper(".ul-banner-img-slider", {
        slidesPerView: 1.4,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 15,
        breakpoints: {
          992: { spaceBetween: 15 },
          1680: { spaceBetween: 26 },
          1700: { spaceBetween: 30 },
        },
      });
    }

    // Main banner slider
    if (document.querySelector(".ul-banner-slider")) {
      new Swiper(".ul-banner-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 3000 },
        thumbs: bannerThumbSlider ? { swiper: bannerThumbSlider } : undefined,
        navigation: {
          nextEl: ".ul-banner-slider-nav .next",
          prevEl: ".ul-banner-slider-nav .prev",
        },
      });
    }

    // Product sliders
    if (document.querySelector(".ul-products-slider-1")) {
      new Swiper(".ul-products-slider-1", {
        slidesPerView: 3,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 15,
        navigation: { nextEl: ".ul-products-slider-1-nav .next", prevEl: ".ul-products-slider-1-nav .prev" },
        breakpoints: {
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { spaceBetween: 20 },
          1400: { spaceBetween: 22 },
          1600: { spaceBetween: 26 },
          1700: { spaceBetween: 30 },
        },
      });
    }

    if (document.querySelector(".ul-products-slider-2")) {
      new Swiper(".ul-products-slider-2", {
        slidesPerView: 3,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 15,
        navigation: { nextEl: ".ul-products-slider-2-nav .next", prevEl: ".ul-products-slider-2-nav .prev" },
        breakpoints: {
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { spaceBetween: 20 },
          1400: { spaceBetween: 22 },
          1600: { spaceBetween: 26 },
          1700: { spaceBetween: 30 },
        },
      });
    }

    if (document.querySelector(".ul-flash-sale-slider")) {
      new Swiper(".ul-flash-sale-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 15,
        breakpoints: {
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
          1200: { spaceBetween: 20, slidesPerView: 4 },
          1680: { spaceBetween: 26, slidesPerView: 4 },
          1700: { spaceBetween: 30, slidesPerView: 4.7 },
        },
      });
    }

    if (document.querySelector(".ul-reviews-slider")) {
      new Swiper(".ul-reviews-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 15,
        breakpoints: {
          768: { slidesPerView: 2 },
          992: { spaceBetween: 20, slidesPerView: 3 },
          1200: { spaceBetween: 20, slidesPerView: 4 },
          1680: { slidesPerView: 4, spaceBetween: 26 },
          1700: { slidesPerView: 4, spaceBetween: 30 },
        },
      });
    }

    if (document.querySelector(".ul-gallery-slider")) {
      new Swiper(".ul-gallery-slider", {
        slidesPerView: 2.2,
        loop: true,
        autoplay: { delay: 3000 },
        centeredSlides: true,
        spaceBetween: 15,
        breakpoints: {
          480: { slidesPerView: 3.4 },
          576: { slidesPerView: 4 },
          768: { slidesPerView: 5 },
          992: { spaceBetween: 20, slidesPerView: 5.5 },
          1680: { spaceBetween: 26, slidesPerView: 5.5 },
          1700: { spaceBetween: 30, slidesPerView: 5.5 },
          1920: { spaceBetween: 30, slidesPerView: 6, centeredSlides: false },
        },
      });
    }

    if (document.querySelector(".ul-sidebar-products-slider")) {
      new Swiper(".ul-sidebar-products-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 30,
        navigation: { nextEl: ".ul-sidebar-products-slider-nav .next", prevEl: ".ul-sidebar-products-slider-nav .prev" },
        breakpoints: { 1400: { slidesPerView: 2 } },
      });
    }

    if (document.querySelector(".ul-product-details-img-slider")) {
      new Swiper(".ul-product-details-img-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 3000 },
        spaceBetween: 0,
        navigation: { nextEl: "#ul-product-details-img-slider-nav .next", prevEl: "#ul-product-details-img-slider-nav .prev" },
      });
    }
  }

  // Product page price filter (noUiSlider)
  const priceFilterSlider = document.getElementById('ul-products-price-filter-slider');
  if (priceFilterSlider && typeof noUiSlider !== 'undefined') {
    noUiSlider.create(priceFilterSlider, {
      start: [20, 80],
      connect: true,
      range: { 'min': 0, 'max': 100 }
    });
  }

  // Quantity field
  if (document.querySelector(".ul-product-quantity-wrapper")) {
    const quantityWrappers = document.querySelectorAll(".ul-product-quantity-wrapper");
    quantityWrappers.forEach((item) => {
      const quantityInput = item.querySelector(".ul-product-quantity");
      const incBtn = item.querySelector(".quantityIncreaseButton");
      const decBtn = item.querySelector(".quantityDecreaseButton");
      if (incBtn && quantityInput) incBtn.addEventListener("click", () => quantityInput.value = parseInt(quantityInput.value || '0') + 1);
      if (decBtn && quantityInput) decBtn.addEventListener("click", () => {
        const current = parseInt(quantityInput.value || '1');
        if (current > 1) quantityInput.value = current - 1;
      });
    });
  }

  // Parallax effect
  const parallaxImage = document.querySelector(".ul-video-cover");
  if (parallaxImage) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", parallaxEffect);
          parallaxEffect();
        } else {
          window.removeEventListener("scroll", parallaxEffect);
        }
      });
    });
    observer.observe(parallaxImage);

    function parallaxEffect() {
      const rect = parallaxImage.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const imageCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const offset = (imageCenter - viewportCenter) * -0.5;
      parallaxImage.style.transform = `translateY(${offset}px)`;
    }
  }
});