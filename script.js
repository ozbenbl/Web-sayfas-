/**
 * ÖZBEN BÜLBÜL - PORTFOLYO VE STAJ VİTRİNİ
 * JavaScript Fonksiyonları & Etkileşim Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elemanları
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const copyBtnText = document.getElementById('copyBtnText');
  const channelCopyBtns = document.querySelectorAll('.channel-copy-btn');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const backToTop = document.getElementById('backToTop');

  const EMAIL_ADDRESS = 'ozbenbulbul@anadolu.edu.tr';

  /* -------------------------------------------------------------------------
     1. TOAST BİLDİRİM FONKSİYONU
     ------------------------------------------------------------------------- */
  let toastTimeout;
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  /* -------------------------------------------------------------------------
     2. MOBİL MENÜ YÖNETİMİ
     ------------------------------------------------------------------------- */
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Menü bağlantılarına tıklandığında mobil menüyü kapat
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------------------------
     3. NAVBAR SCROLL VE SCROLLSPY (AKTİF BAĞLANTI İŞARETLEME)
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar arkaplan opaklığı
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy: Hangi bölümdeyiz?
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Sayfa yüklendiğinde bir kez çalıştır

  /* -------------------------------------------------------------------------
     4. E-POSTA KOPYALAMA İŞLEVİ (1-Click Copy)
     ------------------------------------------------------------------------- */
  async function copyToClipboard(text, successMsg = 'E-posta panoya kopyalandı!') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback mekanizması
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      showToast(successMsg);
      return true;
    } catch (err) {
      console.error('Kopyalama hatası:', err);
      showToast('Kopyalama başarısız oldu, lütfen manuel kopyalayın.');
      return false;
    }
  }

  // Hakkımda kartındaki kopyala butonu
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', async () => {
      const success = await copyToClipboard(EMAIL_ADDRESS, 'ozbenbulbul@anadolu.edu.tr panoya kopyalandı!');
      if (success && copyBtnText) {
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'Kopyalandı! ✓';
        setTimeout(() => {
          copyBtnText.textContent = originalText;
        }, 2500);
      }
    });
  }

  // İletişim bölümündeki kanal kopyalama butonları
  channelCopyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy') || EMAIL_ADDRESS;
      copyToClipboard(textToCopy, `${textToCopy} panoya kopyalandı!`);
    });
  });

  /* -------------------------------------------------------------------------
     5. PROJE KATEGORİ FİLTRELEME
     ------------------------------------------------------------------------- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktif buton stilini güncelle
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
     6. İLETİŞİM FORMU YÖNETİMİ
     ------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('nameInput')?.value.trim();
      const email = document.getElementById('emailInput')?.value.trim();
      const subject = document.getElementById('subjectInput')?.value.trim();
      const message = document.getElementById('messageInput')?.value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Lütfen tüm zorunlu alanları eksiksiz doldurun.');
        return;
      }

      // E-posta istemcisini açacak mailto linki oluştur
      const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(`[Portfolyo İletişim] ${subject}`)}&body=${encodeURIComponent(`Ad Soyad: ${name}\nGönderen E-posta: ${email}\n\nMesaj:\n${message}`)}`;

      showToast('E-posta istemciniz hazırlanıyor...');
      
      // Formu sıfırla
      contactForm.reset();

      // Kısa bir gecikmeyle istemciyi tetikle
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 700);
    });
  }

  /* -------------------------------------------------------------------------
     7. YUKARI DÖN (BACK TO TOP) BUTONU
     ------------------------------------------------------------------------- */
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Konsol bilgilendirme mesajı (Hoca veya geliştirici incelemesi için)
  console.log(
    '%c Özben Bülbül | Portfolyo & Staj Vitrini %c\n' +
    'Anadolu Üniversitesi Büyük Veri Analistliği & Bilgisayar Programcılığı\n' +
    'E-posta: ozbenbulbul@anadolu.edu.tr\n' +
    'LinkedIn: https://www.linkedin.com/in/özben-bülbül-02bb73387/',
    'background: #ff2d75; color: #fff; font-weight: bold; padding: 6px 12px; border-radius: 4px;',
    'color: #ff85ab;'
  );
});
