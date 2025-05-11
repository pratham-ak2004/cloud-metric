const app = angular.module("cloudMetricApp", []);

// API key controller
app.controller("getApiController", function ($scope) {
  $scope.getApiKey = function () {
    // Placeholder for API key retrieval logic
    alert("API key functionality will be implemented soon.");
  };
});

app.controller("authController", function ($scope) {
  $scope.isLoggedIn = false;

  async function getSession() {
    const res = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();

      $scope.isLoggedIn = true;
      $scope.$apply();
    }
  }

  getSession();

  $scope.logout = async function () {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      localStorage.removeItem("token");
      $scope.isLoggedIn = false;
      $scope.$apply();
    } else {
      alert("Logout failed");
    }
  };
});

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
