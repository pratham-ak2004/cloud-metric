import { clearSessionCache } from "~/hooks/useSession";

export async function logOut() {
  return fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      clearSessionCache();
    }
    return response;
  });
}

export async function SignIn(
  data: FormData
): Promise<{ status: number; message: string; redirect: string }> {
  return new Promise((resolve, reject) => {
    console.log(data);
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          setTimeout(() => {
            clearSessionCache();
          }, 500);
          response.json().then((data) => {
            resolve({
              status: response.status,
              message: "Login successful",
              redirect: data.redirect,
            });
          });
        } else {
          response.text().then((message) =>
            reject({
              status: response.status,
              message,
            })
          );
        }
      })
      .catch(() =>
        reject({
          status: 500,
          message: "Network error",
        })
      );
  });
}
