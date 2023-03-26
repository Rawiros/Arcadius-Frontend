(async function initFront() {

    // Sorting
    const sortableElements = Array.from(document.querySelectorAll('*[data-allow-sort]'));

    sortableElements.forEach(sortableElement => {
        const sortingType = sortableElement.getAttribute('data-sort-type') || 'to-upper';

        if (sortableElement instanceof Element) {
            const sortableChildren = Array.from(sortableElement.children);

            const sortFunction = sortingType === 'to-upper'
                ? (a, b) => a.textContent.trim().length - b.textContent.trim().length
                : (a, b) => b.textContent.trim().length - a.textContent.trim().length;

            sortableChildren
                .sort(sortFunction)
                .forEach(child => sortableElement.appendChild(child));
        }
    });

    // Discord login
    const login = document.querySelector("div.btn.login");
    const LoggedIn = document.querySelector("div.logged-in");
    const NotLoggedIn = document.querySelector("div.not-logged-in");
    const UserTAG = document.querySelector("code.user-tag");

    const LOCALSTORAGE_CODE = "discord.oauth.code";

    const OAuth = {
        client_id: 1020673013135458325n,
        redirect: "http://127.0.0.1:3000",
        type: "code",
        scope: [
            "identify",
            "guilds"
        ],

        isLogged() {
            return window.localStorage.getItem(LOCALSTORAGE_CODE) !== void 0;
        },

        setCode(code = "1234") {
            return window.localStorage.setItem(LOCALSTORAGE_CODE, code);
        },

        getCode() {
            return window.localStorage.getItem(LOCALSTORAGE_CODE);
        }
    };

    const params = new Map([
        ["scrollbars", "no"],
        ["resizable", "no"],
        ["status", "no"],
        ["location", "no"],
        ["toolbar", "no"],
        ["menubar", "no"],
        ["width", "450"],
        ["height", "650"],
        ["left", "50%"],
        ["top", "50%"],
    ]);

    console.log(OAuth.getCode())

    if (!OAuth.getCode())
        NotLoggedIn.style.display = "";
    else {
        UserTAG.innerText = OAuth.getCode();
        LoggedIn.style.display = "";
    };

    const OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${OAuth.client_id}&redirect_uri=${encodeURIComponent(OAuth.redirect)}&response_type=${OAuth.type}&scope=${OAuth.scope.join("%20")}`;

    login.addEventListener("click", () => {
        const popup = window.open(OAUTH_URL, "_blank", Array.from(params).map(([key, value]) => `${key}=${value}`).join(","));
        window.popup = popup;

        const timer = setInterval(() => {
            try {
                if (!popup || popup.closed)
                    clearInterval(timer);

                if (popup.location.href.startsWith(OAuth.redirect)) {
                    clearInterval(timer);

                    const code = new URL(popup.location.href).searchParams.get("code");

                    popup.close();

                    OAuth.setCode(code);
                };
            } catch { }

        }, 1000);
    })

})();