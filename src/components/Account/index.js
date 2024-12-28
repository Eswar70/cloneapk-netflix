import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => {
  const username = localStorage.getItem('username') || 'User'
  const password = localStorage.getItem('password') || ''

  const passwordInAsterisk = '*'.repeat(password.length)

  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <Header />
      <div className="account-cont">
        <h1>Account</h1> {/* Main heading for the Account route */}
        <hr />
        <div className="member-cont">
          <p>Member ship</p> {/* Paragraph with text "Member ship" */}
          <div>
            <p>{username}@gmail.com</p>
            <p>Password: {passwordInAsterisk}</p>{' '}
            {/* Paragraph with text "Password" */}
          </div>
        </div>
        <hr />
        <div className="member-cont">
          <p>Plan details</p> {/* Paragraph with text "Plan details" */}
          <div className="premium">
            <p>Premium</p> {/* Paragraph with text "Premium" */}
            <p>Ultra HD</p> {/* Paragraph with text "Ultra HD" */}
          </div>
        </div>
        <hr />
        <div className="button-cont">
          <button type="button" onClick={onClickLogout}>
            Logout {/* Button with text "Logout" */}
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Account
