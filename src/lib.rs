mod utils;

use std::{
    panic,
    str::{self, from_utf8},
};

use js_sys::Reflect;
use wasm_bindgen::JsCast;
use web_sys::{Document, Element, HtmlDivElement, HtmlElement, HtmlInputElement};

use chacha20poly1305::{
    aead::{generic_array::GenericArray, Aead, AeadCore, KeyInit, OsRng},
    ChaCha20Poly1305, Key, Nonce,
};

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/**
 * helper function to display message in console.log
 */
pub fn console_log(msg: &str) {
    let array = js_sys::Array::new();
    array.push(&msg.into());
    web_sys::console::log(&array);
}

#[wasm_bindgen]
pub fn encrypt(document: &Document, options: &JsValue) -> Result<(), JsValue> {
    //help debug in console
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    console_log("🔑 encrypt in chacha20-poly1305 - test reload");

    if document.is_undefined() || document.is_null() {
        return Err(JsValue::from_str("document should be passed in the fonction in order to be use results fields"));
    }
    let web_nonce: Element = document.get_element_by_id("wasm-enc-nonce").unwrap();
    let web_encoded: Element = document.get_element_by_id("wasm-enc-encoded").unwrap();
    let web_key: HtmlInputElement = document.get_element_by_id("wasm-enc-key").unwrap().dyn_ref::<HtmlInputElement>().unwrap().to_owned();

    if options.is_undefined() {
        web_encoded.set_inner_html("no options were passed in wasm.encrypt function");
        return Err(JsValue::from_str("options values should be provided"));
    }

    //récupère le message de la structure "options"
    let message: JsValue = Reflect::get(&options, &JsValue::from_str("message"))?;

    //met à jour le field Key s'il était vide
    let clef_de_chiffrement = if web_key.value().is_empty() {
        let generated_key = ChaCha20Poly1305::generate_key(&mut OsRng);
        let key_hex = hex::encode(&generated_key);
        web_key.set_value(&key_hex);
        generated_key
    } else {
        let key = hex::decode(&web_key.value()).unwrap();
        *Key::from_slice(&key)
    };

    //initialisation de l'algo Chacha20
    let cipher = ChaCha20Poly1305::new(&clef_de_chiffrement);
    let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng); // 96-bits; unique per message
    let message = message.as_string().unwrap();

    //chiffrement du message clair
    let ciphertext = cipher.encrypt(&nonce, message.as_ref()).unwrap();

    //mise à jour des champs html
    let nonce = hex::encode(&nonce);
    let ciphertext = hex::encode(&ciphertext);
    web_nonce.set_inner_html(&nonce);
    web_encoded.set_inner_html(&ciphertext);
    Ok(())
}

#[wasm_bindgen]
pub fn decrypt(ele: &JsValue, options: &JsValue) -> Result<(), JsValue> {
    //help debug in console
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    console_log("🤓 decrypt in chacha20-poly1305");

    match ele.dyn_ref::<HtmlElement>() {
        Some(div) => {
            if options.is_undefined() {
                div.set_inner_text("Hello from Rust");
            } else {
                let encoded: JsValue = Reflect::get(&options, &JsValue::from_str("encoded"))?;
                let key: JsValue = Reflect::get(&options, &JsValue::from_str("key"))?;
                let nonce: JsValue = Reflect::get(&options, &JsValue::from_str("nonce"))?;

                let encoded = encoded.as_string().unwrap();
                let encoded = hex::decode(&encoded).unwrap();

                let key = key.as_string().unwrap();
                let key = hex::decode(&key).unwrap();
                //let key: Key = *GenericArray::from_slice(&key);
                let key = *Key::from_slice(&key);

                let nonce = nonce.as_string().unwrap();
                let nonce = hex::decode(&nonce).unwrap();
                let nonce: Nonce = *Nonce::from_slice(&nonce);

                let cipher = ChaCha20Poly1305::new(&key);
                let plaintext = cipher.decrypt(&nonce, encoded.as_ref()).unwrap();

                let nonce = hex::encode(&nonce);
                let key = hex::encode(&key);
                div.set_inner_text(from_utf8(&plaintext).unwrap());
            }
            Ok(())
        }
        None => Err(JsValue::from_str("ele must be a div")),
    }
}
