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

app.controller("signupController", function ($scope) {
  $scope.formData = {
    name: "",
    email: "",
    password: "",
  };
  $scope.confirmPassword = "";
  $scope.isPasswordMatch = true;
  $scope.isPasswordValid = true;

  $scope.submitSignup = async function () {
    if ($scope.formData.password.length < 8) {
      $scope.isPasswordValid = false;
    } else if ($scope.formData.password !== $scope.confirmPassword) {
      $scope.isPasswordMatch = false;
    } else {
      $scope.isPasswordMatch = true;
      $scope.isPasswordValid = true;

      const formData = new FormData();
      formData.append("name", $scope.formData.name);
      formData.append("email", $scope.formData.email);
      formData.append("password", $scope.formData.password);

      console.log("Form data:", formData);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.status === 201) {
        window.location.href = "/login.html";

        $scope.formData = {
          name: "",
          email: "",
          password: "",
        };
      } else {
        alert("Signup failed! Please try again.");
        console.log(data);
      }
    }
  };
  // $scope.isPasswordValid = true;

  // $scope.$watch("formData.password", function (newValue, oldValue) {
  //   if(newValue === undefined || newValue.length === 0){
  //     $scope.isPasswordValid = true;
  //   }else if(newValue.length >= 8){
  //     $scope.isPasswordValid = true
  //   }else{
  //     $scope.isPasswordValid = false
  //   }
  // })
});
