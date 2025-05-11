package types

type SignInForm struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type LoginForm struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}