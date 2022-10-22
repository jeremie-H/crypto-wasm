import * as wasm from "crypto-wasm";


document.querySelector('#encrypt-button').addEventListener('click', function(event) {
  let keyElt = document.getElementById('wasm-enc-key');
  let message = document.getElementById('wasm-enc-message').value;
  wasm.encrypt(document, document.getElementById('wasm-enc-result'), keyElt, { message: message, key: keyElt.value });
  
});

document.querySelector('#decrypt-button').addEventListener('click', function(event) {
    let key = document.getElementById('wasm-dec-key').value;
    let nonce = document.getElementById('wasm-dec-nonce').value;
    let encoded = document.getElementById('wasm-dec-encoded').value;
    document.getElementById('wasm-dec-message').innerText="... decoding ...";
    wasm.decrypt(document.getElementById('wasm-dec-message'), { encoded: encoded, key: key, nonce: nonce });
  });


/**
 * copy text into clipboard
 * @param {text} text to copy in clipboard
 * @returns 
 */
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        //console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

    var copyNonce = document.querySelector('.js-copy-nonce-btn'),
        copyEncoded = document.querySelector('.js-copy-encoded-btn'),
        copyDecoded = document.querySelector('.js-copy-decoded-btn');

    copyNonce.addEventListener('click', function(event) {
        copyTextToClipboard(document.querySelector('.result_nonce').innerText);
    });

    copyEncoded.addEventListener('click', function(event) {
        copyTextToClipboard(document.querySelector('.result_encoded').innerText);
    });

    copyDecoded.addEventListener('click', function(event) {
        copyTextToClipboard(document.querySelector('.result_decoded').innerText);
    });