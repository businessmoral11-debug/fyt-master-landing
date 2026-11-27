# WordPress promo files (loaded by the "FYT Loader" WPCode snippet)

- promo-bar.html  -> the promo bar on every WordPress page
- cart-picker.html -> the plan picker on the Cart page ([fyt_block slug="cart-picker"])

Served at https://fundingyourtrades.com/wp-content/react-home/wp-promo/<file>.
Edit here and push to main: WordPress picks up the change within about 2 minutes. No pasting in WordPress.

## 24-hour flash sale ("Black Friday Upgraded")

Each visitor gets their own 24 hours at 60% from their first visit. To switch it between test and live, the mode is set in four places and all four must match:

- `src/app/data/flash.ts` -> `FLASH_MODE` (home page)
- `public/wp-promo/promo-bar.html` -> `FLASH_MODE` (bar on every WordPress page)
- `public/wp-promo/cart-picker.html` -> `FLASH_MODE` (Cart page picker)
- WPCode checkout snippet -> `FYT_CO_FLASH_MODE` (checkout prices)

`preview` = only a browser that opened a page with `?flash=1` (checkout: only a logged-in admin). `live` = everyone. `off` = nobody.
