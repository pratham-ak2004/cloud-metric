package types

type contextKey string

const (
	SessionKey contextKey = "session"
	UserKey    contextKey = "user"
)

type SessionData struct {
	Token string `json:"token"`
	Valid bool   `json:"valid"`
}

type UserData struct {
	Valid bool   `json:"valid"`
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
