mod utils;

use std::{str::{self, from_utf8}, panic};

use wasm_bindgen::JsCast;
use web_sys::{console, HtmlDivElement, HtmlElement, HtmlInputElement, Document, Element};
use js_sys::{Reflect};

use chacha20poly1305::{
    aead::{Aead, AeadCore, KeyInit, OsRng, generic_array::GenericArray},
    ChaCha20Poly1305, Nonce, Key
};


use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn encrypt(document: &JsValue, element_pre: &JsValue, element_key: &JsValue, options: &JsValue) 
-> Result<(), JsValue> {
    
    //help debug in console
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    
    
    let mut web_nonce: Element;
    let mut web_encoded: Element;
    match document.dyn_ref::<Document>() {
        Some(doc) => {
            web_nonce = doc.get_element_by_id("wasm-enc-nonce").unwrap();
            web_encoded = doc.get_element_by_id("wasm-enc-encoded").unwrap();
            


            
            match element_pre.dyn_ref::<HtmlElement>() {
                Some(div) => {
                  if options.is_undefined() {
                    div.set_inner_text("Hello from Rust");
                  } else {
                    let message: JsValue = Reflect::get(&options, &JsValue::from_str("message"))?;
                    // let key = Reflect::get(&options, &JsValue::from_str("key"))?;
                    // let key = key.as_string().unwrap();
                    
        
                    //met à jour le field Key s'il était vide
                    let key = match element_key.dyn_ref::<HtmlInputElement>() {
                        Some(input) => {
                            let key = input.value();
                            let key = if key.is_empty() {
                                let generatedKey = ChaCha20Poly1305::generate_key(&mut OsRng);
                                let keyHex = hex::encode(&generatedKey);
                                input.set_value(&keyHex);
                                generatedKey
                            } else {
                                let key = hex::decode(&key).unwrap();
                                *Key::from_slice(&key)
                            };
                            
                            Ok(key)
                        }
                        None => Err(JsValue::from_str("you should pass an html input element in the second parameter"))
                    };
                    let key = key?;
                    let keyHex = hex::encode(&key);
                    let message = message.as_string().unwrap();
                    
        
                    //let cipher = ChaCha20Poly1305::new_from_slice(key.as_bytes()).unwrap();
                    
                    let cipher = ChaCha20Poly1305::new(&key);
                    let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng); // 96-bits; unique per message
                    let ciphertext = cipher.encrypt(&nonce, message.as_ref()).unwrap();
                    //let plaintext = cipher.decrypt(&nonce, ciphertext.as_ref()).unwrap();
        
                    
                    let nonce = hex::encode(&nonce);
                    let ciphertext = hex::encode(&ciphertext);
                    web_nonce.set_inner_html(&nonce);
                    web_encoded.set_inner_html(&ciphertext);
                    //div.set_inner_text(&format!("key: {}\nnonce: {}\nencoded: {}",&keyHex,&nonce,&ciphertext));
                  }
                  Ok(())
                }
                None => Err(JsValue::from_str("ele must be a div"))
              };
            
            
            
            
            
            
            
            Ok(())
        },
        None => Err(JsValue::from_str("document must be provided")),
    }

    

// let key = ChaCha20Poly1305::generate_key(&mut OsRng);
// let cipher = ChaCha20Poly1305::new(&key);
// let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng); // 96-bits; unique per message
// let ciphertext = cipher.encrypt(&nonce, b"plaintext message".as_ref()).unwrap();
// let plaintext = cipher.decrypt(&nonce, ciphertext.as_ref()).unwrap();


//     alert(&format!("Hello, ça marche : {}",from_utf8(&plaintext).unwrap()));
}



#[wasm_bindgen]
pub fn decrypt(ele: &JsValue, options: &JsValue) -> Result<(), JsValue> {

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
        None => Err(JsValue::from_str("ele must be a div"))
      }

}

