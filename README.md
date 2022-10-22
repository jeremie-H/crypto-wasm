<div align="center">

  <h1><code>Wasm 😸😸2️⃣0️⃣ in Rust 🦀</code></h1>

  <strong>a project to learn and test encryption chacha20-poly1305 in a wasm binary written in Rust</strong>

  <sub><a href="https://rustwasm.github.io/">Built with 🦀🕸</a></sub>
</div>




## About

<strong>⚠️ Don't use this project on production, it's only for test & learn purpose</strong>


## 🚴 Usage

**📚 How to run locally 📚**

- clone this repo on `main` branch  
- 🛠️ in a first terminal 1️⃣, build the web assembly code
```
cargo watch -i .gitignore -i "pkg/*" -s "wasm-pack build"
```
or just `wasm-pack build` if you don't need the live reload.
- 🛠️ in a second terminal 2️⃣, run the following command
```
cd www
npm install
npm run start
```
- open http://localhost:8080


### 🎁 package to delivery

- In a terminal, in the **`www`** directory, run the command  
```
npm run build
```
- copy the `dist` directory in your web server


