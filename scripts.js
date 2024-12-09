// URL Endpoint API
const API_URL = "https://faucet.non-prod.sphx.dev/can_claim";

// Validasi Ethereum address
function isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Hubungkan wallet menggunakan MetaMask
const connectWalletButton = document.getElementById("connect-wallet");
const walletInfo = document.getElementById("wallet-info");
const walletAddressSpan = document.getElementById("wallet-address");
let connectedWallet = "";

connectWalletButton.addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            // Minta akses ke MetaMask
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            connectedWallet = accounts[0];
            
            // Tampilkan alamat wallet yang terhubung
            walletInfo.classList.remove("hidden");
            walletAddressSpan.textContent = connectedWallet;

            // Auto-fill ke input address
            document.getElementById("address").value = connectedWallet;
        } catch (error) {
            console.error("User rejected connection:", error);
        }
    } else {
        alert("MetaMask tidak terdeteksi. Silakan install MetaMask.");
    }
});

// Submit klaim faucet
document.getElementById("faucet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Ambil address dari input form
    const address = document.getElementById("address").value.trim();
    const responseDiv = document.getElementById("response");

    // Validasi Ethereum address
    if (!isValidEthereumAddress(address)) {
        responseDiv.textContent = "Ethereum address tidak valid.";
        responseDiv.classList.remove("hidden");
        responseDiv.classList.add("error");
        return;
    }

    try {
        // Kirim request ke API faucet
        const res = await fetch(`${API_URL}?address=${address}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Parse response JSON
        const data = await res.json();

        if (res.ok) {
            responseDiv.textContent = data.message || "Klaim berhasil!";
            responseDiv.classList.remove("error");
            responseDiv.classList.add("success");
        } else {
            responseDiv.textContent = data.message || "Terjadi kesalahan saat klaim.";
            responseDiv.classList.add("error");
        }
    } catch (error) {
        console.error("Error:", error);
        responseDiv.textContent = "Tidak dapat terhubung ke server.";
        responseDiv.classList.add("error");
    }

    responseDiv.classList.remove("hidden");
});
