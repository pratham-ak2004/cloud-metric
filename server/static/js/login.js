const app = angular.module("cloudMetricApp", []);

// Theme controller
app.controller("themeController", function ($scope) {
  // Toggle theme function
  $scope.toggleTheme = function () {
    $scope.isDarkMode = !$scope.isDarkMode;

    if ($scope.isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
});

app.controller("authController", function ($scope) {
  async function getSession() {
    const res = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "/";
    }
  }

  getSession();
});

app.controller("loginController", function ($scope) {
  $scope.formData = {
    email: "",
    password: "",
  };
  $scope.loginError = false;
  $scope.errorMessage = "";

  $scope.submitLogin = async function () {
    const formData = new FormData();
    formData.append("email", $scope.formData.email);
    formData.append("password", $scope.formData.password);

    console.log(formData);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.status === 200) {
      const data = await res.json();
      window.location.href = data.redirect;
    } else {
      $scope.loginError = true;
      $scope.errorMessage = await res.text();
      $scope.$apply();
    }
  };
});
