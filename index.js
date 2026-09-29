import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const name = "autolightdark";
const folder = `scripts/extensions/third-party/${name}`;
const mq = window.matchMedia("(prefers-color-scheme: dark)");

const PALETTES = {
    dark: {
        body: "#e6e6e6", em: "#a9a9a9", blur: "rgba(0,0,0,1)", chat: "rgba(20,20,20,1)",
        user: "rgba(35,35,40,1)", bot: "rgba(25,25,28,1)", border: "rgba(255,255,255,0.12)",
        shadow: "rgba(0,0,0,0.6)", quote: "#7dffb3", bg: "#000000", scheme: "dark"
    },
    light: {
        body: "#111111", em: "#555555", blur: "rgba(245,245,247,1)", chat: "rgba(255,255,255,1)",
        user: "rgba(225,235,250,1)", bot: "rgba(238,238,242,1)", border: "rgba(0,0,0,0.15)",
        shadow: "rgba(0,0,0,0.15)", quote: "#0a7d4b", bg: "#f5f5f7", scheme: "light"
    }
};

function st() {
    extension_settings[name] = extension_settings[name] || {};
    if (!extension_settings[name].mode) extension_settings[name].mode = "auto";
    return extension_settings[name];
}

function effective() {
    const m = st().mode;
    if (m === "light" || m === "dark") return m;
    return mq.matches ? "dark" : "light";
}

function apply() {
    const p = PALETTES[effective()];
    let el = document.getElementById("ald_style");
    if (!el) {
        el = document.createElement("style");
        el.id = "ald_style";
        document.head.appendChild(el);
    }
    el.textContent = `
:root {
  color-scheme: ${p.scheme} !important;
  --SmartThemeBodyColor: ${p.body} !important;
  --SmartThemeEmColor: ${p.em} !important;
  --SmartThemeBlurTintColor: ${p.blur} !important;
  --SmartThemeChatTintColor: ${p.chat} !important;
  --SmartThemeUserMesBlurTintColor: ${p.user} !important;
  --SmartThemeBotMesBlurTintColor: ${p.bot} !important;
  --SmartThemeBorderColor: ${p.border} !important;
  --SmartThemeShadowColor: ${p.shadow} !important;
  --SmartThemeQuoteColor: ${p.quote} !important;
}
html, body { background-color: ${p.bg} !important; }
#bg1, #bg_custom { background-color: ${p.bg} !important; }
`;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
    }
    meta.content = p.bg;
}

jQuery(async () => {
    try {
        $("#extensions_settings2").append(await $.get(`${folder}/setting.html?v=1.0.0`));
    } catch (e) {
        console.warn("[autolightdark] setting.html error", e);
    }
    $("#ald_mode").val(st().mode).on("change", function () {
        st().mode = $(this).val();
        saveSettingsDebounced();
        apply();
    });
    mq.addEventListener("change", apply);
    apply();
    console.log("[autolightdark] loaded");
});
