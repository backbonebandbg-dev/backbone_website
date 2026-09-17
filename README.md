# BACKBONE — website

Static site (HTML/CSS/JS, no build step). Works on any host: GitHub Pages,
Netlify, Cloudflare Pages, or plain shared hosting. Just upload the whole folder.

## Files
```
index.html          Landing page
events.html         Past events + galleries
assets/css/style.css
assets/js/main.js
assets/img/          Logos + band photos
assets/img/events/   Event photos (thumbs + full-size)
```

## Language
Bulgarian (BG) is the default. The BG/EN switch is top-right; the choice is
remembered in the browser. To add a bilingual line, use:
```html
<span data-lang-bg>Български текст</span><span data-lang-en>English text</span>
```

## Adding a new past event
Open `events.html`. Copy the whole `<article class="event"> … </article>` block
marked "EVENT ENTRY" and paste it **above** the newest one (newest goes first).
Edit the title, date, place and description.

### Adding photos to an event
1. Put the images in `assets/img/events/`. For each photo, ideally add two sizes:
   a full-size one and a smaller `-thumb` version (faster loading). A thumb is
   optional — you can point both at the same file.
2. Inside that event's `<div class="gallery"> … </div>`, add one block per photo:
```html
<div class="gallery__item" data-full="assets/img/events/myshow-03.jpg">
  <img src="assets/img/events/myshow-03-thumb.jpg" alt="My show — BACKBONE" loading="lazy">
</div>
```
`data-full` is the big image that opens in the lightbox when clicked.

### Adding a video
Inside the event, uncomment the `event__video` block and replace `VIDEO_ID`
with the YouTube video ID (the part after `watch?v=`).
