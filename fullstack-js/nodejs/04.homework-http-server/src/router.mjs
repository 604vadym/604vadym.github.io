import { submitForm, createHTMLPage } from "./actions.mjs";

const PAGES = {
    HOME: createHTMLPage(
        "Home",
        `<h1>Home</h1>
      <p>Welcome to the Home Page</p>`,
    ),
    ABOUT: createHTMLPage(
        "About",
        `<h1>About</h1>
      <p>Learn more about us</p>`,
    ),
    CONTACT: createHTMLPage(
        "Contact",
        `<h1>Contact</h1>
      <p>Get in touch</p>`,
    ),
    NOT_FOUND: createHTMLPage("Page Not Found", `<h1>Page Not Found</h1>`),
};

const ACTIONS = {
    SUBMIT: submitForm,
};

export const ROUTER = {
    METHODS: {
        GET: {
            "/": PAGES.HOME,
            "/about": PAGES.ABOUT,
            "/contact": PAGES.CONTACT,
        },
        POST: {
            "/submit": ACTIONS.SUBMIT,
        },
    },

    NOT_FOUND: PAGES.NOT_FOUND,
};
