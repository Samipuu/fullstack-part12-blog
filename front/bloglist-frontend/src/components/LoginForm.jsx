import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, setUsername, setPassword, username, password }) => (
    <form onSubmit={handleLogin}>
        <div>
            <h2>Login</h2>
            Username
            <input
                type="text"
                id='username'
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            Password
            <input
                type="password"
                id='password'
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit" id='loginButton'>Login</button>
    </form>
)


LoginForm.protoTypes = {
    password: PropTypes.string.isRequired,
    usernmae: PropTypes.string.isRequired,
    handleLogin: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
}

export default LoginForm