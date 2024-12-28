import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footerCont">
    <div className="button-cont">
      <button type="button">
        <FaGoogle size={20} />
      </button>
      <button type="button">
        <FaTwitter size={20} />
      </button>
      <button type="button">
        <FaInstagram size={20} />
      </button>
      <button type="button">
        <FaYoutube size={20} />
      </button>
    </div>
    <p>Contact us</p> {/* Paragraph with text "Contact us" */}
  </div>
)

export default Footer
