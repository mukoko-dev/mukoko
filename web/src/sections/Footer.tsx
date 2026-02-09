export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__brand">
            <span class="footer__wordmark">mukoko</span>
            <p class="text-muted mt-1">A Nyuchi Africa product</p>
          </div>

          <div class="footer__links">
            <a href="#apps">Apps</a>
            <a href="#privacy">Privacy</a>
            <a href="#how-it-works">How It Works</a>
            <a href="mailto:hello@mukoko.com">Contact</a>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="text-muted">
            &copy; {year} Nyuchi Africa. All rights reserved.
          </p>
          <p class="footer__motto text-muted">
            Ndiri nekuti tiri — I am because we are.
          </p>
        </div>
      </div>
    </footer>
  );
}
