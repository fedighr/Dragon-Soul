export const getCsrfToken = () => {
  let cookieValue = null;
  if (document.cookie) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith("csrftoken=")) {
        cookieValue = decodeURIComponent(cookie.substring("csrftoken=".length));
        break;
      }
    }
  }
  return cookieValue;
};
