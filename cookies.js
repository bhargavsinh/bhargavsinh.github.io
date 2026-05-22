<div id="cookie-banner" class="fixed bottom-0 left-0 w-full z-[1000] p-6 bg-[#09000f]/95 backdrop-blur-xl border-t border-divine-gold/30 transform translate-y-full transition-transform duration-500">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p class="text-white/80 text-sm font-inter text-center md:text-left">
            We use cookies to enhance your browsing experience and ensure compliance with the <strong>DPDP Act, 2023</strong>. By continuing, you agree to our use of cookies.
        </p>
        <div class="flex gap-4">
            <button id="accept-cookies" class="bg-divine-gold text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest cursor-none hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all">Accept</button>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        if (!localStorage.getItem("cookiesAccepted")) {
            setTimeout(() => document.getElementById("cookie-banner").classList.remove("translate-y-full"), 2000);
        }
        document.getElementById("accept-cookies").addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "true");
            document.getElementById("cookie-banner").classList.add("translate-y-full");
        });
    });
</script>
