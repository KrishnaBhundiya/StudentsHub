import "./style.css";
import { account } from "./appwrite";
import { OAuthProvider } from "appwrite";

const app = document.getElementById("app");
const loginBtn = document.getElementById("btn-siwg");

const loginSIWG = async () => {
    account.createOAuth2Session(
        OAuthProvider.Google,
        "http://127.0.0.1:5503/signup.html",
        "http://127.0.0.1:5503/signup.html/fail"
    );
};

const init = async () => {
    try {
        const user = await account.get();
        app.innerHTML = `<h3>Hi ${user.name || user.email} 👋</h3>`;
    } catch (error) {
        console.error(error);
    }
};

init();

loginBtn.addEventListener("click", loginSIWG);
