<div align="center">

  <h1><code>Wasm πΈπΈ2οΈβ£0οΈβ£ in Rust π¦</code></h1>

  <strong>a project to learn and test encryption chacha20-poly1305 in a wasm binary written in Rust</strong>

  <sub><a href="https://rustwasm.github.io/">Built with π¦πΈ</a></sub>
</div>




## About

<strong>β οΈ Don't use this project on production, it's only for test & learn purpose</strong>


## π΄ Usage

**π How to run locally π**

- clone this repo on `main` branch  
- π οΈ in a first terminal 1οΈβ£, build the web assembly code
```
cargo watch -i .gitignore -i "pkg/*" -s "wasm-pack build"
```
or just `wasm-pack build` if you don't need the live reload.
- π οΈ in a second terminal 2οΈβ£, run the following command
```
cd www
npm install
npm run start
```
- open http://localhost:8080


### π package to delivery

- In a terminal, in the **`www`** directory, run the command  
```
npm run build
```
- copy the `www/dist/` directory's content in your web server, with `www/js` and `www/css` directories (see **gh-pages** branch for example)


