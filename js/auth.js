const USERS_STORAGE_KEY = "toeicMasteryUsers";
const SESSION_STORAGE_KEY = "toeicMasterySession";
const PASSWORD_HASH_ITERATIONS = 100000;

function readSession() {
  const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (storedSession === null) return null;

  try {
    const session = JSON.parse(storedSession);
    if (
      !session ||
      typeof session.email !== "string" ||
      typeof session.username !== "string"
    ) {
      throw new Error("Dữ liệu phiên đăng nhập không hợp lệ.");
    }
    return session;
  } catch (error) {
    console.error("Không thể đọc phiên đăng nhập đã lưu:", error);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function initAuthNavigation() {
  const session = readSession();

  document.querySelectorAll("[data-auth-user-name]").forEach((element) => {
    element.textContent = session?.username ?? "";
  });
  document.querySelectorAll("[data-auth-guest]").forEach((element) => {
    element.classList.toggle("hidden", Boolean(session));
  });
  document.querySelectorAll("[data-auth-user]").forEach((element) => {
    element.classList.toggle("hidden", !session);
  });
  document.querySelectorAll("[data-auth-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.location.href = "./index.html";
    });
  });
}

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("text-red-600", isError);
  element.classList.toggle("text-brand-600", !isError);
}

function readUsers() {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers === null) return [];

  let users;
  try {
    users = JSON.parse(storedUsers);
  } catch {
    throw new Error("Dữ liệu tài khoản đã lưu không hợp lệ. Vui lòng xóa dữ liệu trang và thử lại.");
  }

  if (
    !Array.isArray(users) ||
    users.some(
      (user) =>
        !user ||
        typeof user.email !== "string" ||
        typeof user.username !== "string" ||
        typeof user.passwordHash !== "string" ||
        typeof user.salt !== "string"
    )
  ) {
    throw new Error("Dữ liệu tài khoản đã lưu không hợp lệ. Vui lòng xóa dữ liệu trang và thử lại.");
  }

  return users;
}

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function hashPassword(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_HASH_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    256
  );

  return toBase64(new Uint8Array(hash));
}

function initLoginForm(form) {
  const message = document.getElementById("auth-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(message, "");

    try {
      const formData = new FormData(form);
      const email = String(formData.get("email")).trim().toLowerCase();
      const password = String(formData.get("password"));
      const user = readUsers().find((account) => account.email === email);

      if (!user) {
        showMessage(message, "Email hoặc mật khẩu không chính xác.", true);
        return;
      }

      const salt = Uint8Array.from(atob(user.salt), (character) =>
        character.charCodeAt(0)
      );
      const passwordHash = await hashPassword(password, salt);
      if (passwordHash !== user.passwordHash) {
        showMessage(message, "Email hoặc mật khẩu không chính xác.", true);
        return;
      }

      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ email: user.email, username: user.username })
      );
      window.location.href = "./index.html";
    } catch (error) {
      showMessage(
        message,
        error instanceof Error
          ? `Không thể đăng nhập: ${error.message}`
          : "Không thể đăng nhập do lỗi không xác định.",
        true
      );
    }
  });
}

function initRegisterForm(form) {
  const message = document.getElementById("auth-message");
  const passwordInput = form.elements.namedItem("password");
  const confirmPasswordInput = form.elements.namedItem("confirmPassword");

  function validatePasswordMatch() {
    confirmPasswordInput.setCustomValidity(
      confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value
        ? "Mật khẩu nhập lại không khớp."
        : ""
    );
  }

  passwordInput.addEventListener("input", validatePasswordMatch);
  confirmPasswordInput.addEventListener("input", validatePasswordMatch);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(message, "");
    validatePasswordMatch();
    if (!form.reportValidity()) return;

    try {
      const formData = new FormData(form);
      const email = String(formData.get("email")).trim().toLowerCase();
      const username = String(formData.get("username")).trim();
      const password = String(formData.get("password"));
      const users = readUsers();

      if (users.some((user) => user.email === email)) {
        showMessage(message, "Email này đã được đăng ký.", true);
        return;
      }

      const salt = crypto.getRandomValues(new Uint8Array(16));
      users.push({
        email,
        username,
        salt: toBase64(salt),
        passwordHash: await hashPassword(password, salt),
      });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      showMessage(message, "Đăng ký thành công. Bạn có thể đăng nhập ngay.");
      form.reset();
    } catch (error) {
      showMessage(
        message,
        error instanceof Error
          ? `Không thể đăng ký: ${error.message}`
          : "Không thể đăng ký do lỗi không xác định.",
        true
      );
    }
  });
}

function initProfilePage() {
  const profileName = document.querySelector("[data-profile-name]");
  const profileEmail = document.querySelector("[data-profile-email]");
  const profileMessage = document.getElementById("profile-message");
  if (!profileName || !profileEmail || !profileMessage) return;

  const session = readSession();
  if (!session) {
    window.location.href = "./login.html";
    return;
  }

  try {
    const user = readUsers().find((account) => account.email === session.email);
    if (!user) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.location.href = "./login.html";
      return;
    }

    profileName.textContent = user.username;
    profileEmail.textContent = user.email;
  } catch (error) {
    showMessage(
      profileMessage,
      error instanceof Error
        ? `Không thể tải thông tin cá nhân: ${error.message}`
        : "Không thể tải thông tin cá nhân do lỗi không xác định.",
      true
    );
  }
}

export function initAuth() {
  initAuthNavigation();
  initProfilePage();

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) initLoginForm(loginForm);
  if (registerForm) initRegisterForm(registerForm);
}
