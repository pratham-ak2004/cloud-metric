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
  //
});

app.controller("signupController", function ($scope, $http) {
  $scope.formData = {
    name: "",
    password: "",
    email: ""
  };
  $scope.confirmPassword = "";

//   $scope.signup = function () {
//     $http.post("/api/signup", $scope.signupData)
//       .then(function (response) {
//         // Handle success
//         alert("Signup successful!");
//       })
//       .catch(function (error) {
//         // Handle error
//         alert("Signup failed: " + error.data.message);
//       });
//   };
})