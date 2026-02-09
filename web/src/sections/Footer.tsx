export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <span class="footer__wordmark">mukoko</span>
          <p class="text-muted mt-1">A digital twin social ecosystem for Africa</p>
        </div>

        <div class="footer__links">
          <div class="footer__column">
            <h4>Ecosystem</h4>
            <ul>
              <li><a href="https://clips.mukoko.com">Clips</a></li>
              <li><a href="https://connect.mukoko.com">Connect</a></li>
              <li><a href="https://novels.mukoko.com">Novels</a></li>
              <li><a href="https://events.mukoko.com">Events</a></li>
              <li><a href="https://weather.mukoko.com">Weather</a></li>
            </ul>
          </div>
          <div class="footer__column">
            <h4>Company</h4>
            <ul>
              <li><a href="https://nyuchi.com">Nyuchi Africa</a></li>
              <li><a href="mailto:hello@mukoko.com">Contact</a></li>
            </ul>
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
