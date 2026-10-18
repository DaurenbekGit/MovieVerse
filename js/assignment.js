
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;

    // SHARED STYLES
    const style = document.createElement("style");

    style.textContent = `
        #navbar-datetime {
            flex-shrink: 0;
            margin-right: 12px;
            font-size: 12px;
            white-space: nowrap;
            color: inherit;
        }

        .faq-answer {
            overflow: hidden !important;
            max-height: 0;
            padding: 0 15px !important;
            opacity: 0;
            transition: max-height .35s ease,
                        padding .35s ease,
                        opacity .35s ease;
        }

        .faq-answer.open {
            opacity: 1;
            padding: 15px !important;
        }

        .fav-btn,
        .fav-btn-active {
            transition: color .2s ease, text-shadow .2s ease;
        }

        .fav-btn:hover,
        .fav-btn-active:hover {
            color: #facc15 !important;
            text-shadow: 0 0 10px rgba(250,204,21,.8) !important;
        }

        .remove-hover {
            background-color: #dc2626 !important;
            color: #ffffff !important;
        }

        @media (prefers-reduced-motion: reduce) {
            .faq-answer {
                transition: none !important;
            }
        }
    `;

    document.head.appendChild(style);

    // NAVBAR CLOCK
    const navbar = document.querySelector(".nav-menu");
    const logo = navbar ? navbar.querySelector(".logo") : null;
    let clock = document.getElementById("navbar-datetime");

    if (navbar && logo) {
        if (!clock) {
            clock = document.createElement("span");
            clock.id = "navbar-datetime";
        }

        navbar.insertBefore(clock, logo);
    }

    function updateClock() {
        if (!clock) return;

        clock.textContent = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(new Date());
    }

    updateClock();

    if (clock) {
        setInterval(updateClock, 1000);
    }

    // POPUP
    const popup = document.getElementById("subscription-popup");
    const openButton = document.getElementById("open-subscription");
    const closeButton = document.getElementById("close-subscription");

    function stylePopup() {
        if (!popup) return;

        const modal = popup.querySelector('[role="dialog"]');

        if (modal) {
            Object.assign(modal.style, {
                width: "100%",
                maxWidth: "440px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxSizing: "border-box",
                padding: "28px",
                border: "1px solid #3b4252",
                borderRadius: "12px",
                backgroundColor: "#2e3440",
                color: "#eceff4"
            });
        }

        popup.querySelectorAll("input").forEach(function (input) {
            Object.assign(input.style, {
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 12px",
                marginTop: "6px",
                border: "1px solid #3b4252",
                borderRadius: "6px",
                backgroundColor: "#242933",
                color: "#eceff4",
                fontFamily: "inherit",
                fontSize: "16px"
            });
        });

        popup.querySelectorAll("label").forEach(function (label) {
            label.style.display = "block";
            label.style.marginTop = "14px";
            label.style.marginBottom = "6px";
            label.style.color = "#d8dee9";
        });

        popup.querySelectorAll("h2, p").forEach(function (element) {
            if (element.id === "form-message") return;
            element.style.color = "#d8dee9";
        });
    }

    if (popup) {
        Object.assign(popup.style, {
            display: "none",
            position: "fixed",
            inset: "0",
            zIndex: "1000",
            padding: "16px",
            backgroundColor: "rgba(0,0,0,.78)",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
            boxSizing: "border-box"
        });

        stylePopup();
    }

    function openPopup() {
        if (!popup) return;

        stylePopup();
        popup.style.display = "flex";
        popup.setAttribute("aria-hidden", "false");
    }

    function closePopup() {
        if (!popup) return;

        popup.style.display = "none";
        popup.setAttribute("aria-hidden", "true");
    }

    if (openButton) {
        openButton.addEventListener("click", openPopup);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closePopup);
    }

    if (popup) {
        popup.addEventListener("click", function (event) {
            if (event.target === popup) {
                closePopup();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePopup();
        }
    });

    // FORM VALIDATION
    const form = document.getElementById("subscription-form");
    const message = document.getElementById("form-message");

    if (form && message) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("subscription-email");
            const password = document.getElementById("subscription-password");
            const confirmation = document.getElementById("confirm-password");

            message.textContent = "";

            if (!email || !email.value.trim() || !email.checkValidity()) {
                message.textContent = "Please enter a valid email address.";
                message.style.color = "#ef4444";

                if (email) email.focus();
                return;
            }

            if (!password || password.value.length < 8) {
                message.textContent =
                    "Password must contain at least 8 characters.";
                message.style.color = "#ef4444";

                if (password) password.focus();
                return;
            }

            if (!confirmation || password.value !== confirmation.value) {
                message.textContent = "Passwords do not match.";
                message.style.color = "#ef4444";

                if (confirmation) confirmation.focus();
                return;
            }

            message.textContent = "Your information is valid!";
            message.style.color = "#16a34a";

            form.reset();
        });
    }

    // FAQ ACCORDION
    document.querySelectorAll(".faq-question").forEach(function (button) {
        const answer = button.nextElementSibling;

        if (!answer) return;

        button.setAttribute("aria-expanded", "false");
        answer.setAttribute("aria-hidden", "true");
        answer.classList.remove("open");

        answer.style.setProperty("max-height", "0", "important");
        answer.style.setProperty("padding", "0 15px", "important");
        answer.style.setProperty("opacity", "0", "important");

        button.addEventListener("click", function () {
            const isOpen =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            answer.setAttribute("aria-hidden", String(isOpen));

            if (isOpen) {
                answer.classList.remove("open");

                answer.style.setProperty(
                    "max-height", "0", "important"
                );

                answer.style.setProperty(
                    "padding", "0 15px", "important"
                );

                answer.style.setProperty(
                    "opacity", "0", "important"
                );
            } else {
                answer.classList.add("open");

                answer.style.setProperty(
                    "max-height",
                    answer.scrollHeight + 40 + "px",
                    "important"
                );

                answer.style.setProperty(
                    "padding", "15px", "important"
                );

                answer.style.setProperty(
                    "opacity", "1", "important"
                );
            }

            const icon = button.querySelector(".faq-icon");

            if (icon) {
                icon.textContent = isOpen ? "+" : "−";
            }
        });
    });

    // BACKGROUND COLOR BUTTON
    const backgroundButton =
        document.getElementById("change-background");

    const colors = [
        "#0b0f19", // Original MovieVerse background
        "#ffffff", // White
        "#cbd5e1", // Gray
        "#2e3440", // Nordic
        "#3b4252"  // Nordic gray
    ];

    let colorIndex = 0;

    if (backgroundButton) {
        backgroundButton.addEventListener("click", function () {
            colorIndex = (colorIndex + 1) % colors.length;

            const selectedColor = colors[colorIndex];

            body.style.backgroundColor = selectedColor;

            const layout = document.querySelector(".page-layout");

            if (layout) {
                layout.style.backgroundColor = selectedColor;
            }
        });
    }

    // FAVORITE STARS
    document.querySelectorAll(".fav-btn, .fav-btn-active")
        .forEach(function (star) {
            star.addEventListener("mouseenter", function () {
                star.style.setProperty(
                    "color", "#facc15", "important"
                );

                star.style.textShadow =
                    "0 0 10px rgba(250,204,21,.8)";
            });

            star.addEventListener("mouseleave", function () {
                star.style.textShadow = "";

                if (star.classList.contains("fav-btn-active")) {
                    star.style.setProperty(
                        "color", "#facc15", "important"
                    );
                } else {
                    star.style.removeProperty("color");
                }
            });
        });

    // REMOVE BUTTONS
    document.querySelectorAll("button, a").forEach(function (button) {
        if (button.textContent.trim().toLowerCase() !== "remove") {
            return;
        }

        button.addEventListener("mouseenter", function () {
            button.classList.add("remove-hover");
        });

        button.addEventListener("mouseleave", function () {
            button.classList.remove("remove-hover");
        });
    });
});
