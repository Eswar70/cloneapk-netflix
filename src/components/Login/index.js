import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onChangeUser = e => this.setState({username: e.target.value})

  onChangePassword = e => this.setState({password: e.target.value})

  onLoginSuccess = jwtToken => {
    const {username, password} = this.state
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  onLoginFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="mainCont">
        <img
          className="loginImg"
          src="https://res.cloudinary.com/dgwvwp4qo/image/upload/v1732854207/k5k3vkkfkgvskeqd5pli.png"
          alt="login website logo"
        />
        <div className="formContainer">
          <form onSubmit={this.onSubmitForm}>
            <h1>Login</h1>
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={this.onChangeUser}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={this.onChangePassword}
            />
            {errorMsg && <p>{errorMsg}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
