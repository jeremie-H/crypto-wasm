import init, { encrypt, decrypt } from "crypto-wasm";

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Initialize WASM module and setup event handlers
async function main() {
    try {
        // Initialize the WASM module
        await init();
        console.log('WASM module initialized successfully');
    } catch (error) {
        console.error('Failed to initialize WASM module:', error);
        showToast('Failed to load WASM module. Please refresh the page.');
        return;
    }

    // Encrypt button handler
    document.querySelector('#encrypt-button').addEventListener('click', function(event) {
        const button = event.currentTarget;
        const clef = document.getElementById('wasm-enc-key').value;
        const message = document.getElementById('wasm-enc-message').value;

        if (!message || message.trim() === '') {
            showToast('Please enter a message to encrypt');
            return;
        }

        // Add loading state
        button.classList.add('loading');
        button.disabled = true;

        try {
            encrypt(document, { message: message, key: clef });

            // Show results section
            document.getElementById('wasm-enc-result').style.display = 'block';

            showToast('Message encrypted successfully!');
        } catch (error) {
            console.error('Encryption error:', error);
            showToast('Encryption failed: ' + error.message);
        } finally {
            // Remove loading state
            button.classList.remove('loading');
            button.disabled = false;
        }
    });

    // Decrypt button handler
    document.querySelector('#decrypt-button').addEventListener('click', function(event) {
        const button = event.currentTarget;
        const key = document.getElementById('wasm-dec-key').value;
        const nonce = document.getElementById('wasm-dec-nonce').value;
        const encoded = document.getElementById('wasm-dec-encoded').value;

        if (!key || !nonce || !encoded || key.trim() === '' || nonce.trim() === '' || encoded.trim() === '') {
            showToast('Please fill all fields');
            return;
        }

        // Add loading state
        button.classList.add('loading');
        button.disabled = true;

        const messageElement = document.getElementById('wasm-dec-message');
        messageElement.innerText = "Decrypting...";

        try {
            decrypt(messageElement, { encoded: encoded, key: key, nonce: nonce });

            // Show results section
            document.getElementById('wasm-dec-result').style.display = 'block';

            showToast('Message decrypted successfully!');
        } catch (error) {
            console.error('Decryption error:', error);
            messageElement.innerText = "Decryption failed";
            showToast('Decryption failed: ' + error.message);
        } finally {
            // Remove loading state
            button.classList.remove('loading');
            button.disabled = false;
        }
    });

    // Copy button event listeners
    const copyNonce = document.querySelector('.js-copy-nonce-btn');
    const copyEncoded = document.querySelector('.js-copy-encoded-btn');
    const copyDecoded = document.querySelector('.js-copy-decoded-btn');

    copyNonce.addEventListener('click', function(event) {
        event.preventDefault();
        const text = document.querySelector('#wasm-enc-nonce').innerText;
        if (text && text !== '') {
            copyTextToClipboard(text);
        }
    });

    copyEncoded.addEventListener('click', function(event) {
        event.preventDefault();
        const text = document.querySelector('#wasm-enc-encoded').innerText;
        if (text && text !== '') {
            copyTextToClipboard(text);
        }
    });

    copyDecoded.addEventListener('click', function(event) {
        event.preventDefault();
        const text = document.querySelector('#wasm-dec-message').innerText;
        if (text && text !== '') {
            copyTextToClipboard(text);
        }
    });
}

/**
 * Copy text into clipboard
 * @param {string} text - text to copy in clipboard
 */
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy');
            console.error('Fallback: Could not copy text: ', err);
        }

        document.body.removeChild(textArea);
        return;
    }

    navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard!');
    }, function(err) {
        showToast('Failed to copy');
        console.error('Async: Could not copy text: ', err);
    });
}

// Run main initialization
main();
