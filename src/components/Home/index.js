import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import Trending from '../Trending'
import Originals from '../Originals'
import TopRated from '../TopRated'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    randomPoster: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRandomPoster()
  }

  getRandomPoster = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const dataLength = data.results.length
      const randomOne = data.results[Math.floor(Math.random() * dataLength)]
      const updateData = {
        id: randomOne.id,
        title: randomOne.title,
        overview: randomOne.overview,
        backdropPath: randomOne.backdrop_path,
        posterPath: randomOne.poster_path,
      }

      this.setState({
        randomPoster: {...updateData},
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getRandomPoster()
  }

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        src="https://res.cloudinary.com/dgwvwp4qo/image/upload/v1733027624/Background-Completepopular-failure_b3ltm7.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onRetry}>
        Try Again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {randomPoster} = this.state
    const {title, overview, backdropPath} = randomPoster
    return (
      <div
        className="background-image"
        alt={title}
        style={{
          backgroundImage: `url(${backdropPath})`,
        }}
      >
        <h1>{title}</h1>
        <p>{overview}</p>
        <button type="button">Play</button>
      </div>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderApiStatus()}
        <h1 className="mainHeading">Trending Now</h1>
        <Trending />
        <TopRated />
        <Originals />
        <Footer />
      </>
    )
  }
}

export default Home
