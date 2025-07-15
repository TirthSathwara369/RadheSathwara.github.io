
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Exo 2', sans-serif;
    background: #0a0a0a;
    color: #e0e0e0;
    overflow-x: hidden;
    line-height: 1.6;
}

/* Animated starfield background */
.stars, .twinkling {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: -1;
}

.stars {
    background: #000 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><style>.a{fill:%23fff;}</style></defs><circle class="a" cx="20" cy="20" r="1"/><circle class="a" cx="80" cy="80" r="1"/><circle class="a" cx="150" cy="30" r="1"/><circle class="a" cx="170" cy="90" r="1"/><circle class="a" cx="30" cy="150" r="1"/><circle class="a" cx="120" cy="170" r="1"/></svg>') repeat;
    animation: move-stars 50s linear infinite;
}

.twinkling {
    background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><style>.a{fill:%2300ffff;opacity:0.8;}</style></defs><circle class="a" cx="50" cy="50" r="0.5"/><circle class="a" cx="150" cy="100" r="0.5"/><circle class="a" cx="250" cy="150" r="0.5"/><circle class="a" cx="100" cy="250" r="0.5"/></svg>') repeat;
