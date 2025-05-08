const app = angular.module("cloudMetricApp", []);

// API key controller
app.controller("getApiController", function ($scope) {
  $scope.getApiKey = function () {
    // Placeholder for API key retrieval logic
    alert("API key functionality will be implemented soon.");
  };
});

app.controller("authController", function ($scope) {
  
})

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
